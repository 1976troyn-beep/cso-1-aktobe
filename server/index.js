const express = require("express")
const cors = require("cors")
const multer = require("multer")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { createClient } = require("@supabase/supabase-js")
require("dotenv").config()
const WebSocket = require("ws")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const pool = require("./pgdb")
const { getCachedTranslation, enqueueTranslation } = require("./translations")
const app = express()
const PORT = process.env.PORT || 4000
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    realtime: {
      transport: WebSocket,
    },
  }
)
app.use(
  cors({
    origin: [
      "https://cso-1-aktobe.vercel.app",
      "http://localhost:5173",
      "http://localhost:4173",
    ],
    credentials: true,
  })
)
app.use(express.json({ limit: "1mb" }))
const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: "Слишком много отправок. Попробуйте позже." } })
const translationLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, skip: req => !["kk", "en"].includes(req.query.lang), message: { message: "Слишком много запросов. Попробуйте позже." } })
function validText(value, max, required = false) {
  return typeof value === "string" && value.length <= max && (!required || !!value.trim())
}
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Слишком много попыток входа. Попробуйте позже.",
  },
})
const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID =
  process.env.TELEGRAM_CHAT_ID
async function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return
  }
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        }),
      }
    )
  } catch (error) {
    console.error("TELEGRAM ERROR: notification failed")
  }
}
async function query(sql, params = []) {
  const result = await pool.query(sql, params)
  return result.rows
}
function getAqtobeDateTime() {
  return new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Aqtobe",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}
function parseMedia(media) {
  try {
    if (typeof media === "string") {
      return JSON.parse(media || "[]")
    }
    return media || []
  } catch {
    return []
  }
}
function fixMediaUrl(item) {
  if (!item || typeof item !== "object") return item
  return {
    ...item,
    src: item.src?.replace("http://localhost:4000", SERVER_URL),
    preview: item.preview?.replace("http://localhost:4000", SERVER_URL),
  }
}
function normalizeMedia(media) {
  const parsed = parseMedia(media)
  if (Array.isArray(parsed)) {
    return parsed.map(fixMediaUrl)
  }
  if (parsed && typeof parsed === "object") {
    const result = {}
    Object.entries(parsed).forEach(([key, value]) => {
      result[key] = Array.isArray(value)
        ? value.map(fixMediaUrl)
        : value
    })
    return result
  }
  return []
}
const MAX_UPLOAD_SIZE = 30 * 1024 * 1024 // 30 MB на один файл
const MAX_UPLOAD_FILES = 10
const DOCUMENT_MIME_TYPES = new Map([
  [".pdf", "application/pdf"],
  [".doc", "application/msword"],
  [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
])
function getDocumentExtension(filename = "") {
  const match = filename.toLowerCase().match(/\.(pdf|doc|docx)$/)
  return match ? `.${match[1]}` : null
}
// Проверяем сигнатуру документа, а не только расширение файла.
function isValidDocumentBuffer(file, extension) {
  const buffer = file.buffer
  if (!buffer || buffer.length < 8) return false
  if (extension === ".pdf") {
    return buffer.subarray(0, 5).toString("ascii") === "%PDF-"
  }
  if (extension === ".doc") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
    )
  }
  if (extension === ".docx") {
    // DOCX — ZIP-контейнер. Для полной проверки структуры нужен ZIP-парсер.
    return buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))
  }
  return false
}
const MEDIA_TYPES = new Map([
  [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".png", "image/png"],
  [".webp", "image/webp"], [".gif", "image/gif"], [".mp4", "video/mp4"],
  [".mov", "video/quicktime"], [".webm", "video/webm"], [".m4v", "video/mp4"],
])
function getUploadExtension(name) { return /\.[a-z0-9]+$/i.exec(name)?.[0].toLowerCase() }
function resolveUploadExtension(file) {
  const ext = getUploadExtension(file.originalname)
  if (ext) return ext
  return [...MEDIA_TYPES].find(([, mime]) => mime.startsWith("image/") && mime === file.mimetype)?.[0]
}
function validMediaBuffer(file, ext) {
  const b = file.buffer
  if (!b || b.length < 12) return false
  const ascii = (start, end) => b.toString("ascii", start, end)
  if ([".jpg", ".jpeg"].includes(ext)) return b[0] === 255 && b[1] === 216 && b[2] === 255
  if (ext === ".png") return b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  if (ext === ".gif") return ["GIF87a", "GIF89a"].includes(ascii(0, 6))
  if (ext === ".webp") return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"
  if ([".mp4", ".mov", ".m4v"].includes(ext)) return ascii(4, 8) === "ftyp" && b.readUInt32BE(0) >= 16 && b.readUInt32BE(0) <= b.length
  if (ext === ".webm") return b.subarray(0, 4).equals(Buffer.from([26, 69, 223, 163])) && b.subarray(4, 4096).includes(Buffer.from("webm"))
  return false
}
const MAX_UPLOAD_TOTAL = 60 * 1024 * 1024
const uploadLimiter = rateLimit({ windowMs: 60_000, max: 30, message: { message: "Слишком много загрузок. Попробуйте позже." } })
// Limit buffered bytes while reading, including requests without Content-Length.
const uploadStorage = {
  _handleFile(req, file, cb) {
    const chunks = []
    let size = 0, failed = false
    file.stream.on("data", chunk => {
      req.uploadBytes = (req.uploadBytes || 0) + chunk.length
      if (req.uploadBytes > MAX_UPLOAD_TOTAL) { failed = true; chunks.length = 0; return }
      if (!failed) { chunks.push(chunk); size += chunk.length }
    })
    file.stream.once("error", error => { failed = true; chunks.length = 0; cb(error) })
    file.stream.on("end", () => {
      if (failed) return cb(new Error("Общий размер файлов превышает 60 МБ"))
      cb(null, { buffer: Buffer.concat(chunks, size), size })
    })
  },
  _removeFile(req, file, cb) { delete file.buffer; cb(null) },
}
const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: MAX_UPLOAD_SIZE, files: MAX_UPLOAD_FILES, fields: 0, parts: MAX_UPLOAD_FILES + 1 },
  fileFilter(req, file, cb) {
    const ext = resolveUploadExtension(file)
    if (!DOCUMENT_MIME_TYPES.has(ext) && !MEDIA_TYPES.has(ext)) return cb(new Error("Неподдерживаемый формат файла"))
    cb(null, true)
  },
})
function verifyAdmin(req, res, next) {
  const match = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization || "")
  if (!match) return res.status(401).json({ message: "Нет токена" })
  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ["HS256"] })
    if (payload.role !== "admin") return res.status(403).json({ message: "Нет доступа" })
  } catch {
    return res.status(403).json({ message: "Неверный токен" })
  }
  next()
}
// Short-lived in-process cache for the public Russian sections response.
// A generation counter prevents an old in-flight read from restoring invalidated data.
const SECTIONS_CACHE_MS = 30_000
let sectionsCache = null
let sectionsReadPromise = null
let sectionsGeneration = 0
function invalidateSectionsCache() {
  sectionsGeneration += 1
  sectionsCache = null
  sectionsReadPromise = null
}
async function getRussianSections(loadSections) {
  if (sectionsCache && Date.now() < sectionsCache.expiresAt) return sectionsCache.data
  if (sectionsReadPromise) return sectionsReadPromise
  const generation = sectionsGeneration
  const pending = (async () => {
    const data = await loadSections()
    if (generation === sectionsGeneration) {
      sectionsCache = { data, expiresAt: Date.now() + SECTIONS_CACHE_MS }
    }
    return data
  })()
  sectionsReadPromise = pending
  try {
    return await pending
  } finally {
    if (sectionsReadPromise === pending) sectionsReadPromise = null
  }
}
// All editable section text fields use the same cached, non-blocking translation path.
const TRANSLATABLE_SECTION_FIELDS = ["heading", "text", "card_title", "card_text",
  ...Array.from({ length: 6 }, (_, i) => [`card_${i + 1}_title`, `card_${i + 1}_text`]).flat()]
