import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, Building2, ShieldCheck, ScrollText, Landmark, MessagesSquare, FileText, Download, Eye, ExternalLink, Play } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import PdfViewer, { PdfPageCount } from "./PdfViewer"
import WordViewer from "./WordViewer"
import { isDocx, documentTitle } from "./wordDocumentUtils"
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"
const items = [
  { id: "about", icon: Building2, ru: "Об учреждении", kz: "Мекеме туралы", en: "About the institution" },
  { id: "anticorruption", icon: ShieldCheck, ru: "Антикоррупционная политика", kz: "Сыбайлас жемқорлыққа қарсы саясат", en: "Anti-corruption policy" },
  { id: "legal", icon: ScrollText, ru: "Нормативно-правовые документы", kz: "Нормативтік-құқықтық құжаттар", en: "Regulatory documents" },
  { id: "services", icon: Landmark, ru: "Государственные услуги", kz: "Мемлекеттік қызметтер", en: "Public services" },
  { id: "appeals", icon: MessagesSquare, ru: "Обращения граждан", kz: "Азаматтардың өтініштері", en: "Citizen appeals" },
]
// Cache per section and language for instant revisits within the same browser tab.
const sectionCache = new Map()
const pendingRequests = new Map()
const CACHE_TTL_MS = 60_000
const oldIds = { "anti-corruption": "anticorruption", regulations: "legal" }
const isPdf = (block) => block.format === "pdf" || /\.pdf(?:$|[?#])/i.test(block.src || "") || /\.pdf$/i.test(block.name || "")
function OfficialVideo({ src, className }) {
  const { language } = useLanguage()
  const [started, setStarted] = useState(false)
  const watch = { RU: "Смотреть видео", KZ: "Бейнені көру", EN: "Watch video" }[language] || "Смотреть видео"
  if (started) return <video src={src} controls autoPlay playsInline preload="none" className={`cso-official-media mx-auto block max-h-[440px] w-full rounded-2xl bg-black object-contain ${className}`} />
  return (
    <button type="button" onClick={() => setStarted(true)} aria-label={watch} className="relative mx-auto flex aspect-video w-full max-w-[640px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b5cab] via-[#078ba8] to-[#05a99d] p-4 text-white shadow-sm sm:gap-4">
      <span aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-white/[0.06]" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/[0.06]" />
      <img src="/logo.png" alt="" className="relative h-16 w-16 rounded-full bg-white p-[2.5px] object-contain shadow-lg sm:h-24 sm:w-24" />
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/70 bg-[#12315c]/45 shadow-lg backdrop-blur-sm"><Play size={22} fill="currentColor" className="ml-1" /></span>
      <span className="relative text-xs font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.65)]">{watch}</span>
    </button>
  )
}
function Media({ block, className = "" }) {
  if (!block.src) return null
  const video = block.type === "video" || (block.type === "media-text" && block.mediaType === "video")
  return video
    ? <OfficialVideo key={block.src} src={block.src} className={className} />
    : <img src={block.src} alt={block.name || block.title || "Фотография"} loading="lazy" className={`cso-official-media block h-auto max-h-[480px] w-full rounded-2xl object-contain ${className}`} style={{ borderRadius: "20px" }} />
}
function CompactText({ text, className = "" }) {
  if (!text) return null
  const paragraphs = String(text).trim().split(/\n\s*\n/).map(part => part.trim()).filter(Boolean)
  return <div className={`cso-official-body cso-official-paragraphs ${className}`}>{paragraphs.map((part, index) => <p key={index} className="whitespace-pre-line">{part}</p>)}</div>
}
function ContentBlock({ block, language }) {
  const labels = { RU: { download: "Скачать", open: "Открыть", visit: "Перейти на сайт" }, KZ: { download: "Жүктеп алу", open: "Ашу", visit: "Сайтқа өту" }, EN: { download: "Download", open: "Open", visit: "Visit website" } }[language] || { download: "Скачать", open: "Открыть" }
  if (block.type === "text") {
    return <section className="cso-official-inner-section">{block.title && <h3 className="cso-official-block-title mb-3 text-xl font-extrabold">{block.title}</h3>}{block.text && <CompactText text={block.text} />}</section>
  }
  if (block.type === "media-text") {
    const full = block.layout === "full"
    const photoOnRight = block.layout !== "left"
    const isVideo = block.mediaType === "video"
    if (full || isVideo) {
      return (
        <section className="cso-official-inner-section">
          {block.title && <h3 className="cso-official-block-title mb-4 text-xl font-extrabold">{block.title}</h3>}
          {block.src && (
            <div className="mb-5 flex w-full justify-center">
              <Media
                block={block}
                className="!h-auto !w-auto !max-w-full !max-h-[640px] sm:!max-h-[720px]"
              />
            </div>
          )}
          {block.text && <CompactText text={block.text} />}
        </section>
      )
    }
    // Explicit two-column layout on desktop; stack image and text on mobile.
    return (
      <section className="cso-official-inner-section">
        {block.title && <h3 className="cso-official-block-title mb-3 text-xl font-extrabold">{block.title}</h3>}
        <div className={`cso-official-split ${photoOnRight ? "cso-official-photo-right" : "cso-official-photo-left"}`}>
          {block.src && <img src={block.src} alt={block.name || block.title || "Фотография"} loading="lazy" className="cso-official-split-photo" />}
          {block.text && <CompactText text={block.text} className="cso-official-split-text" />}
        </div>
      </section>
    )
  }
  if (block.type === "image" || block.type === "video") {
    return (
      <section className="cso-official-inner-section">
        {block.title && <h3 className="cso-official-block-title mb-3 text-xl font-extrabold">{block.title}</h3>}
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl"><Media block={block} /></div>
        {block.description && <p className="cso-official-body mt-3 whitespace-pre-wrap text-sm opacity-70">{block.description}</p>}
      </section>
    )
  }
  if (block.type === "link") {
    let valid = false
    try { const url = new URL(block.url); valid = url.protocol === "https:" && url.hostname.includes(".") && !url.username && !url.password } catch { /* Invalid link */ }
    return <section className="cso-official-inner-section space-y-3">
      {block.title && <h3 className="cso-official-block-title text-xl font-extrabold">{block.title}</h3>}
      {block.description && <p className="cso-official-body whitespace-pre-wrap leading-[23px] sm:leading-[27px]">{block.description}</p>}
      {valid && <a href={block.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0b5cab] via-[#078fb4] to-[#05a99d] px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:brightness-105">{block.text || labels.visit}<ExternalLink size={17} /></a>}
    </section>
  }
  if (block.type === "document") {
    const pdf = isPdf(block)
    const type = block.documentType || block.docType || block.kind || ""
    const number = block.documentNumber || block.docNumber || ""
    const rawDate = block.documentDate || block.docDate || ""
    const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
      ? `${rawDate.slice(8, 10)}.${rawDate.slice(5, 7)}.${rawDate.slice(0, 4)}`
      : rawDate
    const details = [type, number ? `№${number}` : "", date ? `от ${date}` : ""].filter(Boolean).join(" ")
    const filename = (block.name || block.src || "").split(/[?#]/)[0]
    const format = pdf ? "PDF" : (block.format || filename.split(".").pop() || "Файл").toUpperCase()
    return (
      <section className="cso-official-inner-section cso-official-document flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="cso-official-document-icon grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#1677c9] via-[#13a8ba] to-[#22c5a5] shadow-[0_7px_18px_rgba(19,168,186,0.18)]">
          <FileText size={29} strokeWidth={1.8} className="text-white" />
        </div>
        <div className="cso-official-document-details min-w-0 flex-1">
          <h3 className="cso-official-block-title text-base font-extrabold leading-snug text-[#12315c] sm:text-lg">{documentTitle(block)}</h3>
          {details && <p className="mt-1 text-sm font-semibold text-[#16819e]">{details}</p>}
          {block.description && <p className="cso-official-body mt-2 whitespace-pre-wrap text-sm leading-6 text-[#526b7e]">{block.description}</p>}
          {block.src && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e3edf0] pt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#60798b]">
                <FileText size={15} className="text-[#0e9c9c]" />
                {format}{pdf && <> · <PdfPageCount src={block.src} /></>}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a href={block.src} download target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#cde6ee] bg-[#edf7fa] px-3 py-2 text-sm font-bold text-[#126a9a] transition hover:bg-[#e0f1f6]">
                  <Download size={16} /> {labels.download}
                </a>
                {pdf ? (
                  <PdfViewer src={block.src} title={block.title || block.name || "Документ PDF"} />
                ) : isDocx(block) ? (
                  <WordViewer src={block.src} title={documentTitle(block)} name={block.name} />
                ) : (
                  <a href={block.src} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#1677c9] via-[#13a8ba] to-[#22c5a5] px-4 py-2 text-sm font-bold text-white transition hover:brightness-105">
                    <Eye size={17} /> {labels.open}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }
  return null
}
const officialMobileCss = `
.cso-official-page .cso-official-paragraphs { line-height: 1.48; }
.cso-official-page .cso-official-paragraphs p { margin: 0 0 9px; }
.cso-official-page .cso-official-paragraphs p:last-child { margin-bottom: 0; }
.cso-official-page .cso-official-split { display: flow-root; }
.cso-official-page .cso-official-split-photo { display: block; float: left; width: 44%; max-height: 400px; height: auto; object-fit: contain; object-position: left top; margin: 0 20px 12px 0; border-radius: 12px; }
.cso-official-page .cso-official-photo-right .cso-official-split-photo { float: right; margin: 0 0 12px 20px; object-position: right top; }
.cso-official-page .cso-official-split-text { display: block; }
@media (max-width: 639px) {
  .cso-official-page .cso-official-split, .cso-official-page .cso-official-photo-right { display: flow-root; }
  .cso-official-page .cso-official-split-photo, .cso-official-page .cso-official-photo-right .cso-official-split-photo { float: none; width: 100%; max-height: none; margin: 0 0 12px; object-position: center; }
  .cso-official-page .cso-official-paragraphs p { margin-bottom: 8px; }
}
@media (max-width: 639px) {
  .cso-official-page { overflow-wrap: anywhere; }
  .cso-official-page .cso-official-title { font-size: 25px !important; line-height: 1.12 !important; }
  .cso-official-page .cso-official-section-title { font-size: 21px !important; line-height: 1.25 !important; }
  .cso-official-page .cso-official-card-title { font-size: 15px !important; line-height: 1.3 !important; overflow-wrap: anywhere; }
  .cso-official-page .cso-official-block-title { font-size: 17px !important; line-height: 1.35 !important; }
  .cso-official-page .cso-official-body { font-size: 14px !important; line-height: 1.55 !important; overflow-wrap: anywhere; }
  .cso-official-page .cso-official-card-description { font-size: 12px !important; line-height: 1.45 !important; }
  .cso-official-page .cso-official-media { max-width: 100% !important; height: auto !important; }
  /* Compact inner pages only; section list above stays unchanged. */
  .cso-official-page .cso-official-content-list { display: grid; gap: 8px !important; }
  .cso-official-page .cso-official-content-block {
    min-height: 0 !important; height: auto !important;
    padding: 5px !important; margin: 0 !important;
  }
  .cso-official-page .cso-official-content-block > .cso-official-inner-section {
    min-height: 0 !important; height: auto !important;
    padding: 0 !important; margin: 0 !important;
    display: block; text-align: left;
  }
  .cso-official-page .cso-official-content-block .cso-official-block-title {
    margin-top: 0 !important; margin-bottom: 6px !important;
    font-size: 16px !important; line-height: 1.3 !important;
  }
  .cso-official-page .cso-official-content-block .cso-official-body {
    margin-top: 0; line-height: 1.5 !important;
  }
  .cso-official-page .cso-official-content-block .cso-official-media {
    width: 100% !important; max-width: 100% !important;
    height: auto !important; max-height: none !important;
    object-fit: contain;
  }
  .cso-official-page .cso-official-content-block .cso-official-inner-section > div:has(> .cso-official-media) {
    width: 100% !important; max-width: 100% !important;
  }
  .cso-official-page .cso-official-inner-shell { padding: 6px !important; }
  .cso-official-page .cso-official-content-block .cso-official-document {
    display: grid !important; grid-template-columns: 42px minmax(0, 1fr);
    align-items: start !important; gap: 10px !important;
  }
  .cso-official-page .cso-official-document-icon {
    width: 42px !important; height: 42px !important; border-radius: 12px !important;
  }
  .cso-official-page .cso-official-document-icon svg { width: 23px; height: 23px; }
  .cso-official-page .cso-official-document-details { min-width: 0; }
  .cso-official-page .cso-official-document-details > div:last-child { margin-top: 10px; padding-top: 10px; }
  .cso-official-page .cso-official-document-details .cso-official-body { margin-top: 6px !important; }
}
`
export default function OfficialPage() {
  const { language } = useLanguage()
  const lang = language === "KZ" ? "kz" : language === "EN" ? "en" : "ru"
  const [params, setParams] = useSearchParams()
  const rawId = params.get("section")
  const selectedId = oldIds[rawId] || rawId
  const selectedItem = items.find((item) => item.id === selectedId)
  const apiLanguage = lang === "kz" ? "kk" : lang
  const isSelected = items.some((item) => item.id === selectedId)
  const cacheKey = `${apiLanguage}:${isSelected ? selectedId : "list"}`
  const cachedEntry = sectionCache.get(cacheKey)
  const [request, setRequest] = useState(null)
  const sections = cachedEntry?.data || (request?.key === cacheKey ? request.data : [])
  const loading = !cachedEntry && request?.key !== cacheKey
  const error = request?.key === cacheKey ? request.error : ""
  const words = {
    ru: { title: "Официальная информация", subtitle: "Документы, государственные услуги и обращения граждан", back: "На главную", sections: "К разделам", empty: "Содержимое раздела будет добавлено позже", open: "Открыть раздел", loading: "Загрузка раздела…" },
    kz: { title: "Ресми ақпарат", subtitle: "Құжаттар, мемлекеттік қызметтер және азаматтардың өтініштері", back: "Басты бетке", sections: "Бөлімдерге", empty: "Бөлім мазмұны кейін қосылады", open: "Бөлімді ашу", loading: "Бөлім жүктелуде…" },
    en: { title: "Official information", subtitle: "Documents, public services and citizen appeals", back: "Back to home", sections: "All sections", empty: "Section content will be added later", open: "Open section", loading: "Loading section…" },
  }[lang]
  useEffect(() => {
    let active = true
    const cached = sectionCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) return () => { active = false }
    const endpoint = isSelected
      ? `${API_URL}/api/official-sections/${encodeURIComponent(selectedId)}?lang=${apiLanguage}`
      : `${API_URL}/api/official-sections?lang=${apiLanguage}`
    // Share the same in-flight request between StrictMode effect runs.
    let pending = pendingRequests.get(cacheKey)
    if (!pending) {
      pending = fetch(endpoint)
        .then(response => {
          if (!response.ok) throw new Error("Не удалось загрузить информацию")
          return response.json()
        })
        .then(data => {
          const normalized = Array.isArray(data) ? data : [data]
          sectionCache.set(cacheKey, { data: normalized, timestamp: Date.now() })
          return normalized
        })
      pendingRequests.set(cacheKey, pending)
      void pending.finally(() => {
        if (pendingRequests.get(cacheKey) === pending) pendingRequests.delete(cacheKey)
      }).catch(() => {})
    }
    pending.then(data => {
      if (active) setRequest({ key: cacheKey, data, error: "" })
    }).catch(err => {
      if (active && !sectionCache.has(cacheKey)) {
        setRequest({ key: cacheKey, data: [], error: err.message })
      }
    })
    return () => { active = false }
  }, [cacheKey, apiLanguage, isSelected, selectedId])
  const section = loading || error ? null : sections.find((item) => item.id === selectedId)
  const blocks = Array.isArray(section?.media) ? section.media : []
  const showFallback = blocks.length === 0 && !!section?.content
  return (
    <main className={`cso-official-page min-h-screen bg-[#eef7f7] ${selectedItem ? "px-2" : "px-3"} py-6 text-[#12315c] sm:px-8 sm:py-10`}>
      <style>{officialMobileCss}</style>
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-bold shadow-sm "><ArrowLeft size={18} />{words.back}</Link>
        <div className={`${selectedItem ? "cso-official-inner-shell" : ""} mt-6 min-w-0 rounded-[1.5rem] bg-white/70 p-4 shadow-[0_15px_50px_rgba(11,92,171,0.08)] sm:mt-10 sm:rounded-[2rem] sm:p-10`}>
          <h1 className="cso-official-title bg-gradient-to-r from-[#0b5cab] to-[#05a99d] bg-clip-text text-3xl font-black text-transparent sm:text-5xl">{words.title}</h1>
          <p className="cso-official-body mt-3 text-sm font-medium opacity-75 sm:text-base">{words.subtitle}</p>
          {selectedItem ? (
            <div className="mt-8">
              <button type="button" onClick={() => setParams({})} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm "><ArrowLeft size={17} />{words.sections}</button>
              <h2 className="cso-official-section-title mb-5 text-2xl font-black sm:mb-6 sm:text-3xl">{loading ? selectedItem[lang] : section?.heading || selectedItem[lang]}</h2>
              {loading ? <div role="status" aria-live="polite" className="rounded-xl bg-white/80 px-4 py-5 text-sm font-semibold text-[#126a9a]">{words.loading}</div> : error ? <p role="alert">{error}</p> : blocks.length ? (
                <div className="cso-official-content-list space-y-6">
                  {blocks.map((block, index) => (
                    <div key={block.id || index} className="cso-official-content-block min-w-0 rounded-2xl bg-white/80 px-3 py-4 shadow-sm sm:px-6 sm:py-6">
                      <ContentBlock block={block} language={language} />
                    </div>
                  ))}
                </div>
              ) : showFallback ? <p className="cso-official-body whitespace-pre-wrap leading-[23px] sm:leading-[27px]">{section.content}</p> : <p className="opacity-60">{words.empty}</p>}
            </div>
          ) : (
            <div className="mt-6 grid gap-2.5 sm:mt-8 sm:gap-3">
              {items.map((item) => {
                const Icon = item.icon
                const data = sections.find((entry) => entry.id === item.id)
                return (
                  <button type="button" key={item.id} onClick={() => { setParams({ section: item.id }); window.scrollTo({ top: 0, behavior: "instant" }) }} className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-white/70 bg-white/85 p-3 text-left shadow-sm transition hover:shadow-md sm:gap-4 sm:p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0b5cab] to-[#05a99d] text-white sm:h-12 sm:w-12"><Icon size={22} /></span>
                    <div className="min-w-0 flex-1"><h2 className="cso-official-card-title text-sm font-extrabold sm:text-lg">{item[lang]}</h2><p className="cso-official-card-description mt-1 text-xs opacity-60">{loading ? words.open : data?.content || (Array.isArray(data?.media) && data.media.length) ? words.open : words.empty}</p></div>
                    <ArrowRight size={18} className="h-4 w-4 shrink-0 opacity-40 sm:h-[18px] sm:w-[18px]" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}


