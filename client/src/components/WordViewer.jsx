import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Download, LoaderCircle, AlertCircle, X, Plus, Minus } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { documentTitle } from "./wordDocumentUtils"
const words = {
  RU: ["Просмотр", "Официальный документ", "Скачать документ", "Закрыть", "Загрузка документа...", "Не удалось открыть Word. Скачайте оригинал.", "Уменьшить", "Увеличить", "Esc — закрыть"],
  KZ: ["Қарау", "Ресми құжат", "Құжатты жүктеп алу", "Жабу", "Құжат жүктелуде...", "Word құжатын ашу мүмкін болмады.", "Кішірейту", "Үлкейту", "Esc — жабу"],
  EN: ["View", "Official document", "Download document", "Close", "Loading document...", "Unable to open Word. Download the original.", "Zoom out", "Zoom in", "Esc — close"]
}
export default function WordViewer({ src, title, name }) {
  const { language } = useLanguage()
  const t = words[language] || words.RU
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  return <><button type="button" disabled={!src} onClick={() => setOpen(true)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1677c9] via-[#13a8ba] to-[#22c5a5] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50">{t[0]}</button>{open && <WordDialog src={src} title={title} name={name} t={t} onClose={onClose} />}</>
}
function WordDialog({ src, title, name, t, onClose }) {
  const host = useRef(null)
  const close = useRef(null)
  const [status, setStatus] = useState("loading")
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const previous = document.activeElement, overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"; close.current?.focus()
    const key = e => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", key)
    return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", key); previous?.focus() }
  }, [onClose])
  useEffect(() => {
    const controller = new AbortController(), element = host.current
    let active = true
    const body = document.createElement("div"), styles = document.createElement("div")
    element.replaceChildren(styles, body)
    async function load() {
      try {
        const [{ renderAsync }, response] = await Promise.all([import("docx-preview"), fetch(src, { signal: controller.signal })])
        if (!response.ok) throw new Error("HTTP " + response.status)
        const data = await response.arrayBuffer()
        if (!active) return
        await renderAsync(data, body, styles, { className: "cso-word", inWrapper: true, breakPages: true, ignoreLastRenderedPageBreak: false, renderAltChunks: false, renderChanges: false })
        if (active) setStatus("ready")
      } catch (error) { if (active) { console.error(error); setStatus("error") } }
    }
    void load()
    return () => { active = false; controller.abort(); element.replaceChildren() }
  }, [src])
  async function download() {
    try {
      const response = await fetch(src)
      if (!response.ok) throw new Error("Download failed")
      const url = URL.createObjectURL(await response.blob()), a = document.createElement("a")
      a.href = url; a.download = documentTitle({ name: name || title }).replace(/\.docx$/i, "") + ".docx"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 30000)
    } catch { window.location.assign(src) }
  }
  const control = "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#c8e6ed] bg-white text-[#086a9a] shadow-sm disabled:opacity-35"
  return createPortal(<div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[2147483647] isolate flex items-center justify-center bg-[#e9f5f7] p-3 sm:p-6 lg:p-8" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
    <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-xl">
      <header className="flex shrink-0 items-center justify-between gap-2 bg-gradient-to-r from-[#1677c9] via-[#13a8ba] to-[#22c5a5] px-4 py-3 text-white"><div className="min-w-0"><p className="truncate font-extrabold">{title}</p><p className="text-xs">{t[1]} · DOCX</p></div><div className="flex gap-2"><button type="button" onClick={download} title={t[2]} aria-label={t[2]} className="rounded-lg bg-white/15 p-2"><Download size={19} /></button><button ref={close} type="button" onClick={onClose} aria-label={t[3]} className="rounded-lg bg-white/15 p-2"><X size={20} /></button></div></header>
      <div className="flex shrink-0 items-center justify-center gap-3 border-b border-[#d5eaef] bg-[#e8f7f8] p-2"><button type="button" className={control} disabled={zoom <= .5} aria-label={t[6]} onClick={() => setZoom(z => Math.max(.5, z - .25))}><Minus size={17} /></button><span className="text-xs font-bold text-[#12315c]">{Math.round(zoom * 100)}%</span><button type="button" className={control} disabled={zoom >= 3} aria-label={t[7]} onClick={() => setZoom(z => Math.min(3, z + .25))}><Plus size={17} /></button></div>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-gradient-to-br from-[#cfeaf6] via-[#edfafa] to-[#c9eee5] p-4"><style>{`.cso-word-host .cso-word-wrapper{background:transparent;padding:0;min-width:max-content}.cso-word-host .cso-word-wrapper>section{box-shadow:0 8px 35px #12315c33;margin-bottom:20px}`}</style>{status !== "ready" && <div role={status === "error" ? "alert" : "status"} className="mx-auto flex w-fit items-center gap-2 rounded-xl bg-white p-4 text-sm">{status === "loading" ? <LoaderCircle className="animate-spin" size={20} /> : <AlertCircle size={20} />}{status === "loading" ? t[4] : t[5]}</div>}<div ref={host} className="cso-word-host mx-auto w-max min-w-full" style={{ zoom, display: status === "ready" ? "block" : "none" }} /></div>
      <footer className="flex shrink-0 justify-between bg-gradient-to-r from-[#1677c9] via-[#13a8ba] to-[#22c5a5] px-4 py-2 text-xs font-semibold text-white"><span>ЦСО №1 · Актобе</span><span>{t[8]}</span></footer>
    </div></div>, document.body)
}