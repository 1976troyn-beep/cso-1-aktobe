import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  EyeOff,
  Trash2,
  MessageSquareText,
  RefreshCw,
  Phone,
  UserRound,
  CalendarDays,
  Clock3,
  AlertCircle,
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL
const gradientClass = "bg-gradient-to-r from-[#0b5cab] via-[#078fb4] to-[#05a99d]"

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState(null)

  async function loadReviews() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`${API_URL}/api/reviews`, { headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` } })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (!Array.isArray(data)) throw new Error("Некорректный ответ сервера")
      setReviews(data)
    } catch (err) {
      console.error("Ошибка загрузки отзывов:", err)
      setError("Не удалось загрузить отзывы. Проверьте подключение к серверу.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    async function loadInitialReviews() {
      try {
        const response = await fetch(`${API_URL}/api/reviews`, { headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` } })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (!Array.isArray(data)) throw new Error("Некорректный ответ сервера")
        if (!ignore) setReviews(data)
      } catch (err) {
        console.error("Ошибка загрузки отзывов:", err)
        if (!ignore) setError("Не удалось загрузить отзывы. Проверьте подключение к серверу.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    void loadInitialReviews()
    return () => { ignore = true }
  }, [])

  async function updateReview(id, action) {
    if (busyId !== null) return
    setBusyId(id)
    setError("")
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch(`${API_URL}/api/reviews/${id}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      await loadReviews()
    } catch (err) {
      console.error("Ошибка изменения отзыва:", err)
      setError("Сервер не подтвердил изменение отзыва. Попробуйте ещё раз.")
    } finally {
      setBusyId(null)
    }
  }

  async function deleteReview(id) {
    if (busyId !== null) return
    if (!window.confirm("Удалить отзыв без восстановления?")) return
    setBusyId(id)
    setError("")
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      await loadReviews()
    } catch (err) {
      console.error("Ошибка удаления отзыва:", err)
      setError("Сервер не подтвердил удаление отзыва. Попробуйте ещё раз.")
    } finally {
      setBusyId(null)
    }
  }

  const pending = reviews.filter((review) => !review.approved).length
  const published = reviews.length - pending

  return (
    <div className="min-w-0 text-[#12315c]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#05a99d]">REVIEWS CMS</p>
          <h1 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">Модерация отзывов</h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">Проверка отзывов перед публикацией на сайте.</p>
        </div>
        <button
          type="button"
          onClick={loadReviews}
          disabled={loading || busyId !== null}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0b5cab] shadow-sm transition hover:bg-cyan-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Обновить
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-2xl border border-cyan-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><MessageSquareText size={15} /> Всего</div>
          <p className="mt-1 text-2xl font-black">{reviews.length}</p>
        </div>
        <div className="rounded-2xl border border-cyan-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b5cab]"><Clock3 size={15} /> Ожидают</div>
          <p className="mt-1 text-2xl font-black">{pending}</p>
        </div>
        <div className="rounded-2xl border border-cyan-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#047e76]"><CheckCircle2 size={15} /> Опубликованы</div>
          <p className="mt-1 text-2xl font-black">{published}</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <section className="rounded-2xl border border-cyan-100 bg-white p-3 shadow-[0_12px_35px_rgba(18,49,92,0.06)] sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-[#eaf4ff] to-[#e6fbf6] px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs font-black"><MessageSquareText size={16} className="text-[#0b5cab]" /> Список отзывов</div>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#0b5cab]">Всего: {reviews.length}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500"><RefreshCw size={18} className="animate-spin" /> Загрузка отзывов...</div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            {error ? "Список отзывов недоступен." : "Отзывов пока нет. Новые отзывы появятся здесь."}
          </div>
        ) : (
          <div className="grid gap-3">
            {reviews.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.025, 0.2) }}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-[#f0f8ff] to-[#ecfbf8] px-3 py-3 sm:px-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`${gradientClass} grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black text-white`}>
                      {String(review.name || "А").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="break-words text-sm font-black">{review.name || "Без имени"}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${review.approved ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                          {review.approved ? "Опубликован" : "Ожидает проверки"}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1"><UserRound size={12} /> {review.role || "Посетитель"}</span>
                        {review.phone && <span className="inline-flex items-center gap-1 break-all"><Phone size={12} /> {review.phone}</span>}
                        {review.created_at && <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {review.created_at}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId !== null || loading}
                      onClick={() => updateReview(review.id, review.approved ? "hide" : "approve")}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${review.approved ? "border border-cyan-200 bg-white text-[#0b5cab] hover:bg-cyan-50" : `${gradientClass} text-white shadow-sm hover:opacity-90`}`}
                    >
                      {review.approved ? <EyeOff size={15} /> : <CheckCircle2 size={15} />}
                      {review.approved ? "Скрыть" : "Одобрить"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId !== null || loading}
                      onClick={() => deleteReview(review.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                    >
                      <Trash2 size={15} /> Удалить
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap break-words px-3 py-3 text-sm leading-6 text-slate-700 sm:px-4">{review.text}</p>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