function queueSectionTranslations(section) {
  for (const field of TRANSLATABLE_SECTION_FIELDS) {
    const source = section[field]
    if (typeof source !== "string" || !source.trim()) continue
    for (const language of ["kk", "en"]) enqueueTranslation(section.id, field, language, source)
  }
}
// Queue only files removed from a successfully saved row.
function cleanupPaths(value) {
  const paths = new Set(), origin = new URL(process.env.SUPABASE_URL).origin
  const prefix = "/storage/v1/object/public/uploads/"
  function visit(v) {
    if (typeof v === "string") {
      if (/^\s*[\[{]/.test(v)) { try { visit(JSON.parse(v)) } catch {} }
      try {
        const url = new URL(v)
        if (url.origin !== origin || !url.pathname.startsWith(prefix)) return
        const name = decodeURIComponent(url.pathname.slice(prefix.length))
        if (name && !name.includes("/") && !name.includes("\\") && ![".", ".."].includes(name)) paths.add(name)
      } catch { /* not a storage URL */ }
    } else if (v && typeof v === "object") Object.values(v).forEach(visit)
  }
  visit(value)
  return paths
}
async function assertStoragePathsExist(client, paths) {
  const names = [...new Set(paths)]
  if (!names.length) return
  const result = await client.query(
    "SELECT name FROM storage.objects WHERE bucket_id = 'uploads' AND name = ANY($1::text[])",
    [names]
  )
  const existing = new Set(result.rows.map(row => row.name))
  for (const name of names) {
    if (!existing.has(name)) throw Error("Storage file no longer exists: " + name)
  }
}
async function saveWithCleanupQueue(table, id, sql, params) {
  if (!["sections", "official_sections", "partners"].includes(table)) throw Error("Invalid cleanup table")
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const previous = await client.query(`SELECT * FROM public.${table} WHERE id = $1 FOR UPDATE`, [id])
    const result = await client.query(sql, params)
    if (previous.rows.length && result.rowCount) {
      const before = cleanupPaths(previous.rows[0])
      const after = result.command === "DELETE" ? new Set() : cleanupPaths(result.rows[0] || {})
      await assertStoragePathsExist(client, after)
      const removed = [...before].filter(name => !after.has(name))
      const retained = [...after]
      if (removed.length) {
        await client.query(`INSERT INTO public.storage_cleanup_queue (object_path)
          SELECT unnest($1::text[])
          ON CONFLICT (object_path) DO UPDATE SET created_at = NOW(), delete_after = NOW() + INTERVAL '7 days', attempts = 0, last_error = NULL`, [removed])
      }
      if (retained.length) {
        await client.query("DELETE FROM public.storage_cleanup_queue WHERE object_path = ANY($1::text[])", [retained])
      }
    }
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {})
    throw error
  } finally { client.release() }
}
/* ===================== SECTIONS ===================== */
app.get("/api/sections", translationLimiter, async (req, res) => {
  res.set("Cache-Control", "no-store")
  try {
    const language = req.query.lang
    if (language && !["ru", "kk", "en"].includes(language)) {
      return res.status(400).json({ message: "Unsupported language" })
    }
    const loadSections = async () => {
      const sections = await query(`
      SELECT *
      FROM sections
      ORDER BY
        CASE id
          WHEN 'hero' THEN 1
          WHEN 'services' THEN 2
          WHEN 'conditions' THEN 3
          WHEN 'rooms' THEN 4
          WHEN 'disability' THEN 5
          WHEN 'leadership' THEN 6
          WHEN 'specialists' THEN 7
          WHEN 'news' THEN 8
          WHEN 'documents' THEN 9
          WHEN 'reviews' THEN 10
          WHEN 'partners' THEN 11
          WHEN 'contacts' THEN 12
          ELSE 99
        END
    `)
      return sections.map((section) => ({
        ...section,
        media: normalizeMedia(section.media),
      }))
    }
    const parsedSections = ["kk", "en"].includes(language)
      ? await loadSections()
      : await getRussianSections(loadSections)
    if (!["kk", "en"].includes(language)) return res.json(parsedSections)
    // Return cached translations immediately; missing translations are queued in the background.
    const translatedSections = await Promise.all(parsedSections.map(async section => {
      const translated = { ...section }
      const fields = TRANSLATABLE_SECTION_FIELDS
      await Promise.all(fields.filter(field => typeof section[field] === "string" && section[field].trim()).map(async field => {
        const source = section[field]
        try {
          const cached = await getCachedTranslation(section.id, field, language, source)
          if (cached !== null && cached.trim() !== source.trim()) translated[field] = cached
          else enqueueTranslation(section.id, field, language, source)
        } catch (error) { console.warn(`Translation cache failed: ${section.id}/${field}:`, error.message) }
      }))
      return translated
    }))
    res.json(translatedSections)
  } catch (error) {
    console.error("SECTIONS ERROR:", error)
    res.status(500).json({
      message: "Ошибка загрузки sections",
    })
  }
})
app.put("/api/sections/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params
  const {
    heading,
    text,
    card_title,
    card_text,
    card_1_title,
    card_1_text,
    card_2_title,
    card_2_text,
    card_3_title,
    card_3_text,
    card_4_title,
    card_4_text,
    card_5_title,
    card_5_text,
    card_6_title,
    card_6_text,
    media,
    new_publications,
    publication_dates,
  } = req.body
  try {
    // Store an independent publication date for each news card inside media.
    // Existing dates are preserved on ordinary edits.
    let mediaToSave = media || []
    if (id === "news") {
      const existing = await pool.query("SELECT media FROM sections WHERE id = $1", [id])
      const previousMedia = normalizeMedia(existing.rows[0]?.media)
      const previousDates = previousMedia && !Array.isArray(previousMedia)
        ? previousMedia.news_dates || {} : {}
      const parsedIncoming = parseMedia(media)
      const incoming = parsedIncoming && !Array.isArray(parsedIncoming) && typeof parsedIncoming === "object"
        ? parsedIncoming : {}
      const incomingDates = incoming.news_dates && typeof incoming.news_dates === "object"
        ? incoming.news_dates : {}
      const dates = { ...previousDates }
      const manualDates = publication_dates && typeof publication_dates === "object" && !Array.isArray(publication_dates)
        ? publication_dates : {}
      // Accept explicit dates in media as well as publication_dates from the admin.
      const selectedDates = { ...incomingDates, ...manualDates } // ручная дата имеет приоритет
      const isValidISODate = (value) => {
        if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
        const date = new Date(`${value}T12:00:00Z`)
        return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
      }
      for (const [key, value] of Object.entries(selectedDates)) {
        if (!/^card_[1-4]$/.test(key) || !isValidISODate(value)) {
          return res.status(400).json({ message: "Некорректная дата публикации" })
        }
      }
      const requested = Array.isArray(new_publications)
        ? new_publications.filter((value) => Number.isInteger(value) && value >= 1 && value <= 4)
        : []
      // Use ISO date independent of server locale.
      const dateParts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Aqtobe", year: "numeric", month: "2-digit", day: "2-digit"
      }).formatToParts(new Date())
      const part = (type) => dateParts.find((item) => item.type === type)?.value
      const today = `${part("year")}-${part("month")}-${part("day")}`
      for (let i = 1; i <= 4; i++) {
        const key = `card_${i}`
        const hasContent = Boolean(String(req.body[`card_${i}_title`] || "").trim()
          || String(req.body[`card_${i}_text`] || "").trim()
          || (Array.isArray(incoming[key]) && incoming[key].length))
        if (Object.hasOwn(selectedDates, key)) {
          dates[key] = selectedDates[key]
        } else if (requested.includes(i)) {
          dates[key] = today
        } else if (!dates[key] && hasContent) {
          const supplied = incomingDates[key]
          dates[key] = typeof supplied === "string" && /^\d{4}-\d{2}-\d{2}$/.test(supplied)
            ? supplied : today
        }
      }
      mediaToSave = { ...incoming, news_dates: dates }
    }
    const savedSection = await saveWithCleanupQueue("sections", id,
      `
      UPDATE sections
      SET
        heading = $1,
        text = $2,
        card_title = $3,
        card_text = $4,
        card_1_title = $5,
        card_1_text = $6,
        card_2_title = $7,
        card_2_text = $8,
        card_3_title = $9,
        card_3_text = $10,
        card_4_title = $11,
        card_4_text = $12,
        card_5_title = $13,
        card_5_text = $14,
        card_6_title = $15,
        card_6_text = $16,
        media = $17,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $18
      RETURNING *
      `,
      [
        heading || "",
        text || "",
        card_title || "",
        card_text || "",
        card_1_title || "",
        card_1_text || "",
        card_2_title || "",
        card_2_text || "",
        card_3_title || "",
        card_3_text || "",
        card_4_title || "",
        card_4_text || "",
        card_5_title || "",
        card_5_text || "",
        card_6_title || "",
        card_6_text || "",
        JSON.stringify(mediaToSave),
        id,
      ]
    )
    if (!savedSection.rows.length) return res.status(404).json({ message: "Раздел не найден" })
    invalidateSectionsCache()
    queueSectionTranslations({ id, heading, text, card_title, card_text,
      card_1_title, card_1_text, card_2_title, card_2_text, card_3_title, card_3_text,
      card_4_title, card_4_text, card_5_title, card_5_text, card_6_title, card_6_text })
    const savedMedia = normalizeMedia(savedSection.rows[0].media)
    const savedDates = savedMedia && !Array.isArray(savedMedia) ? savedMedia.news_dates || {} : {}
    if (id === "news") {
      // Проверяем именно сохранённые даты, а не только успешный статус SQL.
      const requestedDates = publication_dates && typeof publication_dates === "object" ? publication_dates : {}
      const mismatch = Object.entries(requestedDates).find(([key, value]) => savedDates[key] !== value)
      if (mismatch) {
        console.error("NEWS DATE SAVE MISMATCH:", { requestedDates, savedDates })
        return res.status(500).json({
          message: "Дата публикации не записалась в базу данных",
          requested_dates: requestedDates,
          news_dates: savedDates,
        })
      }
    }
    res.json({ message: "Раздел успешно сохранён", ...(id === "news" ? { news_dates: savedDates } : {}) })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка сохранения раздела",
    })
  }
})
// Opt-in translation: requests without ?lang=kk/en retain the original response.
// Translate all editable text fields while preserving images, URLs and layout.
async function translateOfficialSection(row, language) {
  if (!["kk", "en"].includes(language)) return row
  const result = { ...row }
  const tasks = []
  const schedule = (container, field, key) => {
    const source = container[field]
    if (typeof source !== "string" || !source.trim()) return
    tasks.push(async () => {
      try {
        const cached = await getCachedTranslation(`official:${row.id}`, key, language, source)
        if (cached !== null && cached.trim() !== source.trim()) container[field] = cached
        else enqueueTranslation(`official:${row.id}`, key, language, source)
      } catch (error) {
        console.warn(`Translation failed for ${row.id}/${key}:`, error.message)
      }
    })
  }
  for (const field of ["title", "heading", "content"]) schedule(result, field, field)
  // Normalize media once; never mutate the database's original objects.
  const media = normalizeMedia(row.media)
  if (Array.isArray(media)) {
    result.media = media.map(item => item && typeof item === "object" ? { ...item } : item)
    result.media.forEach((item, index) => {
      if (!item || typeof item !== "object") return
      for (const field of ["title", "text", "description", "documentType"]) {
        schedule(item, field, `media:${item.id || index}:${field}`)
      }
    })
  }
  // Limit concurrent DB/API requests rather than flooding the free service.
  const workers = Array.from({ length: Math.min(3, tasks.length) }, async (_, worker) => {
    for (let i = worker; i < tasks.length; i += 3) await tasks[i]()
  })
  await Promise.all(workers)
  return result
}
/* ===================== OFFICIAL SECTIONS ===================== */
// Публичное чтение. Данные изменяются только через защищённый маршрут ниже.
app.get("/api/official-sections", translationLimiter, async (req, res) => {
  try {
    const rows = await query(`
      SELECT id, title, heading, content, media, updated_at
      FROM public.official_sections
      ORDER BY CASE id
        WHEN 'about' THEN 1
        WHEN 'anticorruption' THEN 2
        WHEN 'legal' THEN 3
        WHEN 'services' THEN 4
        WHEN 'appeals' THEN 5
        ELSE 99
      END
    `)
    const language = req.query.lang
    if (language && !["ru", "kk", "en"].includes(language)) {
      return res.status(400).json({ message: "Unsupported language" })
    }
    const translated = await Promise.all(rows.map((row) => translateOfficialSection(row, language)))
    res.json(translated.map((row) => ({ ...row, media: normalizeMedia(row.media) })))
  } catch (error) {
    console.error("OFFICIAL SECTIONS ERROR:", error)
    res.status(500).json({ message: "Ошибка загрузки официальных разделов" })
  }
})
app.get("/api/official-sections/:id", translationLimiter, async (req, res) => {
  try {
    const rows = await query(`
      SELECT id, title, heading, content, media, updated_at
      FROM public.official_sections WHERE id = $1
    `, [req.params.id])
    if (!rows.length) {
      return res.status(404).json({ message: "Раздел не найден" })
    }
    const language = req.query.lang
    if (language && !["ru", "kk", "en"].includes(language)) {
      return res.status(400).json({ message: "Unsupported language" })
    }
    const translated = await translateOfficialSection(rows[0], language)
    res.json({ ...translated, media: normalizeMedia(translated.media) })
  } catch (error) {
    console.error("OFFICIAL SECTION ERROR:", error)
    res.status(500).json({ message: "Ошибка загрузки раздела" })
  }
})
app.put("/api/official-sections/:id", verifyAdmin, async (req, res) => {
  const { heading, content, media } = req.body || {}
  const allowedTypes = ["text", "image", "video", "document", "media-text", "link"]
  const invalidMedia = Array.isArray(media) && media.some((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return true
    if (!allowedTypes.includes(item.type)) return true
    if (item.type === "link") {
      if (typeof item.url !== "string" || typeof item.title !== "string" || typeof item.text !== "string" || typeof item.description !== "string") return true
      if (item.url.length > 2048 || item.title.length > 500 || item.text.length > 500 || item.description.length > 5000) return true
      try { const url = new URL(item.url); return url.protocol !== "https:" || !url.hostname.includes(".") || !!url.username || !!url.password } catch { return true }
    }
    if (item.type === "text") return typeof item.text !== "string"
    if (item.type === "media-text") return (
      typeof item.text !== "string" ||
      typeof item.src !== "string" ||
      item.src.length > 2048 ||
      !["image", "video"].includes(item.mediaType)
    )
    return typeof item.src !== "string" || item.src.length > 2048
  })
  if (typeof heading !== "string" || typeof content !== "string" ||
      !Array.isArray(media) || heading.length > 500 || content.length > 200000 ||
      media.length > 100 || invalidMedia) {
    return res.status(400).json({ message: "Некорректные данные раздела" })
  }
  try {
    const result = await saveWithCleanupQueue("official_sections", req.params.id, `
      UPDATE public.official_sections
      SET heading = $1, content = $2, media = $3::jsonb, updated_at = NOW()
      WHERE id = $4
      RETURNING id, title, heading, content, media, updated_at
    `, [heading, content, JSON.stringify(media), req.params.id])
    if (!result.rows.length) {
      return res.status(404).json({ message: "Раздел не найден" })
    }
    // Queue new official text without delaying the admin save response.
    const saved = result.rows[0]
    for (const language of ["kk", "en"]) {
      for (const field of ["heading", "content"]) enqueueTranslation(`official:${saved.id}`, field, language, saved[field])
      normalizeMedia(saved.media).forEach((item, index) => {
        if (!item || typeof item !== "object") return
        for (const field of ["title", "text", "description", "documentType"])
          enqueueTranslation(`official:${saved.id}`, `media:${item.id || index}:${field}`, language, item[field])
      })
    }
    res.json({ ...saved, media: normalizeMedia(saved.media) })
  } catch (error) {
    console.error("OFFICIAL SAVE ERROR:", error)
    res.status(500).json({ message: "Ошибка сохранения официального раздела" })
  }
})
/* ===================== REVIEWS ===================== */
app.get("/api/reviews", verifyAdmin, async (req, res) => {
  try {
    const reviews = await query(`
      SELECT *
      FROM reviews
      ORDER BY id DESC
    `)
    res.json(reviews)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка загрузки отзывов",
    })
  }
})
app.get("/api/reviews/approved", async (req, res) => {
  try {
    const reviews = await query(`
      SELECT id, name, text, rating, role, approved, created_at
      FROM reviews
      WHERE approved = 1
      ORDER BY id DESC
    `)
    res.json(reviews)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка загрузки опубликованных отзывов",
    })
  }
})
app.post("/api/reviews", formLimiter, async (req, res) => {
  const { name, phone, text, rating, role } = req.body || {}
  if (!validText(name, 200, true) || !validText(phone, 50, true) || !validText(text, 10000, true) || (role != null && !validText(role, 200)) || (rating != null && (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5))) {
    return res.status(400).json({
      message: "Заполните все обязательные поля",
    })
  }
  try {
    const createdAt = getAqtobeDateTime()
    await pool.query(
      `
      INSERT INTO reviews (
        name,
        phone,
        text,
        rating,
        role,
        approved,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, 0, $6)
      `,
      [
        name.trim(),
        phone.trim(),
        text.trim(),
        Number(rating) || 5,
        role || "Посетитель",
        createdAt,
      ]
    )
    await sendTelegramMessage(
        `💬 Новый отзыв на сайте
      Имя: ${name}
      Телефон: ${phone}
      Оценка: ${Number(rating) || 5}
      Роль: ${role || "Посетитель"}
      Текст:
      ${text}`
      )
    res.json({
      message: "Отзыв отправлен на модерацию",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка отправки отзыва",
    })
  }
})
app.patch("/api/reviews/:id/approve", verifyAdmin, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      `
      UPDATE reviews
      SET approved = 1
      WHERE id = $1
      `,
      [id]
    )
    res.json({
      message: "Отзыв опубликован",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка публикации отзыва",
    })
  }
})
app.patch("/api/reviews/:id/hide", verifyAdmin, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      `
      UPDATE reviews
      SET approved = 0
      WHERE id = $1
      `,
      [id]
    )
    res.json({
      message: "Отзыв скрыт",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка скрытия отзыва",
    })
  }
})
app.delete("/api/reviews/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      `
      DELETE FROM reviews
      WHERE id = $1
      `,
      [id]
    )
    res.json({
      message: "Отзыв удалён",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка удаления отзыва",
    })
  }
})
/* ===================== PARTNERS ===================== */
app.get("/api/partners", async (req, res) => {
  try {
    const partners = await query(`
      SELECT *
      FROM partners
      WHERE visible = 1
      ORDER BY id DESC
    `)
    res.json(partners)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка загрузки партнёров",
    })
  }
})
app.get("/api/admin/partners", verifyAdmin, async (req, res) => {
  try {
    const partners = await query(`
      SELECT *
      FROM partners
      ORDER BY id DESC
    `)
    res.json(partners)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка загрузки партнёров",
    })
  }
})
app.post("/api/partners", verifyAdmin, async (req, res) => {
  const { title, description, link, logo } = req.body
  if (!title) {
    return res.status(400).json({
      message: "Название партнёра обязательно",
    })
  }
  try {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      await client.query("LOCK TABLE public.partners IN ROW EXCLUSIVE MODE")
      await assertStoragePathsExist(client, cleanupPaths({ title, description, link, logo }))
      await client.query(
      `
      INSERT INTO partners (
        title,
        description,
        link,
        logo
      )
      VALUES ($1, $2, $3, $4)
      `,
      [title || "", description || "", link || "", logo || ""]
    )
      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {})
      throw error
    } finally { client.release() }
    res.json({
      message: "Партнёр добавлен",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка добавления партнёра",
    })
  }
})
app.patch("/api/partners/:id/hide", verifyAdmin, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      `
      UPDATE partners
      SET visible = 0
      WHERE id = $1
      `,
      [id]
    )
    res.json({
      message: "Партнёр скрыт",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка скрытия партнёра",
    })
  }
})
app.patch("/api/partners/:id/show", verifyAdmin, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      `
      UPDATE partners
      SET visible = 1
      WHERE id = $1
      `,
      [id]
    )
    res.json({
      message: "Партнёр опубликован",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка публикации партнёра",
    })
  }
})
app.delete("/api/partners/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params
  try {
    await saveWithCleanupQueue("partners", id,
      `
      DELETE FROM partners
      WHERE id = $1
      RETURNING *
      `,
      [id]
    )
    res.json({
      message: "Партнёр удалён",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка удаления партнёра",
    })
  }
})
/* ===================== APPLICATIONS ===================== */
app.post("/api/applications", formLimiter, async (req, res) => {
  const { full_name, phone, email, message } = req.body || {}
  if (!validText(full_name, 200, true) || !validText(phone, 50, true) || (email != null && !validText(email, 320)) || (message != null && !validText(message, 10000))) {
    return res.status(400).json({
      message: "Заполните имя и телефон",
    })
  }
  try {
    await pool.query(
      `
      INSERT INTO applications (
        full_name,
        phone,
        email,
        message
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        full_name.trim(),
        phone.trim(),
        email || "",
        message || "",
      ]
    )
    res.json({
      message: "Заявка успешно отправлена",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка отправки заявки",
    })
  }
})
app.get("/api/admin/applications", verifyAdmin, async (req, res) => {
  try {
    const applications = await query(`
      SELECT *
      FROM applications
      ORDER BY id DESC
    `)
    res.json(applications)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка загрузки заявок",
    })
  }
})
// Обновление статуса заявки (только для администратора).
app.patch("/api/admin/applications/:id/status", verifyAdmin, async (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}
  const allowedStatuses = ["new", "in_progress", "completed"]
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Недопустимый статус заявки" })
  }
  try {
    const result = await pool.query(
      `UPDATE applications SET status = $1 WHERE id = $2 RETURNING id, status`,
      [status, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Заявка не найдена" })
    }
    res.json({ message: "Статус заявки обновлён", application: result.rows[0] })
  } catch (error) {
    console.error("APPLICATION STATUS ERROR:", error)
    res.status(500).json({ message: "Ошибка обновления статуса заявки" })
  }
})
app.delete("/api/applications/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      `
      DELETE FROM applications
      WHERE id = $1
      `,
      [id]
    )
    res.json({
      message: "Заявка удалена",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Ошибка удаления заявки",
    })
  }
})
/* ===================== UPLOAD ===================== */
let activeUploads = 0
app.post("/api/upload", verifyAdmin, uploadLimiter, (req, res, next) => {
  if (activeUploads >= 1) return res.status(429).json({ message: "Дождитесь завершения предыдущей загрузки" })
  activeUploads++
  let released = false
  const release = () => { if (!released) { released = true; activeUploads-- } }
  res.once("finish", release)
  res.once("close", release)
  upload.array("files", MAX_UPLOAD_FILES)(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message || "Ошибка загрузки файлов" })
    }
    next()
  })
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Файлы не выбраны" })
    }
    // Проверка всех файлов до отправки в хранилище.
    for (const file of req.files) {
      const extension = getDocumentExtension(file.originalname)
      if (extension ? !isValidDocumentBuffer(file, extension) : !validMediaBuffer(file, resolveUploadExtension(file))) {
        return res.status(400).json({
          message: `Файл ${file.originalname} не соответствует заявленному формату`,
        })
      }
    }
    const uploadedFiles = []
    for (const file of req.files) {
      const extension = getDocumentExtension(file.originalname)
      const safeName = (getUploadExtension(file.originalname) ? file.originalname : file.originalname + resolveUploadExtension(file))
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]/g, "")
        .slice(-120) || "file"
      const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`
      const contentType = extension
        ? DOCUMENT_MIME_TYPES.get(extension)
        : MEDIA_TYPES.get(resolveUploadExtension(file))
      const { error } = await supabase.storage
        .from("uploads")
        .upload(fileName, file.buffer, {
          contentType,
          upsert: false,
        })
      if (error) throw error
      const { data } = supabase.storage
        .from("uploads")
        .getPublicUrl(fileName)
      const type = extension
        ? "document"
        : contentType.startsWith("video/") ? "video" : "image"
      uploadedFiles.push({
        id: fileName,
        type,
        src: data.publicUrl,
        preview: type === "document" && extension !== ".pdf"
          ? null : data.publicUrl,
        name: file.originalname,
        ...(extension ? { format: extension.slice(1) } : {}),
      })
    }
    res.json(uploadedFiles)
  } catch (error) {
    console.error("UPLOAD ERROR:", error)
    res.status(500).json({ message: "Ошибка загрузки файлов" })
  }
})
/* ===================== ADMIN LOGIN ===================== */
app.post(
  "/api/admin/login",
  loginLimiter,
  async (req, res) => {
    const { login, password } = req.body || {}
    if (!validText(login, 200, true) || !validText(password, 256, true)) {
      return res.status(400).json({
        message: "Введите логин и пароль",
      })
    }
    const validLogin =
      login === process.env.ADMIN_LOGIN
    const validPassword =
      await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD
      )
    if (!validLogin || !validPassword) {
      return res.status(401).json({
        message: "Неверный логин или пароль",
      })
    }
    const token = jwt.sign(
      {
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
        algorithm: "HS256",
      }
    )
    res.json({
      token,
    })
  }
)
// Deletion is opt-in; bulk mode requires a separate explicit flag.
const CLEANUP_TABLES = ["applications", "official_sections", "partners", "reviews", "section_translations", "sections"]
const CLEANUP_TEST_PATH = process.env.STORAGE_CLEANUP_TEST_PATH || ""
const CLEANUP_ENABLED = process.env.STORAGE_CLEANUP_ENABLED === "true"
const CLEANUP_AUTO = process.env.STORAGE_CLEANUP_AUTO === "true"
function validCleanupName(name) {
  return typeof name === "string" && /^[\p{L}\p{N}_.-]+$/u.test(name) && ![".", ".."].includes(name)
}
async function deleteQueuedObject(name) {
  if (!validCleanupName(name)) return
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await client.query("SET LOCAL lock_timeout = '5s'")
    // Block concurrent content writes while checking references and removing the object.
    await client.query(`LOCK TABLE ${CLEANUP_TABLES.map(t => "public." + t).join(", ")} IN SHARE ROW EXCLUSIVE MODE`)
    const { rows } = await client.query("SELECT object_path FROM public.storage_cleanup_queue WHERE object_path = $1 AND delete_after <= NOW() FOR UPDATE", [name])
    if (!rows.length) { await client.query("COMMIT"); return }
    for (const table of CLEANUP_TABLES) {
      const result = await client.query(`SELECT 1 FROM public.${table} t WHERE strpos(lower(to_jsonb(t)::text), lower($1)) > 0 OR strpos(lower(to_jsonb(t)::text), lower($2)) > 0 LIMIT 1`, [name, encodeURIComponent(name)])
      if (result.rowCount) {
        await client.query("DELETE FROM public.storage_cleanup_queue WHERE object_path = $1", [name])
        await client.query("COMMIT")
        console.log(`[storage-cleanup] PROTECTED: ${name}`)
        return
      }
    }
    const { error } = await supabase.storage.from("uploads").remove([name])
    if (error) throw error
    const remaining = await client.query("SELECT 1 FROM storage.objects WHERE bucket_id = 'uploads' AND name = $1", [name])
    if (remaining.rowCount) throw Error("Storage removal not confirmed")
    await client.query("DELETE FROM public.storage_cleanup_queue WHERE object_path = $1", [name])
    await client.query("COMMIT")
    console.log(`[storage-cleanup] DELETED: ${name}`)
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {})
    await client.query("UPDATE public.storage_cleanup_queue SET attempts = attempts + 1, last_error = $2, delete_after = GREATEST(delete_after, NOW() + INTERVAL '1 hour') WHERE object_path = $1", [name, String(error.message || error).slice(0, 500)]).catch(() => {})
    console.error("[storage-cleanup] RETRY:", error.message)
  } finally { client.release() }
}
let cleanupRunning = false
async function inspectCleanupQueue() {
  if (cleanupRunning) return
  cleanupRunning = true
  let client
  try {
    client = await pool.connect()
    await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY")
    const { rows: queue } = await client.query(`SELECT q.object_path, q.delete_after, NOW() >= q.delete_after AS due,
      EXISTS (SELECT 1 FROM storage.objects o WHERE o.bucket_id = 'uploads' AND o.name = q.object_path) AS file_exists
      FROM public.storage_cleanup_queue q ORDER BY q.delete_after LIMIT 100`)
    const refs = []
    if (queue.length) for (const table of ["sections", "official_sections", "partners", "section_translations", "reviews", "applications"]) {
      const { rows } = await client.query(`SELECT to_jsonb(t)::text AS data FROM public.${table} t`)
      for (const row of rows) refs.push(row.data)
    }
    for (const item of queue) {
      const name = item.object_path
      const valid = validCleanupName(name)
      const referenced = !valid || refs.some(r => [name, encodeURI(name), encodeURIComponent(name)].some(n => r.toLowerCase().includes(n.toLowerCase())))
      const state = !valid ? "INVALID" : referenced ? "REFERENCED" : !item.file_exists ? "MISSING" : item.due ? "ELIGIBLE" : "WAITING"
      console.log(`[storage-cleanup] ${state}: ${name}`)
    }
    await client.query("COMMIT")
    if (CLEANUP_ENABLED && CLEANUP_TEST_PATH) {
      client.release()
      client = null
      await deleteQueuedObject(CLEANUP_TEST_PATH)
      return
    }
    if (CLEANUP_ENABLED && CLEANUP_AUTO && !CLEANUP_TEST_PATH) {
      client.release()
      client = null
      const due = queue.filter(item => item.due && validCleanupName(item.object_path)).slice(0, 10)
      for (const item of due) await deleteQueuedObject(item.object_path)
      console.log(`[storage-cleanup] AUTO: ${due.length} due objects processed (max 10).`)
      return
    }
    console.log(`[storage-cleanup] READ ONLY: ${queue.length} queued (max 100). No files deleted.`)
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {})
    console.error("[storage-cleanup] STOP:", error.message)
  } finally {
    if (client) client.release()
    cleanupRunning = false
  }
}
/* ===================== START SERVER ===================== */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  })
})
app.listen(PORT, () => {
  console.log(`Server started: ${SERVER_URL}`)
  void inspectCleanupQueue()
  setInterval(inspectCleanupQueue, 60 * 60 * 1000).unref()
})
