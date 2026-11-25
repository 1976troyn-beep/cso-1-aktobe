const crypto = require("crypto")
const pool = require("./pgdb")
const LANGUAGES = ["kk", "en"]
const memoryCache = new Map()
const inFlight = new Map()
const CACHE_MAX = 1500
const TRANSLATION_VERSION = "v3-documents-refresh"
const MYMEMORY_URL = "https://api.mymemory.translated.net/get"
const MAX_CHUNK_BYTES = 450
function remember(key, value) {
  if (memoryCache.has(key)) memoryCache.delete(key)
  memoryCache.set(key, value)
  if (memoryCache.size > CACHE_MAX) memoryCache.delete(memoryCache.keys().next().value)
}
function getSourceHash(text) {
  return crypto.createHash("sha256").update(`${TRANSLATION_VERSION}\0${text}`).digest("hex")
}
function translationKey(sectionId, fieldName, language, sourceText) {
  return JSON.stringify([sectionId, fieldName, language, getSourceHash(sourceText)])
}
async function getCachedTranslation(sectionId, fieldName, language, sourceText) {
  if (!LANGUAGES.includes(language) || typeof sourceText !== "string" || !sourceText.trim()) return null
  const key = translationKey(sectionId, fieldName, language, sourceText)
  if (memoryCache.has(key)) return memoryCache.get(key)
  const result = await pool.query(
    `SELECT translated_text FROM public.section_translations
     WHERE section_id = $1 AND field_name = $2 AND language = $3 AND source_hash = $4`,
    [sectionId, fieldName, language, getSourceHash(sourceText)]
  )
  const cached = result.rows[0]?.translated_text ?? null
  if (cached !== null) remember(key, cached)
  return cached
}
async function saveTranslation(sectionId, fieldName, language, sourceText, translatedText) {
  if (!LANGUAGES.includes(language)) throw new Error("Unsupported language")
  if (typeof sourceText !== "string" || typeof translatedText !== "string" || !sourceText.trim() || !translatedText.trim()) throw new Error("Invalid translation text")
  await pool.query(
    `INSERT INTO public.section_translations
       (section_id, field_name, language, source_hash, translated_text, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (section_id, field_name, language)
     DO UPDATE SET source_hash = EXCLUDED.source_hash,
       translated_text = EXCLUDED.translated_text, updated_at = NOW()`,
    [sectionId, fieldName, language, getSourceHash(sourceText), translatedText]
  )
  remember(translationKey(sectionId, fieldName, language, sourceText), translatedText)
}
function splitTranslationText(text) {
  const chunks = []
  const sentences = text.match(/[^.!?…]+[.!?…]+(?:["»”])?\s*|[^.!?…]+$/gu) || [text]
  let current = ""
  const flush = () => { if (current.trim()) chunks.push(current.trim()); current = "" }
  const append = part => {
    const value = part.trim()
    if (!value) return
    const joined = current ? `${current} ${value}` : value
    if (Buffer.byteLength(joined, "utf8") <= MAX_CHUNK_BYTES) { current = joined; return }
    flush()
    if (Buffer.byteLength(value, "utf8") <= MAX_CHUNK_BYTES) { current = value; return }
    for (const word of value.match(/\S+/gu) || []) {
      if (Buffer.byteLength(word, "utf8") > MAX_CHUNK_BYTES) throw new Error("Translation contains a word longer than the API limit")
      const next = current ? `${current} ${word}` : word
      if (Buffer.byteLength(next, "utf8") > MAX_CHUNK_BYTES) flush()
      current = current ? `${current} ${word}` : word
    }
  }
  for (const sentence of sentences) append(sentence)
  flush()
  return chunks
}
async function translateWithMyMemory(sourceText, language) {
  if (!LANGUAGES.includes(language)) throw new Error("Unsupported language")
  if (typeof sourceText !== "string" || !sourceText.trim()) throw new Error("Invalid source text")
  const paragraphs = sourceText.split(/(\r?\n\s*\r?\n|\r?\n)/u)
  const output = []
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) { output.push(paragraph); continue }
    const translatedChunks = []
    for (const chunk of splitTranslationText(paragraph)) {
      const params = new URLSearchParams({ q: chunk, langpair: `ru|${language}` })
      if (process.env.MYMEMORY_EMAIL) params.set("de", process.env.MYMEMORY_EMAIL)
      const response = await fetch(`${MYMEMORY_URL}?${params}`, {
        signal: AbortSignal.timeout(12000), headers: { Accept: "application/json" }
      })
      if (!response.ok) throw new Error(`MyMemory HTTP ${response.status}`)
      const data = await response.json()
      if (Number(data.responseStatus) !== 200 || typeof data.responseData?.translatedText !== "string" || !data.responseData.translatedText.trim()) {
        throw new Error(`MyMemory did not return a usable translation (${data.responseStatus || "unknown"})`)
      }
      translatedChunks.push(data.responseData.translatedText.trim())
    }
    output.push(translatedChunks.join(" "))
  }
  return output.join("").trim()
}
async function getOrCreateTranslation(sectionId, fieldName, language, sourceText) {
  if (!LANGUAGES.includes(language)) throw new Error("Unsupported language")
  if (typeof sourceText !== "string" || !sourceText.trim()) return sourceText
  const key = translationKey(sectionId, fieldName, language, sourceText)
  if (memoryCache.has(key)) return memoryCache.get(key)
  if (inFlight.has(key)) return inFlight.get(key)
  const task = (async () => {
    const cached = await getCachedTranslation(sectionId, fieldName, language, sourceText)
    if (cached !== null) return cached
    const translated = await translateWithMyMemory(sourceText, language)
    await saveTranslation(sectionId, fieldName, language, sourceText, translated)
    return translated
  })()
  inFlight.set(key, task)
  try { return await task } finally { inFlight.delete(key) }
}
// Background queue: HTTP responses never wait for external translation requests.
const pendingTranslations = new Map()
const MAX_PENDING = 500
const TRANSLATION_DELAY_MS = 5000
const LIMIT_COOLDOWN_MS = 15 * 60 * 1000
const ERROR_RETRY_MS = 60 * 1000
let queueRunning = false
let queueTimer = null
let nextRequestAt = 0
let blockedUntil = 0
function scheduleQueue(delay = 0) {
  if (queueRunning || queueTimer || !pendingTranslations.size) return
  queueTimer = setTimeout(() => { queueTimer = null; void runTranslationQueue() }, Math.max(0, delay))
  queueTimer.unref?.()
}
function enqueueTranslation(sectionId, fieldName, language, sourceText) {
  if (!LANGUAGES.includes(language) || typeof sourceText !== "string" || !sourceText.trim()) return
  const key = translationKey(sectionId, fieldName, language, sourceText)
  if (memoryCache.has(key) && memoryCache.get(key)?.trim() !== sourceText.trim()) return
  if (pendingTranslations.has(key) || pendingTranslations.size >= MAX_PENDING) return
  pendingTranslations.set(key, { sectionId, fieldName, language, sourceText, failures: 0, readyAt: 0 })
  scheduleQueue(Math.max(0, blockedUntil - Date.now()))
}
async function runTranslationQueue() {
  if (queueRunning) return
  queueRunning = true
  try {
    while (pendingTranslations.size) {
      const now = Date.now()
      if (now < blockedUntil || now < nextRequestAt) break
      let selected = null
      for (const [key, job] of pendingTranslations) {
        if (job.readyAt <= now) { selected = [key, job]; break }
      }
      if (!selected) break
      const [key, job] = selected
      pendingTranslations.delete(key)
      try {
        const cached = await getCachedTranslation(job.sectionId, job.fieldName, job.language, job.sourceText)
        if (cached !== null && cached.trim() !== job.sourceText.trim()) continue
        nextRequestAt = Date.now() + TRANSLATION_DELAY_MS
        const translated = await translateWithMyMemory(job.sourceText, job.language)
        if (translated.trim() !== job.sourceText.trim()) {
          await saveTranslation(job.sectionId, job.fieldName, job.language, job.sourceText, translated)
          console.log(`Translation saved: ${job.sectionId}/${job.fieldName} (${job.language})`)
        } else {
          console.warn(`Translation unchanged: ${job.sectionId}/${job.fieldName} (${job.language})`)
        }
      } catch (error) {
        const limited = /HTTP 429|quota|rate limit|responseStatus.*429/i.test(error.message)
        if (limited) {
          blockedUntil = Date.now() + LIMIT_COOLDOWN_MS
          job.readyAt = blockedUntil
          console.warn("MyMemory HTTP 429: queue retained; retry scheduled in 15 minutes")
        } else {
          job.failures += 1
          job.readyAt = Date.now() + Math.min(ERROR_RETRY_MS * 2 ** Math.min(job.failures - 1, 5), 30 * 60 * 1000)
          console.warn(`Background translation failed: ${job.sectionId}/${job.fieldName}:`, error.message)
        }
        pendingTranslations.set(key, job)
        if (limited) break
      }
    }
  } finally {
    queueRunning = false
    if (pendingTranslations.size) {
      const earliest = Math.min(...Array.from(pendingTranslations.values(), job => job.readyAt))
      scheduleQueue(Math.max(0, blockedUntil - Date.now(), nextRequestAt - Date.now(), earliest - Date.now()))
    }
  }
}
module.exports = { getCachedTranslation, saveTranslation, translateWithMyMemory, getOrCreateTranslation, enqueueTranslation }





