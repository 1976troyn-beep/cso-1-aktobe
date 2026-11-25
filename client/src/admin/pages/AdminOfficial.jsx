import { useEffect, useState } from "react"
import {
  ArrowDown, ArrowUp, Eye, FileText, Loader2, Plus, Save,
  Trash2, Upload, ChevronDown, ChevronUp, ExternalLink, Link2,
} from "lucide-react"
import PdfViewer from "../../components/PdfViewer"
import WordViewer from "../../components/WordViewer"
import { isDocx, documentTitle } from "../../components/wordDocumentUtils"
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"
const SECTION_IDS = ["about", "anticorruption", "legal", "services", "appeals"]
const uid = () => crypto.randomUUID()
const createBlock = (type) => ({
  id: uid(), type, title: "", text: "", description: "", layout: "right",
  src: "", mediaType: "image", name: "", url: "",
  documentType: "", documentNumber: "", documentDate: "",
})
const collapseDocuments = (items) => Object.fromEntries(items.filter((b) => b.type === "document").map((b) => [b.id, true]))
const normalize = (section) => {
  const saved = Array.isArray(section.media) ? section.media : []
  return {
    heading: section.heading || "",
    blocks: saved.length
      ? saved.map((b) => ({ ...b, id: b.id || uid() }))
      : section.content ? [{ ...createBlock("text"), text: section.content }] : [],
  }
}
const isPdf = (b) => b.format === "pdf" || /\.pdf(?:$|\?)/i.test(b.src || "") || /\.pdf$/i.test(b.name || "")
const documentDetails = (block) => {
  const type = (block.documentType || "").trim()
  const number = (block.documentNumber || "").trim()
  const date = block.documentDate
    ? new Date(`${block.documentDate}T12:00:00`).toLocaleDateString("ru-RU")
    : ""
  return [type + (number ? ` №${number}` : ""), date ? `от ${date}` : ""]
    .filter(Boolean).join(" ")
}
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#12315c] outline-none transition focus:border-[#05a99d] focus:ring-2 focus:ring-[#05a99d]/10"
const gradient = "bg-gradient-to-r from-[#0b5cab] via-[#078fb4] to-[#05a99d]"
const actionClass = "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition"
function Media({ block, compact = false, previewMode = false }) {
  if (!block.src) return (
    <div className={`grid place-items-center rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50/40 text-xs text-slate-400 ${compact ? "h-24 w-36" : "min-h-36"}`}>
      Файл пока не выбран
    </div>
  )
  const video = block.type === "video" || (block.type === "media-text" && block.mediaType === "video")
  const cls = compact
    ? "h-24 w-36 rounded-xl bg-slate-50 object-cover"
    : previewMode
      ? "block max-h-[470px] max-w-full w-auto mx-auto rounded-xl object-contain"
      : "max-h-[360px] w-full rounded-xl bg-slate-50 object-contain"
  return video
    ? <video src={block.src} controls preload="none" playsInline className={cls} />
    : <img src={block.src} alt={block.name || block.title || "Фотография"} className={cls} />
}
function BlockView({ block }) {
  if (block.type === "text") return (
    <section>
      {block.title && <h3 className="mb-3 text-lg font-black text-[#12315c]">{block.title}</h3>}
      {block.text && <p className="whitespace-pre-wrap text-[15px] leading-8 text-[#12315c]">{block.text}</p>}
    </section>
  )
  if (block.type === "media-text") {
    const full = block.layout === "full"
    const mediaFirst = block.layout === "left"
    return (
      <section>
        {block.title && <h3 className="mb-4 text-lg font-black text-[#12315c]">{block.title}</h3>}
        <div className={full ? "space-y-4" : "grid items-start gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"}>
          <div className={!full && mediaFirst ? "md:order-2" : ""}>
            {block.text && <p className="whitespace-pre-wrap text-[15px] leading-8 text-[#12315c]">{block.text}</p>}
          </div>
          <div className={!full && mediaFirst ? "md:order-1" : ""}>
            <Media block={block} previewMode />
          </div>
        </div>
      </section>
    )
  }
  if (block.type === "image" || block.type === "video") return (
    <section>
      {block.title && <h3 className="mb-4 text-lg font-black text-[#12315c]">{block.title}</h3>}
      <Media block={block} previewMode />
      {block.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{block.description}</p>}
    </section>
  )
  if (block.type === "link") return (
    <section className="space-y-3">
      {block.title && <h3 className="text-lg font-black text-[#12315c]">{block.title}</h3>}
      {block.description && <p className="whitespace-pre-wrap text-sm text-slate-600">{block.description}</p>}
      {/^https:\/\/[^\s]+$/i.test(block.url || "") && <a href={block.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0b5cab] to-[#05a99d] px-4 py-2.5 text-sm font-bold text-white">{block.text || "Перейти на сайт"}<ExternalLink size={16} /></a>}
    </section>
  )
  if (block.type === "document") return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <FileText className="shrink-0 text-[#0b5cab]" />
        <div>
          <h3 className="font-bold">{documentTitle(block)}</h3>
          {documentDetails(block) && <p className="mt-1 text-sm font-semibold text-[#078fb4]">{documentDetails(block)}</p>}
          {block.description && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{block.description}</p>}
        </div>
      </div>
      {block.src && <>
        {isPdf(block) ? (
          <PdfViewer src={block.src} title={block.title || block.name || "Документ PDF"} />
        ) : isDocx(block) ? (
          <WordViewer src={block.src} title={documentTitle(block)} name={block.name} />
        ) : (
          <p className="my-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            Для просмотра Word внутри сайта потребуется PDF-версия. Оригинал можно открыть или скачать.
          </p>
        )}
        {!isPdf(block) && !isDocx(block) && (
          <a className="font-semibold text-[#0b5cab] underline" href={block.src} target="_blank" rel="noreferrer">Открыть / скачать документ</a>
        )}
      </>}
    </section>
  )
  return null
}
export default function AdminOfficial() {
  const [sections, setSections] = useState([])
  const [selectedId, setSelectedId] = useState("about")
  const [heading, setHeading] = useState("")
  const [blocks, setBlocks] = useState([])
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [dirty, setDirty] = useState(false)
  const [collapsed, setCollapsed] = useState({})
  const section = sections.find((s) => s.id === selectedId)
  useEffect(() => {
    fetch(`${API_URL}/api/official-sections`)
      .then(async (r) => { if (!r.ok) throw new Error("Не удалось загрузить разделы"); return r.json() })
      .then((data) => {
        setSections(data)
        const first = data.find((s) => s.id === "about") || data[0]
        if (first) {
          const d = normalize(first)
          setSelectedId(first.id); setHeading(d.heading); setBlocks(d.blocks); setCollapsed(collapseDocuments(d.blocks))
        }
      })
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false))
  }, [])
  function changeSection(id) {
    if (dirty && !window.confirm("Есть несохранённые изменения. Перейти без сохранения?")) return
    const s = sections.find((item) => item.id === id)
    if (!s) return
    const d = normalize(s)
    setSelectedId(id); setHeading(d.heading); setBlocks(d.blocks)
    setPreview(false); setDirty(false); setMessage(""); setCollapsed(collapseDocuments(d.blocks))
  }
  function changeBlock(id, changes) {
    setBlocks((a) => a.map((b) => b.id === id ? { ...b, ...changes } : b))
    setDirty(true)
  }
  function add(type) {
    const newBlock = createBlock(type)
    setBlocks((a) => [...a, newBlock])
    if (type === "document") setCollapsed((a) => ({ ...a, [newBlock.id]: true }))
    setDirty(true); setPreview(false)
  }
  function remove(id) {
    if (!window.confirm("Удалить этот блок из страницы?")) return
    setBlocks((a) => a.filter((b) => b.id !== id)); setDirty(true)
  }
  function move(index, delta) {
    setBlocks((a) => {
      const j = index + delta
      if (j < 0 || j >= a.length) return a
      const next = [...a]; [next[index], next[j]] = [next[j], next[index]]
      return next
    })
    setDirty(true)
  }
  async function upload(event, blockId, expected = "any") {
    const files = Array.from(event.target.files || [])
    event.target.value = ""
    if (!files.length) return
    setUploading(true); setMessage("")
    try {
      const token = localStorage.getItem("admin-token")
      const form = new FormData()
      files.forEach((f) => form.append("files", f))
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form,
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки")
      if (!Array.isArray(result)) throw new Error("Неверный ответ сервера")
      if (blockId) {
        const file = result[0]
        if (expected === "media" && !["image", "video"].includes(file.type)) throw new Error("Для этого блока нужно фото или видео")
        if (expected === "document" && file.type !== "document") throw new Error("Выберите PDF или Word")
        changeBlock(blockId, {
          src: file.src, name: documentTitle({ name: files[0].name }), format: file.format,
          ...(expected === "media" ? { mediaType: file.type } : {}),
        })
      } else {
        const added = result.map((f, index) => ({
          ...createBlock(f.type), ...f, name: files[index]?.name || f.name, title: f.type === "document" ? (files[index]?.name || f.name) : "",
        }))
        setBlocks((a) => [...a, ...added])
        setCollapsed((a) => ({ ...a, ...collapseDocuments(added) }))
        setDirty(true)
      }
      setMessage("Файл загружен. Чтобы опубликовать изменения, нажмите «Сохранить изменения».")
    } catch (e) { setMessage(e.message) } finally { setUploading(false) }
  }
  async function save() {
    if (blocks.some((b) => b.type === "link" && (!/^https:\/\/[^\s]+$/i.test(b.url || "") || !b.title?.trim()))) {
      setMessage("Для каждой ссылки укажите заголовок и корректный адрес https://..."); return
    }
    setSaving(true); setMessage("")
    try {
      const content = blocks
        .filter((b) => b.type === "text" || b.type === "media-text")
        .map((b) => [b.title, b.text].filter(Boolean).join("\n"))
        .join("\n\n")
      const response = await fetch(`${API_URL}/api/official-sections/${selectedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({ heading, content, media: blocks }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Ошибка сохранения")
      setSections((a) => a.map((s) => s.id === selectedId ? { ...s, heading, content, media: blocks } : s))
      setDirty(false); setMessage("Изменения сохранены")
    } catch (e) { setMessage(e.message) } finally { setSaving(false) }
  }
  if (loading) return <p className="flex items-center gap-2 p-6"><Loader2 className="animate-spin" /> Загрузка...</p>
  return (
    <div className="space-y-4 text-[#12315c]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Официальная информация</h2>
          <p className="text-xs text-slate-500">Редактор разделов сайта</p>
        </div>
        <button type="button" onClick={() => setPreview(!preview)}
          className={`${actionClass} ${gradient} px-4 text-white shadow-[0_8px_20px_rgba(5,169,157,0.17)] hover:brightness-105`}>
          <Eye size={17} />{preview ? "Вернуться к редактору" : "Предпросмотр"}
        </button>
      </div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {SECTION_IDS.map((id) => {
          const s = sections.find((v) => v.id === id)
          return s && (
            <button key={id} type="button" onClick={() => changeSection(id)}
              className={`min-h-10 rounded-xl border px-3 py-2 text-left text-sm font-bold transition ${
                selectedId === id
                  ? `${gradient} border-transparent text-white shadow-[0_8px_20px_rgba(5,169,157,0.15)]`
                  : "border-[#b8d5e1] bg-white text-[#12315c] hover:border-[#05a99d] hover:bg-cyan-50"
              }`}>{s.title}</button>
          )
        })}
      </div>
      {section && (preview ? (
        <div className="mx-auto max-w-[1120px] space-y-5 rounded-[2rem] bg-white/70 p-4 shadow-sm sm:p-6 lg:p-8">
          <h1 className="text-2xl font-black leading-tight text-[#12315c] md:text-3xl">{heading}</h1>
          {blocks.map((b) => (
            <div key={b.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <BlockView block={b} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-bold">Заголовок страницы</label>
            <input className={inputClass} value={heading} onChange={(e) => { setHeading(e.target.value); setDirty(true) }} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => add("text")} className={`${actionClass} border border-slate-100 bg-white hover:bg-cyan-50`}><Plus size={16} />Текст</button>
            <button type="button" onClick={() => add("media-text")} className={`${actionClass} border border-slate-100 bg-white hover:bg-cyan-50`}><Plus size={16} />Текст + фото/видео</button>
            <button type="button" onClick={() => add("document")} className={`${actionClass} border border-slate-100 bg-white hover:bg-cyan-50`}><Plus size={16} />Документ</button>
              <button type="button" onClick={() => add("link")} className={`${actionClass} border border-cyan-100 bg-cyan-50 text-[#0b5cab] hover:bg-cyan-100`}><Link2 size={16} />Ссылка</button>
          </div>
          {blocks.map((b, i) => {
            const isCollapsed = collapsed[b.id] === true
            const typeLabel = { text: "Текст", "media-text": "Текст + фото/видео", image: "Фото", video: "Видео", document: "Документ", link: "Ссылка" }[b.type] || b.type
            return (
              <div key={b.id} className="overflow-hidden rounded-2xl border border-[#d5e6ed] bg-white shadow-[0_4px_16px_rgba(18,49,92,0.035)]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-[#f3faff] to-[#f0fbf9] px-4 py-2.5">
                  <button type="button" onClick={() => setCollapsed((a) => ({ ...a, [b.id]: !a[b.id] }))}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-black text-[#12315c]">
                    {isCollapsed ? <ChevronDown size={17} className="shrink-0 text-[#078fb4]" /> : <ChevronUp size={17} className="shrink-0 text-[#078fb4]" />}
                    <span className="truncate">Блок {i + 1} — {typeLabel}{b.title ? ` · ${b.title}` : ""}</span>
                  </button>
                  <div className="flex gap-1.5">
                    <button type="button" title="Выше" disabled={!i} onClick={() => move(i, -1)} className="rounded-lg bg-white p-2 text-[#12315c] disabled:opacity-30"><ArrowUp size={16} /></button>
                    <button type="button" title="Ниже" disabled={i === blocks.length - 1} onClick={() => move(i, 1)} className="rounded-lg bg-white p-2 text-[#12315c] disabled:opacity-30"><ArrowDown size={16} /></button>
                    <button type="button" title="Удалить" onClick={() => remove(b.id)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
                {isCollapsed ? (
                  b.type === "document" ? (
                    <button type="button"
                      onClick={() => setCollapsed((a) => ({ ...a, [b.id]: false }))}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#f5fbfd]">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1677c9] via-[#13a8ba] to-[#22c5a5] shadow-sm">
                        <FileText size={25} className="text-white" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#12315c]">{documentTitle(b)}</span>
                        {documentDetails(b) && <span className="mt-0.5 block truncate text-xs text-[#60798b]">{documentDetails(b)}</span>}
                        <span className="mt-1 block text-xs text-[#60798b]">{(b.format || (isPdf(b) ? "PDF" : "Документ")).toUpperCase()} · {b.src ? "Файл загружен" : "Файл не выбран"}</span>
                      </span>
                      <span className="hidden shrink-0 text-xs font-semibold text-[#087f91] sm:block">Редактировать</span>
                      <ChevronDown size={18} className="shrink-0 text-[#087f91]" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      {b.src && <Media block={b} compact />}
                      <p className="min-w-0 truncate text-xs text-slate-500">{b.text || b.description || b.url || b.name || "Нажмите на заголовок, чтобы раскрыть блок"}</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-3 p-4">
                    <label className="block space-y-1">
                      <span className="text-sm font-bold">{b.type === "document" ? "Название документа (приказа, договора)" : b.type === "link" ? "Заголовок ссылки" : "Заголовок блока"}</span>
                      <input className={inputClass} value={b.title || ""} onChange={(e) => changeBlock(b.id, { title: e.target.value })} placeholder={b.type === "document" ? "Например, Приказ № 15" : b.type === "link" ? "Например, Электронные обращения граждан" : "Заголовок (необязательно)"} />
                    </label>
                    {(b.type === "text" || b.type === "media-text") && (
                      <label className="block space-y-1">
                        <span className="text-sm font-bold">Текст</span>
                        <textarea rows={4} className={`${inputClass} resize-y`} value={b.text || ""} onChange={(e) => changeBlock(b.id, { text: e.target.value })} placeholder="Введите текст..." />
                      </label>
                    )}
                    {b.type === "link" && <div className="space-y-3">
                    <label className="block space-y-1"><span className="text-sm font-bold">Адрес сайта (https://...)</span><input type="url" className={inputClass} value={b.url || ""} onChange={(e) => changeBlock(b.id, { url: e.target.value })} placeholder="https://eotinish.kz/" /></label>
                    <label className="block space-y-1"><span className="text-sm font-bold">Надпись на кнопке</span><input className={inputClass} value={b.text || ""} onChange={(e) => changeBlock(b.id, { text: e.target.value })} placeholder="Перейти на официальный сайт" /></label>
                    <label className="block space-y-1"><span className="text-sm font-bold">Описание ссылки</span><textarea rows={3} className={inputClass} value={b.description || ""} onChange={(e) => changeBlock(b.id, { description: e.target.value })} placeholder="Краткое описание (необязательно)" /></label>
                    <p className="text-xs text-slate-500">Адрес одинаковый для всех языков. Название, описание и надпись на кнопке переводятся автоматически.</p>
                  </div>}
                  {b.type === "document" && (
                        <div className="grid gap-3 sm:grid-cols-3">
                          <label className="block space-y-1">
                            <span className="text-sm font-bold">Тип документа</span>
                            <input className={inputClass} list="official-document-types" value={b.documentType || ""} onChange={(e) => changeBlock(b.id, { documentType: e.target.value })} placeholder="Приказ, положение..." />
                            <datalist id="official-document-types">
                              <option value="Приказ" />
                              <option value="Положение" />
                              <option value="Постановление" />
                              <option value="Правила" />
                              <option value="Инструкция" />
                              <option value="Договор" />
                            </datalist>
                          </label>
                          <label className="block space-y-1">
                            <span className="text-sm font-bold">Номер документа</span>
                            <input className={inputClass} value={b.documentNumber || ""} onChange={(e) => changeBlock(b.id, { documentNumber: e.target.value })} placeholder="Например, 25" />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-sm font-bold">Дата документа</span>
                            <input type="date" className={inputClass} value={b.documentDate || ""} onChange={(e) => changeBlock(b.id, { documentDate: e.target.value })} />
                          </label>
                        </div>
                      )}
                      {b.type === "document" && (
                        <label className="block space-y-1">
                        <span className="text-sm font-bold">Описание документа</span>
                        <textarea rows={3} className={inputClass} value={b.description || ""} onChange={(e) => changeBlock(b.id, { description: e.target.value })} placeholder="Краткое описание приказа или договора" />
                      </label>
                    )}
                    {b.type === "media-text" && (
                      <label className="block space-y-1">
                        <span className="text-sm font-bold">Расположение</span>
                        <select className={inputClass} value={b.layout || "right"} onChange={(e) => changeBlock(b.id, { layout: e.target.value })}>
                          <option value="right">Текст слева — фото/видео справа</option>
                          <option value="left">Фото/видео слева — текст справа</option>
                          <option value="full">Друг под другом</option>
                        </select>
                      </label>
                    )}
                    {b.type !== "text" && b.type !== "link" && (
                      <div className="flex flex-wrap items-center gap-3">
                        <label className={`${actionClass} cursor-pointer border border-[#bce9e5] bg-[#eaf9f7] text-[#087f79] hover:bg-[#dcf5f1]`}>
                          <Upload size={16} />{uploading ? "Загрузка..." : b.src ? "Заменить файл" : "Загрузить файл"}
                          <input className="hidden" type="file" accept={b.type === "document" ? ".pdf,.doc,.docx" : "image/*,video/*"} disabled={uploading} onChange={(e) => upload(e, b.id, b.type === "document" ? "document" : "media")} />
                        </label>
                        {b.type !== "document" && <Media block={b} compact />}
                        {b.name && <p className="max-w-xs break-all text-xs text-slate-500">{b.name}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={save} disabled={saving || uploading}
              className={`${actionClass} ${gradient} px-5 py-3 font-black text-white shadow-[0_8px_20px_rgba(5,169,157,0.17)] disabled:opacity-50`}>
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Сохранить изменения
            </button>
            {dirty && <p className="text-sm text-amber-700">Есть несохранённые изменения</p>}
          </div>
        </>
      ))}
      {message && <p role="status" className="rounded-xl border border-cyan-100 bg-white p-3 text-sm font-semibold">{message}</p>}
    </div>
  )
}

