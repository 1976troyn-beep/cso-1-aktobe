import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trash2,
  Phone,
  Mail,
  User,
  MessageSquareText,
  Inbox,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  MessageCircle,
  LoaderCircle,
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL
const statusOptions = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "completed", label: "Завершена" },
]

const statusStyles = {
  new: "border-blue-200 bg-blue-50 text-[#0b5cab]",
  in_progress: "border-amber-200 bg-amber-50 text-amber-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
}

function whatsappLink(phone) {
  if (!phone) return null
  let digits = String(phone).replace(/\D/g, "")
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`
  if (digits.length === 10) digits = `7${digits}`
  if (digits.length < 10 || digits.length > 15) return null
  return `https://wa.me/${digits}`
}

const gradientClass = "bg-gradient-to-r from-[#0b5cab] via-[#078fb4] to-[#05a99d]"

export default function AdminApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedIds, setExpandedIds] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [savingStatusId, setSavingStatusId] = useState(null)
  const [statusError, setStatusError] = useState("")

  const token = localStorage.getItem("admin-token")

  useEffect(() => {
    let ignore = false

    async function loadInitialApplications() {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`${API_URL}/api/admin/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Ошибка загрузки заявок")
        }
        if (!ignore) setApplications(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(error)
        if (!ignore) setError("Не удалось загрузить заявки")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadInitialApplications()
    return () => { ignore = true }
  }, [token])

  async function loadApplications() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`${API_URL}/api/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Ошибка загрузки заявок")
      }
      setApplications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setError("Не удалось загрузить заявки")
    } finally {
      setLoading(false)
    }
  }

  async function deleteApplication(id) {
    const confirmed = window.confirm("Удалить заявку?")
    if (!confirmed) return

    try {
      setDeletingId(id)
      const response = await fetch(`${API_URL}/api/applications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Ошибка удаления")
      }
      setApplications((prev) => prev.filter((item) => item.id !== id))
      setExpandedIds((prev) => prev.filter((itemId) => itemId !== id))
    } catch (error) {
      console.error(error)
      window.alert("Ошибка удаления заявки")
    } finally {
      setDeletingId(null)
    }
  }

  async function updateStatus(id, status) {
    setSavingStatusId(id)
    setStatusError("")
    try {
      const response = await fetch(`${API_URL}/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Не удалось сохранить статус")
      setApplications((prev) => prev.map((item) =>
        item.id === id ? { ...item, status: data.application?.status || status } : item
      ))
    } catch (error) {
      console.error("Ошибка сохранения статуса заявки:", error)
      setStatusError(`Заявка №${id}: ${error.message || "Ошибка сохранения статуса"}`)
    } finally {
      setSavingStatusId(null)
    }
  }

  function toggleExpanded(id) {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-w-0 text-[#12315c]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#05a99d]">
            Applications CMS
          </p>
          <h1 className="mt-1 text-2xl font-black leading-tight text-[#12315c] sm:text-3xl">
            Заявки с сайта
          </h1>
          <p className="mt-1 text-xs text-[#56708b] sm:text-sm">
            Сообщения из формы обратной связи.
          </p>
        </div>

        <button
          type="button"
          onClick={loadApplications}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-bold text-[#0b5cab] shadow-sm transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Обновить
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-cyan-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#56708b]">
            <Inbox size={15} className="text-[#0b5cab]" /> Всего заявок
          </div>
          <p className="mt-1 text-2xl font-black text-[#12315c]">
            {loading ? "—" : error ? "—" : applications.length}
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#56708b]">
            <MessageSquareText size={15} className="text-[#05a99d]" /> Управление обращениями
          </div>
          <p className="mt-2 text-xs text-[#56708b]">
            Открывайте заявки, меняйте статус и связывайтесь через WhatsApp.
          </p>
        </div>
      </div>

      <section className="mt-3 rounded-2xl border border-cyan-100 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#eaf5ff] to-[#e6faf5] px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs font-black text-[#12315c]">
            <Inbox size={16} className="text-[#0b5cab]" /> Список заявок
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#0b5cab]">
            Всего: {loading || error ? "—" : applications.length}
          </span>
        </div>

        {statusError && (
          <div role="alert" className="mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            <AlertCircle size={16} className="shrink-0" /> {statusError}
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-dashed border-cyan-100 p-8 text-center text-sm font-semibold text-[#56708b]">
            Загрузка заявок...
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="rounded-xl border border-dashed border-cyan-100 px-4 py-8 text-center">
            <Inbox size={26} className="mx-auto text-[#05a99d]" />
            <p className="mt-2 text-sm font-black text-[#12315c]">Заявок пока нет</p>
            <p className="mt-1 text-xs text-[#56708b]">После отправки формы заявки появятся здесь.</p>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="grid gap-2.5">
            {applications.map((application, index) => {
              const expanded = expandedIds.includes(application.id)
              const status = statusOptions.some((option) => option.value === application.status)
                ? application.status : "new"
              const waUrl = whatsappLink(application.phone)
              return (
                <motion.article
                  key={application.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.025, 0.2) }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#eef7ff] to-[#e9faf6] px-3 py-3 sm:px-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${gradientClass} text-white`}>
                        <User size={17} />
                      </span>
                      <div className="min-w-0">
                        <p className="break-words text-sm font-black text-[#12315c]">
                          {application.full_name || "Без имени"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#56708b]">Заявка №{application.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#12315c]">
                        <span className="sr-only">Статус заявки №{application.id}</span>
                        {savingStatusId === application.id && <LoaderCircle size={14} className="animate-spin" />}
                        <select
                          aria-label={`Статус заявки №${application.id}`}
                          value={status}
                          onChange={(event) => updateStatus(application.id, event.target.value)}
                          disabled={savingStatusId === application.id || deletingId === application.id}
                          className={`max-w-[145px] cursor-pointer rounded-lg border px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-wait disabled:opacity-60 ${statusStyles[status]}`}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Написать в WhatsApp по заявке №${application.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleExpanded(application.id)}
                        aria-expanded={expanded}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-white px-3 py-2 text-xs font-bold text-[#0b5cab] transition hover:bg-cyan-50"
                      >
                        <MessageSquareText size={14} />
                        {expanded ? "Свернуть" : "Подробнее"}
                        <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteApplication(application.id)}
                        disabled={deletingId === application.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Удалить
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2 px-3 py-3 text-xs sm:grid-cols-2 sm:px-4">
                    <div className="flex min-w-0 items-center gap-2 text-[#12315c]">
                      <Phone size={15} className="shrink-0 text-[#05a99d]" />
                      {application.phone ? (
                        <a className="break-all font-semibold hover:underline" href={`tel:${application.phone}`}>
                          {application.phone}
                        </a>
                      ) : <span className="text-slate-500">Телефон не указан</span>}
                    </div>
                    <div className="flex min-w-0 items-center gap-2 text-[#12315c]">
                      <Mail size={15} className="shrink-0 text-[#05a99d]" />
                      <span className="break-all font-semibold">{application.email || "Email не указан"}</span>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 px-3 pb-4 pt-3 sm:px-4">
                          <p className="mb-2 flex items-center gap-2 text-xs font-black text-[#0b5cab]">
                            <MessageSquareText size={15} /> Сообщение
                          </p>
                          <p className="whitespace-pre-wrap break-words rounded-xl bg-[#f5fafc] p-3 text-sm leading-6 text-[#34506c]">
                            {application.message || "Сообщение не указано"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
