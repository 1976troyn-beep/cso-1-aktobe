import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { Save, ImagePlus, CheckCircle2, Trash2, Upload, XCircle, AlertTriangle, ChevronDown, ChevronUp, Maximize2, X } from "lucide-react"
import authFetch from "../utils/authFetch"
import imageCompression from "browser-image-compression"
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"
const initialSections = [
  {
    id: "hero",
    title: "Главная",
    subtitle: "Главный экран сайта",
    heading: "Забота, безопасность и спокойная среда",
    text: "Круглосуточный уход, комфортные комнаты, медицинское наблюдение и индивидуальная поддержка.",
    card_title: "Индивидуальный план ухода",
    card_text: "Внимательный подход к каждому проживающему.",
    media: [],
  },
]
const cardLabels = {
  services: [
    "Медицинское наблюдение",
    "Питание",
    "Безопасность",
    "Доступная среда",
    "Социальная поддержка",
    "Индивидуальный уход",
  ],
  conditions: [
    "Уютные комнаты",
    "Ежедневный уход",
    "Безопасная среда",
  ],
  rooms: [
    "Большая карточка",
    "Правая верхняя карточка",
    "Правая нижняя карточка",
  ],
  disability: [
    "Большая карточка",
    "Правая верхняя карточка",
    "Правая нижняя карточка",
  ],
  leadership: [
    "Директор",
    "Заместитель директора",
    "Медицинский блок",
    "Социальный блок",
  ],
  specialists: [
    "Специалист 1",
    "Специалист 2",
    "Специалист 3",
    "Специалист 4",
  ],
  news: [
    "Новость 1",
    "Новость 2",
    "Новость 3",
    "Новость 4",
  ],
  documents: [
    "Документ 1",
    "Документ 2",
    "Документ 3",
    "Документ 4",
  ],
}
const groupedSections = [
  "services",
  "conditions",
  "rooms",
  "disability",
  "leadership",
  "specialists",
  "news",
  "documents",
]
const disabledMediaSections = [
  "services",
  "documents",
  "reviews",
]
export default function AdminSections() {
  const [sections, setSections] = useState(initialSections)
  const [activeId, setActiveId] = useState("hero")
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)
  const busyRef = useRef(null)
  const [publicationChoices, setPublicationChoices] = useState({})
  const [openCard, setOpenCard] = useState(1)
  const editorRef = useRef(null)
  const alertTimerRef = useRef(null)
  function showAlert(type, message, persistent = false) {
    clearTimeout(alertTimerRef.current)
    setAlert({ type, message })
    if (!persistent) alertTimerRef.current = setTimeout(() => setAlert(null), 5000)
  }
  useEffect(() => () => clearTimeout(alertTimerRef.current), [])
  useEffect(() => {
    fetch(`${API_URL}/api/sections`)
      .then((res) => res.json())
      .then((data) => {
        const visibleSections = data.filter(
          (section) => section.id !== "partners"
        )
        setSections(visibleSections)
        setActiveId(visibleSections[0]?.id || "hero")
        setLoading(false)
      })
      .catch((error) => {
        console.error("Ошибка загрузки разделов:", error)
        setLoading(false)
        showAlert("error", "Не удалось загрузить разделы")
      })
  }, [])
  const activeSection = sections.find(
    (section) => section.id === activeId
  )
  function selectSection(id) {
    if (busyRef.current) return
    setActiveId(id)
    setPublicationChoices({})
    setOpenCard(1)
    setTimeout(() => {
      if (window.innerWidth < 1024) {
        editorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }, 80)
  }
  function updateField(field, value) {
    if (busyRef.current) return
    setSections((prev) =>
      prev.map((section) =>
        section.id === activeId
          ? { ...section, [field]: value }
          : section
      )
    )
  }
  function getMediaGroup(section, groupKey) {
    if (!section?.media) return []
    if (Array.isArray(section.media)) {
      return groupKey === "root" ? section.media : []
    }
    return section.media[groupKey] || []
  }
  async function handleUpload(event, groupKey = "root") {
    if (busyRef.current) { event.target.value = ""; return }
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return
    const MAX_IMAGE_SIZE_MB = 15
    const MAX_VIDEO_SIZE_MB = 30
    const invalidFile = files.find((file) => {
      const sizeMB = file.size / 1024 / 1024
      if (file.type.startsWith("image/")) {
        return sizeMB > MAX_IMAGE_SIZE_MB
      }
      if (file.type.startsWith("video/")) {
        return sizeMB > MAX_VIDEO_SIZE_MB
      }
      return false
    })
    if (invalidFile) {
      const sizeMB = (
        invalidFile.size /
        1024 /
        1024
      ).toFixed(1)
      showAlert(
        "error",
        invalidFile.type.startsWith("video/")
          ? `Видео "${invalidFile.name}" (${sizeMB} МБ) превышает лимит 30 МБ`
          : `Фото "${invalidFile.name}" (${sizeMB} МБ) превышает лимит 15 МБ`
      )
      event.target.value = ""
      return
    }
    busyRef.current = "upload"
    setBusy("upload")
    showAlert("warning", "Подготавливаю файлы...", true)
    try {
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (!file.type.startsWith("image/")) {
            return file
          }
          return await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          })
        })
      )
      const formData = new FormData()
      processedFiles.forEach((file) => {
        formData.append("files", file)
      })
      const response = await authFetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        throw new Error("Ошибка загрузки файлов")
      }
      const uploadedMedia = await response.json()
      const preparedMedia = uploadedMedia.map((item) => ({
        id: item.id || crypto.randomUUID(),
        name: item.name,
        type: item.type,
        src: item.src,
        preview: item.src,
      }))
      setSections((prev) =>
        prev.map((section) => {
          if (section.id !== activeId) return section
          if (groupKey === "root") {
            return {
              ...section,
              media: [
                ...(Array.isArray(section.media)
                  ? section.media
                  : []),
                ...preparedMedia,
              ],
            }
          }
          const currentMedia =
            section.media && !Array.isArray(section.media)
              ? section.media
              : {}
          return {
            ...section,
            media: {
              ...currentMedia,
              [groupKey]: [
                ...(currentMedia[groupKey] || []),
                ...preparedMedia,
              ],
            },
          }
        })
      )
      event.target.value = ""
      showAlert("success", "Файлы успешно загружены")
    } catch (error) {
      console.error(error)
      showAlert("error", "Не удалось загрузить файлы")
    } finally {
      event.target.value = ""
      busyRef.current = null
      setBusy(null)
    }
  }
  function removeMedia(mediaId, groupKey = "root") {
    if (busyRef.current) return
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== activeId) return section
        if (groupKey === "root") {
          return {
            ...section,
            media: (
              Array.isArray(section.media)
                ? section.media
                : []
            ).filter((item) => item.id !== mediaId),
          }
        }
        const currentMedia =
          section.media && !Array.isArray(section.media)
            ? section.media
            : {}
        return {
          ...section,
          media: {
            ...currentMedia,
            [groupKey]: (
              currentMedia[groupKey] || []
            ).filter((item) => item.id !== mediaId),
          },
        }
      })
    )
    showAlert("warning", "Медиа удалено. Нажмите «Сохранить»")
  }
  async function handleSave() {
    if (busyRef.current) return
    if (!activeSection) {
      showAlert("error", "Раздел не выбран")
      return
    }
    if (activeSection.id === "news") {
      const invalid = Object.values(publicationChoices).some((choice) =>
        choice.mode === "manual" && (!/^\d{4}-\d{2}-\d{2}$/.test(choice.date || "") ||
          Number.isNaN(Date.parse(`${choice.date}T12:00:00Z`)) ||
          new Date(`${choice.date}T12:00:00Z`).toISOString().slice(0, 10) !== choice.date)
      )
      if (invalid) {
        showAlert("error", "Укажи корректную дату публикации")
        return
      }
    }
    busyRef.current = "save"
    setBusy("save")
    showAlert("warning", "Сохраняю изменения...", true)
    try {
      const response = await authFetch(
        `/api/sections/${activeSection.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...activeSection,
            ...(activeSection.id === "news" ? {
              media: {
                ...(activeSection.media && !Array.isArray(activeSection.media) ? activeSection.media : {}),
                news_dates: {
                  ...(activeSection.media?.news_dates || {}),
                  ...Object.fromEntries(Object.entries(publicationChoices)
                    .filter(([, choice]) => choice.mode === "manual")
                    .map(([number, choice]) => [`card_${number}`, choice.date])),
                },
              },
              new_publications: Object.entries(publicationChoices)
                .filter(([, choice]) => choice.mode === "today")
                .map(([number]) => Number(number)),
              publication_dates: Object.fromEntries(
                Object.entries(publicationChoices)
                  .filter(([, choice]) => choice.mode === "manual")
                  .map(([number, choice]) => [`card_${number}`, choice.date])
              ),
            } : {}),
          }),
        }
      )
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Ошибка сохранения")
      }
      if (activeSection.id === "news") {
        const saved = await response.json()
        const expectedManualDates = Object.fromEntries(Object.entries(publicationChoices)
          .filter(([, choice]) => choice.mode === "manual")
          .map(([number, choice]) => [`card_${number}`, choice.date]))
        for (const [key, value] of Object.entries(expectedManualDates)) {
          if (saved.news_dates?.[key] !== value) {
            throw new Error(`Сервер не подтвердил дату ${key}: ${value}`)
          }
        }
        if (saved.news_dates) {
          setSections((prev) => prev.map((section) =>
            section.id === "news"
              ? { ...section, media: { ...(section.media || {}), news_dates: saved.news_dates } }
              : section
          ))
        }
        setPublicationChoices({})
      }
      showAlert("success", "Изменения успешно сохранены")
    } catch (error) {
      console.error("SAVE ERROR:", error)
      showAlert("error", `Не удалось сохранить: ${error.message || "ошибка сервера"}`)
    } finally {
      busyRef.current = null
      setBusy(null)
    }
  }
  if (loading) {
    return (
      <div className="text-2xl font-black text-[#12315c]">
        Загрузка админ...
      </div>
    )
  }
  if (!activeSection) {
    return (
      <div className="text-2xl font-black text-[#12315c]">
        Раздел не найден
      </div>
    )
  }
  const isGroupedSection = groupedSections.includes(
    activeSection.id
  )
  const isContactsSection = activeSection.id === "contacts"
  const cards = cardLabels[activeSection.id] || []
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#05a99d] md:text-sm">
            Content editor
          </p>
          <h1 className="mt-1 text-2xl font-black leading-tight text-[#12315c] md:text-3xl">
            Редактор разделов сайта
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 md:text-sm">
            Разделы расположены в том же порядке, что и на сайте.
            Медиа доступно только в визуальных разделах.
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-3 lg:w-fit lg:items-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!!busy}
            className={`inline-flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black text-white shadow-[0_8px_24px_rgba(5,169,157,0.2)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 ${alert?.message === "Изменения успешно сохранены" && !busy ? "bg-emerald-600" : "bg-gradient-to-r from-[#0b5cab] via-[#078fb4] to-[#05a99d]"}`}
          >
            {alert?.message === "Изменения успешно сохранены" && !busy ? <CheckCircle2 size={17} /> : <Save size={17} />}
            {busy === "save" ? "Сохраняю…" : busy === "upload" ? "Загрузка файлов…" : alert?.message === "Изменения успешно сохранены" ? "Сохранено" : "Сохранить"}
          </button>
          {createPortal(
            <AnimatePresence>
            {alert && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                role={alert.type === "error" ? "alert" : "status"}
                className={`fixed bottom-4 right-4 z-[99999] w-[calc(100%-2rem)] max-w-sm rounded-2xl px-4 py-3 text-sm font-black shadow-xl ${
                  alert.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : alert.type === "error"
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  {alert.type === "success" && <CheckCircle2 size={18} />}
                  {alert.type === "error" && <XCircle size={18} />}
                  {alert.type === "warning" && <AlertTriangle size={18} />}
                  <span>{alert.message}</span>
                </div>
              </motion.div>
            )}
            </AnimatePresence>, document.body
          )}
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(195px,0.24fr)_minmax(0,1fr)] lg:gap-4">
        <div className="glass-card rounded-2xl p-2.5 lg:rounded-2xl">
          <h2 className="px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 md:text-sm">
            Разделы
          </h2>
          <div className="mt-2 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => selectSection(section.id)}
                disabled={!!busy}
                className={`rounded-xl px-3 py-2 text-left transition ${
                  activeId === section.id
                    ? "bg-gradient-to-r from-[#0b5cab] via-[#078fb4] to-[#05a99d] text-white shadow-md"
                    : "bg-white/70 text-slate-600 hover:bg-cyan-50"
                }`}
              >
                <div className="text-sm font-black leading-tight">
                  {section.title}
                </div>
                <div
                  className={`mt-1 text-xs ${
                    activeId === section.id
                      ? "text-white/75"
                      : "text-slate-500"
                  }`}
                >
                  {section.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
        <motion.div
          ref={editorRef}
          key={activeSection.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card scroll-mt-24 rounded-2xl p-3 md:p-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#12315c]">
                {activeSection.title}
              </h2>
              <p className="text-xs text-slate-500">
                {activeSection.subtitle}
              </p>
            </div>
            <div className="rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#0b5cab]">
              {activeSection.id}
            </div>
          </div>
          <fieldset disabled={!!busy} className="mt-3 grid min-w-0 gap-3">
            <label>
              <span className="mb-2 block text-sm font-black text-[#12315c]">
                Заголовок раздела
              </span>
              <input
                value={activeSection.heading || ""}
                onChange={(event) =>
                  updateField("heading", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-black text-[#12315c]">
                Описание раздела
              </span>
              <textarea
                value={activeSection.text || ""}
                onChange={(event) =>
                  updateField("text", event.target.value)
                }
                rows="3"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
              />
            </label>
            {activeSection.id === "hero" && (
              <>
                <label>
                  <span className="mb-2 block text-sm font-black text-[#12315c]">
                    Заголовок маленькой карточки справа
                  </span>
                  <input
                    value={activeSection.card_title || ""}
                    onChange={(event) =>
                      updateField(
                        "card_title",
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-black text-[#12315c]">
                    Текст маленькой карточки справа
                  </span>
                  <textarea
                    value={activeSection.card_text || ""}
                    onChange={(event) =>
                      updateField(
                        "card_text",
                        event.target.value
                      )
                    }
                    rows="3"
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                  />
                </label>
                <div>
                  <span className="mb-2 block text-sm font-black text-[#12315c]">
                    Фото / видео главного экрана
                  </span>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#05a99d]/30 bg-cyan-50 px-3 py-2 text-sm transition hover:bg-cyan-100">
                    <Upload
                      size={24}
                      className="text-[#05a99d]"
                    />
                    <span className="font-bold text-[#12315c]">
                      Загрузить медиа
                    </span>
                    <span className="text-xs text-slate-500">
                      Первое фото/видео — фон, второе — карточка справа
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(event) =>
                        handleUpload(event, "root")
                      }
                      className="hidden"
                    />
                  </label>
                  {getMediaGroup(activeSection, "root").length >
                    0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getMediaGroup(
                        activeSection,
                        "root"
                      ).map((item) => (
                        <MediaPreview
                          key={item.id || item.src}
                          item={item}
                          onRemove={() =>
                            removeMedia(item.id, "root")
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {isContactsSection && (
              <>
                <div className="rounded-xl bg-gradient-to-r from-[#e9f5ff] to-[#e6fbf7] px-3 py-2 text-sm font-black text-[#0b5cab]">
                  Контактная информация и режим работы
                </div>
                <div className="grid gap-3.5 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Адрес учреждения
                    </span>
                    <input
                      value={activeSection.card_title || ""}
                      onChange={(event) =>
                        updateField(
                          "card_title",
                          event.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Основной телефон
                    </span>
                    <input
                      value={activeSection.card_text || ""}
                      onChange={(event) =>
                        updateField(
                          "card_text",
                          event.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Email
                    </span>
                    <input
                      value={activeSection.card_1_text || ""}
                      onChange={(event) =>
                        updateField(
                          "card_1_text",
                          event.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Режим работы
                    </span>
                    <input
                      value={activeSection.card_2_text || ""}
                      onChange={(event) =>
                        updateField(
                          "card_2_text",
                          event.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      WhatsApp для консультации
                    </span>
                    <input
                      value={activeSection.card_3_text || ""}
                      onChange={(event) =>
                        updateField(
                          "card_3_text",
                          event.target.value
                        )
                      }
                      placeholder="77070000000"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Горячая линия
                    </span>
                    <input
                      value={activeSection.card_4_text || ""}
                      onChange={(event) =>
                        updateField(
                          "card_4_text",
                          event.target.value
                        )
                      }
                      placeholder="77070000000"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                </div>
                <div className="mt-6 rounded-2xl bg-cyan-50 p-4 text-sm font-black text-[#0b5cab]">
                  Социальные сети
                </div>
                <div className="grid gap-3.5 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Соцсеть 1 — название
                    </span>
                    <input
                      value={activeSection.card_5_title || ""}
                      onChange={(event) =>
                        updateField(
                          "card_5_title",
                          event.target.value
                        )
                      }
                      placeholder="Instagram"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Соцсеть 1 — ссылка
                    </span>
                    <input
                      value={activeSection.card_5_text || ""}
                      onChange={(event) =>
                        updateField(
                          "card_5_text",
                          event.target.value
                        )
                      }
                      placeholder="https://instagram.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Соцсеть 2 — название
                    </span>
                    <input
                      value={activeSection.card_6_title || ""}
                      onChange={(event) =>
                        updateField(
                          "card_6_title",
                          event.target.value
                        )
                      }
                      placeholder="TikTok"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Соцсеть 2 — ссылка
                    </span>
                    <input
                      value={activeSection.card_6_text || ""}
                      onChange={(event) =>
                        updateField(
                          "card_6_text",
                          event.target.value
                        )
                      }
                      placeholder="https://tiktok.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Соцсеть 3 — название
                    </span>
                    <input
                      value={activeSection.card_7_title || ""}
                      onChange={(event) =>
                        updateField(
                          "card_7_title",
                          event.target.value
                        )
                      }
                      placeholder="Telegram"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-[#12315c]">
                      Соцсеть 3 — ссылка
                    </span>
                    <input
                      value={activeSection.card_7_text || ""}
                      onChange={(event) =>
                        updateField(
                          "card_7_text",
                          event.target.value
                        )
                      }
                      placeholder="https://telegram.org"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                </div>
              </>
            )}
            {isGroupedSection && (
              <>
                <div className="rounded-xl bg-gradient-to-r from-[#e9f5ff] to-[#e6fbf7] px-3 py-2 text-sm font-black text-[#0b5cab]">
                  Карточки раздела
                </div>
                {cards.map((label, index) => {
                  const num = index + 1
                  const groupKey = `card_${num}`
                  const groupMedia = getMediaGroup(
                    activeSection,
                    groupKey
                  )
                  const mediaDisabled =
                    disabledMediaSections.includes(
                      activeSection.id
                    )
                  return (
                    <div
                      key={groupKey}
                      className="rounded-xl border border-slate-200 bg-white/70 p-2 shadow-sm"
                    >
                      <button
                        type="button"
                        aria-expanded={openCard === num}
                        onClick={() => setOpenCard((current) => current === num ? null : num)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${openCard === num ? "bg-gradient-to-r from-[#e9f5ff] to-[#e6fbf7]" : "hover:bg-cyan-50"}`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-black text-[#12315c]">
                            {label}{activeSection[`card_${num}_title`] ? ` · ${activeSection[`card_${num}_title`]}` : ""}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {activeSection.id === "news" ? `Дата: ${activeSection.media?.news_dates?.[groupKey] || "не установлена"} · ` : ""}
                            {mediaDisabled ? "Без медиа" : `${groupMedia.length} фото/видео`}
                          </span>
                        </span>
                        {!mediaDisabled && groupMedia.slice(0, 2).map((item) => (
                          item.type === "video"
                            ? <span key={item.id || item.src} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-[10px] text-slate-600">Видео</span>
                            : <img key={item.id || item.src} src={item.preview || item.src} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                        ))}
                        {openCard === num ? <ChevronUp size={18} className="shrink-0 text-[#0b5cab]" /> : <ChevronDown size={18} className="shrink-0 text-[#0b5cab]" />}
                      </button>
                      {openCard === num && <div className="mt-3 border-t border-slate-100 pt-3">
                      <label className="block">
                        <span className="mb-2 block text-sm font-black text-[#12315c]">
                          Заголовок / ФИО
                        </span>
                        <input
                          value={
                            activeSection[
                              `card_${num}_title`
                            ] || ""
                          }
                          onChange={(event) =>
                            updateField(
                              `card_${num}_title`,
                              event.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                        />
                      </label>
                      <label className="mt-3 block">
                        <span className="mb-2 block text-sm font-black text-[#12315c]">
                          Описание / подробный текст
                        </span>
                        <textarea
                          value={
                            activeSection[
                              `card_${num}_text`
                            ] || ""
                          }
                          onChange={(event) =>
                            updateField(
                              `card_${num}_text`,
                              event.target.value
                            )
                          }
                          rows="3"
                          className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none transition focus:border-[#05a99d]"
                        />
                      </label>
                      {activeSection.id === "news" && (() => {
                        const storedDate = activeSection.media?.news_dates?.[groupKey]
                        const choice = publicationChoices[num] || { mode: "keep", date: "" }
                        const formatDate = (value) => {
                          if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return "не установлена"
                          const [year, month, day] = value.split("-")
                          return `${day}.${month}.${year}`
                        }
                        const setChoice = (update) => setPublicationChoices((prev) => ({
                          ...prev, [num]: { ...choice, ...update },
                        }))
                        return (
                          <div className="mt-3 rounded-xl bg-cyan-50 p-3">
                            <p className="text-sm font-bold text-[#12315c]">
                              Дата публикации: {formatDate(storedDate)}
                            </p>
                            <div className="mt-2 space-y-2 text-sm text-slate-700">
                              {[
                                ["keep", "Сохранить прежнюю дату"],
                                ["today", "Новая публикация — поставить сегодняшнюю дату"],
                                ["manual", "Указать дату вручную"],
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center gap-2">
                                  <input type="radio" name={`news-date-${num}`}
                                    checked={choice.mode === value}
                                    onChange={() => setChoice({ mode: value })} />
                                  {label}
                                </label>
                              ))}
                              {choice.mode === "manual" && (
                                <label className="block pl-5">
                                  <span className="mb-1 block text-xs font-semibold">Выбери дату публикации</span>
                                  <input type="date" value={choice.date}
                                    onChange={(event) => setChoice({ date: event.target.value })}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[#12315c]" />
                                </label>
                              )}
                            </div>
                          </div>
                        )
                      })()}
                      {!mediaDisabled && (
                        <div className="mt-3">
                          <span className="mb-2 block text-sm font-black text-[#12315c]">
                            Фото / видео этой карточки
                          </span>
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#05a99d]/30 bg-cyan-50 px-3 py-2 text-sm transition hover:bg-cyan-100">
                            <Upload
                              size={22}
                              className="text-[#05a99d]"
                            />
                            <span className="font-bold text-[#12315c]">
                              Загрузить в карточку
                            </span>
                            <span className="text-xs text-slate-500">
                              Можно выбрать несколько фото или видео
                            </span>
                            <input
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              onChange={(event) =>
                                handleUpload(event, groupKey)
                              }
                              className="hidden"
                            />
                          </label>
                          {groupMedia.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {groupMedia.map((item) => (
                                <MediaPreview
                                  key={item.id || item.src}
                                  item={item}
                                  onRemove={() =>
                                    removeMedia(
                                      item.id,
                                      groupKey
                                    )
                                  }
                                />
                              ))}
                            </div>
                          )}
                          {groupMedia.length === 0 && (
                            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-cyan-50 p-3 text-sm font-bold text-[#0b5cab]">
                              <ImagePlus size={18} />
                              Медиа для карточки ещё не добавлено
                            </div>
                          )}
                        </div>
                      )}
                      </div>}
                    </div>
                  )
                })}
              </>
            )}
          </fieldset>
        </motion.div>
      </div>
    </div>
  )
}
function MediaPreview({ item, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const isVideo = item.type === "video"
  const src = item.preview || item.src
  return (
    <>
      <div className="group relative w-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:w-28">
        {isVideo ? (
          <video src={src} className="h-20 w-full object-cover" controls preload="none" playsInline />
        ) : (
          <button type="button" onClick={() => setExpanded(true)} title="Увеличить фотографию" className="relative block w-full">
            <img src={src} alt={item.name || "Фото"} className="h-20 w-full object-cover" />
            <Maximize2 size={15} className="absolute bottom-1 right-1 rounded bg-white/90 p-0.5 text-[#12315c]" />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Удалить файл"
          title="Удалить файл"
          className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-lg bg-white/95 text-red-500 shadow-sm"
        >
          <Trash2 size={13} />
        </button>
        <p title={item.name} className="truncate px-2 py-1.5 text-[11px] font-semibold text-[#12315c]">
          {item.name || (isVideo ? "Видео" : "Фото")}
        </p>
      </div>
      {expanded && !isVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-5"
          onClick={() => setExpanded(false)}
        >
          <button
            type="button"
            aria-label="Закрыть просмотр"
            onClick={() => setExpanded(false)}
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white text-[#12315c]"
          ><X size={22} /></button>
          <img src={src} alt={item.name || "Фото"} className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </>
  )
}



