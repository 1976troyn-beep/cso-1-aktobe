import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, Download, LoaderCircle, AlertCircle, X, Plus, Minus } from "lucide-react"
import * as pdfjsLib from "pdfjs-dist"
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url"
import { useLanguage } from "../context/LanguageContext"
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
const translations = {
  RU: {
    document: "Документ", pdfDocument: "Документ PDF", view: "Просмотр",
    official: "Официальный документ", download: "Скачать документ", close: "Закрыть просмотр",
    previous: "Предыдущая страница", next: "Следующая страница", zoomOut: "Уменьшить", zoomIn: "Увеличить",
    loading: "Загрузка документа...", loadError: "Не удалось открыть PDF. Проверьте доступ к файлу.",
    renderError: "Не удалось отобразить страницу документа.", of: "из", esc: "Esc — закрыть", page: "страница"
  },
  KZ: {
    document: "Құжат", pdfDocument: "PDF құжаты", view: "Қарау",
    official: "Ресми құжат", download: "Құжатты жүктеп алу", close: "Қарауды жабу",
    previous: "Алдыңғы бет", next: "Келесі бет", zoomOut: "Кішірейту", zoomIn: "Үлкейту",
    loading: "Құжат жүктелуде...", loadError: "PDF файлын ашу мүмкін болмады. Файлға қолжетімділікті тексеріңіз.",
    renderError: "Құжат бетін көрсету мүмкін болмады.", of: "/", esc: "Esc — жабу", page: "бет"
  },
  EN: {
    document: "Document", pdfDocument: "PDF document", view: "View",
    official: "Official document", download: "Download document", close: "Close viewer",
    previous: "Previous page", next: "Next page", zoomOut: "Zoom out", zoomIn: "Zoom in",
    loading: "Loading document...", loadError: "Unable to open PDF. Check file access.",
    renderError: "Unable to display document page.", of: "of", esc: "Esc — close", page: "page"
  }
}
function pageLabel(count, language) {
  if (language === "KZ") return `${count} бет`
  if (language === "EN") return `${count} ${count === 1 ? "page" : "pages"}`
  const suffix = count % 10 === 1 && count % 100 !== 11 ? "страница" :
    [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100) ? "страницы" : "страниц"
  return `${count} ${suffix}`
}
// Page counts are cached only after the visitor opens a PDF.
const pageCounts = new Map()
const pageCountListeners = new Set()
function rememberPageCount(src, count) {
  pageCounts.set(src, count)
  pageCountListeners.forEach(listener => listener())
}
export function PdfPageCount({ src }) {
  const { language } = useLanguage()
  const t = translations[language] || translations.RU
  const [, refresh] = useState(0)
  useEffect(() => {
    const listener = () => refresh(n => n + 1)
    pageCountListeners.add(listener)
    listener()
    return () => { pageCountListeners.delete(listener) }
  }, [])
  const count = pageCounts.get(src)
  return <span>{count ? pageLabel(count, language) : t.document}</span>
}
export default function PdfViewer({ src, title }) {
  const { language } = useLanguage()
  const t = translations[language] || translations.RU
  const [open, setOpen] = useState(false)
  const displayTitle = title || t.pdfDocument
  return (
    <>
      <button type="button" disabled={!src} onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1677c9] via-[#13a8ba] to-[#22c5a5] px-4 py-2 text-sm font-bold text-white shadow-[0_5px_14px_rgba(19,168,186,0.17)] transition hover:brightness-105 disabled:opacity-50">
        {t.view}
      </button>
      {open && <PdfDialog src={src} title={displayTitle} onClose={() => setOpen(false)} language={language} />}
    </>
  )
}
function PdfDialog({ src, title, onClose, language }) {
  const t = translations[language] || translations.RU
  const [pdf, setPdf] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const canvasRef = useRef(null)
  const viewportRef = useRef(null)
  const taskRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = e => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setPageNumber(n => Math.min(pdf?.numPages || n, n + 1))
      if (e.key === "ArrowLeft") setPageNumber(n => Math.max(1, n - 1))
    }
    window.addEventListener("keydown", onKey)
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKey) }
  }, [onClose, pdf])
  useEffect(() => {
    let active = true
    const task = pdfjsLib.getDocument({ url: src })
    task.promise.then(doc => {
      if (active) { rememberPageCount(src, doc.numPages); setPdf(doc); setLoading(false) }
    }).catch(err => {
      if (active) { console.error("PDF loading error:", err); setError("load"); setLoading(false) }
    })
    return () => { active = false; taskRef.current?.cancel(); void task.destroy() }
  }, [src])
  useEffect(() => {
    const element = viewportRef.current
    if (!element) return
    const update = () => setSize({ width: element.clientWidth, height: element.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!pdf || !size.width || !size.height || !canvasRef.current) return
    let active = true
    let current = null
    async function render() {
      try {
        const previous = taskRef.current
        if (previous) {
          previous.cancel()
          try { await previous.promise } catch { /* cancelled render */ }
        }
        if (!active) return
        const page = await pdf.getPage(pageNumber)
        if (!active) return
        const base = page.getViewport({ scale: 1 })
        const fit = Math.min(Math.max(1, size.width - 48) / base.width, Math.max(1, size.height - 48) / base.height)
        const viewport = page.getViewport({ scale: fit * zoom })
        const canvas = canvasRef.current
        if (!canvas || !active) return
        const context = canvas.getContext("2d")
        if (!context) return
        const ratio = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.ceil(viewport.width * ratio)
        canvas.height = Math.ceil(viewport.height * ratio)
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`
        current = page.render({ canvasContext: context, canvas, viewport, background: "white",
          transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0] })
        taskRef.current = current
        await current.promise
      } catch (err) {
        if (active && err?.name !== "RenderingCancelledException") {
          console.error("PDF rendering error:", err)
          setError("render")
        }
      } finally {
        if (taskRef.current === current) taskRef.current = null
      }
    }
    void render()
    return () => { active = false; current?.cancel() }
  }, [pdf, pageNumber, zoom, size.width, size.height])
  const control = "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c8e6ed] bg-white text-[#086a9a] shadow-[0_2px_7px_rgba(18,49,92,0.07)] transition hover:border-[#0db5b1] hover:bg-[#f0fbfb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078fb4] disabled:cursor-not-allowed disabled:opacity-35"
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${t.view}: ${title}`}
      className="fixed inset-0 z-[2147483647] isolate flex items-center justify-center bg-[#e9f5f7] p-3 sm:p-6 lg:p-8"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="relative z-10 flex h-[calc(100dvh-24px)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_16px_60px_rgba(18,49,92,0.18)] sm:h-[calc(100dvh-48px)] lg:h-[calc(100dvh-64px)]">
        <div className="flex shrink-0 items-center justify-between gap-2 bg-gradient-to-r from-[#1677c9] via-[#13a8ba] to-[#22c5a5] px-3 py-3 text-white sm:px-5">
          <div className="min-w-0"><p className="truncate text-sm font-extrabold sm:text-base">{title}</p><p className="text-xs text-white/85">{t.official} · PDF</p></div>
          <div className="flex shrink-0 items-center gap-2">
            <a href={src} download target="_blank" rel="noreferrer" aria-label={t.download} title={t.download} className="rounded-lg bg-white/15 p-2 hover:bg-white/25"><Download size={19} /></a>
            <button type="button" onClick={onClose} aria-label={t.close} className="rounded-lg bg-white/15 p-2 hover:bg-white/25"><X size={20} /></button>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-b border-[#d5eaef] bg-[#e8f7f8] px-2 py-2 sm:gap-3">
          <button type="button" className={control} disabled={!pdf || pageNumber <= 1} aria-label={t.previous} onClick={() => setPageNumber(n => Math.max(1, n - 1))}><ChevronLeft size={19} /></button>
          <span className="min-w-16 text-center text-xs font-bold text-[#12315c]">{pdf ? `${pageNumber} ${t.of} ${pdf.numPages}` : "—"}</span>
          <button type="button" className={control} disabled={!pdf || pageNumber >= pdf.numPages} aria-label={t.next} onClick={() => setPageNumber(n => Math.min(pdf.numPages, n + 1))}><ChevronRight size={19} /></button>
          <span className="mx-1 h-6 w-px bg-[#c9e4e9]" />
          <button type="button" className={control} disabled={zoom <= 0.75} aria-label={t.zoomOut} onClick={() => setZoom(z => Math.max(0.75, +(z - 0.25).toFixed(2)))}><Minus size={17} /></button>
          <span className="min-w-12 text-center text-xs font-bold text-[#12315c]">{Math.round(zoom * 100)}%</span>
          <button type="button" className={control} disabled={zoom >= 3} aria-label={t.zoomIn} onClick={() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))}><Plus size={17} /></button>
        </div>
        <div ref={viewportRef} className="min-h-0 flex-1 overflow-auto overscroll-contain bg-gradient-to-br from-[#cfeaf6] via-[#edfafa] to-[#c9eee5]">
          <div className="flex min-h-full w-full min-w-max items-center justify-center p-4 sm:p-5">
            {loading && <div className="flex items-center gap-2 rounded-xl bg-white p-4 text-sm font-semibold text-[#12315c]"><LoaderCircle className="animate-spin" size={20} /> {t.loading}</div>}
            {error && <div role="alert" className="flex max-w-md items-center gap-2 rounded-xl bg-white p-4 text-sm text-red-700"><AlertCircle size={20} />{error === "load" ? t.loadError : t.renderError}</div>}
            <canvas ref={canvasRef} aria-label={`${title}, ${t.page} ${pageNumber}`} className={`${!pdf || error ? "hidden" : "block"} shrink-0 max-w-none bg-white shadow-[0_8px_35px_rgba(18,49,92,0.22)]`} />
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-2 bg-gradient-to-r from-[#1677c9] via-[#13a8ba] to-[#22c5a5] px-4 py-2 text-xs font-semibold text-white">
          <span>ЦСО №1 · Актобе</span><span>{t.esc}</span>
        </div>
      </div>
    </div>,
    document.body
  )
}


