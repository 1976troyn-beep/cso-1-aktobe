import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Save,
  ImagePlus,
  CheckCircle2,
  Trash2,
  Upload,
  XCircle,
  AlertTriangle,
} from "lucide-react"

import authFetch from "../utils/authFetch"

const API_URL = import.meta.env.VITE_API_URL

const initialSections = [
  {
    id: "hero",
    title: "Главная",
    subtitle: "Главный экран сайта",
    heading: "Забота, безопасность и спокойная среда",
    text: "Круглосуточный уход, комфортные комнаты, медицинский контроль и индивидуальная поддержка.",
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
  const editorRef = useRef(null)
  const alertTimerRef = useRef(null)
  function showAlert(type, message) {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current)
    }

    setAlert(null)

    setTimeout(() => {
      setAlert({ type, message })

      alertTimerRef.current = setTimeout(() => {
        setAlert(null)
      }, 2200)
    }, 20)
  }

  useEffect(() => {
    fetch(`${API_URL}/api/sections`)
      .then((res) => res.json())
      .then((data) => {
        setSections(data)
        setActiveId(data[0]?.id || "hero")
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
    setActiveId(id)

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
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))

    try {
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
    }
  }

  function removeMedia(mediaId, groupKey = "root") {
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
    if (!activeSection) {
      showAlert("error", "Раздел не выбран")
      return
    }

    showAlert("warning", "Сохраняю изменения...")

    try {
      const response = await authFetch(
        `/api/sections/${activeSection.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activeSection),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Ошибка сохранения")
      }

      showAlert("success", "Сохранено")
    } catch (error) {
      console.error("SAVE ERROR:", error)
      showAlert("error", "Не удалось сохранить")
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
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#05a99d] md:text-sm">
            Content editor
          </p>

          <h1 className="mt-3 text-3xl font-black leading-[1.04] text-[#12315c] md:text-4xl">
            Редактор разделов сайта
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Разделы расположены в том же порядке, что и на сайте.
            Медиа доступно только в визуальных разделах.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="brand-gradient brand-shadow inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-white lg:px-6"
        >
          <Save size={17} />
          Сохранить
        </button>
      </div>

      <div className="mt-7 grid gap-5 lg:mt-8 lg:grid-cols-[0.35fr_1fr] lg:gap-6">
        <div className="glass-card rounded-[1.5rem] p-4 lg:rounded-[1.6rem]">
          <h2 className="px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 md:text-sm">
            Разделы
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => selectSection(section.id)}
                className={`rounded-2xl px-3 py-3 text-left transition md:px-4 ${
                  activeId === section.id
                    ? "brand-gradient text-white shadow-xl"
                    : "bg-white/70 text-slate-600 hover:bg-cyan-50"
                }`}
              >
                <div className="text-sm font-black leading-tight md:text-base">
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
          className="glass-card scroll-mt-24 rounded-[1.6rem] p-4 md:p-6 lg:rounded-[1.8rem]"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#12315c]">
                {activeSection.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {activeSection.subtitle}
              </p>
            </div>

            <div className="rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#0b5cab]">
              {activeSection.id}
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            <label>
              <span className="mb-2 block text-sm font-black text-[#12315c]">
                Заголовок раздела
              </span>

              <input
                value={activeSection.heading || ""}
                onChange={(event) =>
                  updateField("heading", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                rows="4"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
                  />
                </label>

                <div>
                  <span className="mb-2 block text-sm font-black text-[#12315c]">
                    Фото / видео главного экрана
                  </span>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[#05a99d]/35 bg-white/70 p-8 text-center transition hover:bg-cyan-50">
                    <Upload
                      size={30}
                      className="text-[#05a99d]"
                    />

                    <span className="mt-3 font-black text-[#12315c]">
                      Загрузить медиа
                    </span>

                    <span className="mt-1 text-sm text-slate-500">
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
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="rounded-2xl bg-cyan-50 p-4 text-sm font-black text-[#0b5cab]">
                  Контактная информация и режим работы
                </div>

                <div className="grid gap-5 md:grid-cols-2">
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                </div>

                <div className="mt-6 rounded-2xl bg-cyan-50 p-4 text-sm font-black text-[#0b5cab]">
                  Социальные сети
                </div>

                <div className="grid gap-5 md:grid-cols-2">
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
                    />
                  </label>
                </div>
              </>
            )}

            {isGroupedSection && (
              <>
                <div className="rounded-2xl bg-cyan-50 p-4 text-sm font-black text-[#0b5cab]">
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
                      className="rounded-2xl border border-slate-200 bg-white/60 p-4"
                    >
                      <h3 className="mb-4 text-lg font-black text-[#12315c]">
                        {label}
                      </h3>

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
                          className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
                        />
                      </label>

                      <label className="mt-4 block">
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
                          rows="4"
                          className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-[#05a99d]"
                        />
                      </label>

                      {!mediaDisabled && (
                        <div className="mt-4">
                          <span className="mb-2 block text-sm font-black text-[#12315c]">
                            Фото / видео этой карточки
                          </span>

                          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.3rem] border-2 border-dashed border-[#05a99d]/35 bg-white/70 p-6 text-center transition hover:bg-cyan-50">
                            <Upload
                              size={26}
                              className="text-[#05a99d]"
                            />

                            <span className="mt-2 font-black text-[#12315c]">
                              Загрузить в карточку
                            </span>

                            <span className="mt-1 text-xs text-slate-500">
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
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-cyan-50 p-4 text-sm font-bold text-[#0b5cab]">
                              <ImagePlus size={18} />
                              Медиа для карточки ещё не добавлено
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            className={`fixed bottom-6 left-4 right-4 z-[9999] flex items-center justify-center gap-3 rounded-2xl px-5 py-4 font-black shadow-2xl md:bottom-8 md:left-auto md:right-8 md:w-fit ${
              alert.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : alert.type === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-amber-50 text-amber-700"
            }`}
          >
            {alert.type === "success" && <CheckCircle2 />}
            {alert.type === "error" && <XCircle />}
            {alert.type === "warning" && <AlertTriangle />}

            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MediaPreview({ item, onRemove }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
      {item.type === "video" ? (
        <video
          src={item.preview || item.src}
          className="h-40 w-full object-cover"
          controls
        />
      ) : (
        <img
          src={item.preview || item.src}
          alt={item.name}
          className="h-40 w-full object-cover"
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-red-500 shadow-lg"
      >
        <Trash2 size={17} />
      </button>

      <div className="p-3">
        <p className="truncate text-sm font-bold text-[#12315c]">
          {item.name}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {item.type}
        </p>
      </div>
    </div>
  )
}