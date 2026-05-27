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
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  function loadReviews() {
    setLoading(true)

    fetch(`${API_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Ошибка загрузки отзывов:", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadReviews()
  }, [])

  async function updateReview(id, action) {
    const token = localStorage.getItem("admin-token")

    await fetch(`${API_URL}/api/reviews/${id}/${action}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    loadReviews()
  }

  async function deleteReview(id) {
    const confirmDelete = confirm("Удалить отзыв без восстановления?")

    if (!confirmDelete) return

    const token = localStorage.getItem("admin-token")

    await fetch(`${API_URL}/api/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    loadReviews()
  }

  if (loading) {
    return (
      <div className="text-2xl font-black text-[#12315c]">
        Загрузка отзывов...
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#05a99d]">
            Review moderation
          </p>

          <h1 className="mt-3 text-4xl font-black text-[#12315c]">
            Модерация отзывов
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Новые отзывы не появляются на сайте автоматически. Сначала их нужно
            проверить и одобрить.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReviews}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-6 py-3 text-sm font-black text-[#12315c] shadow-xl transition hover:border-[#05a99d]/40 hover:bg-cyan-50"
        >
          <RefreshCw size={17} />
          Обновить
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="glass-card mt-8 rounded-[1.8rem] p-8 text-center">
          <MessageSquareText
            size={42}
            className="mx-auto text-[#05a99d]"
          />

          <h2 className="mt-4 text-2xl font-black text-[#12315c]">
            Отзывов пока нет
          </h2>

          <p className="mt-2 text-slate-600">
            Когда пользователь отправит отзыв с сайта, он появится здесь.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="glass-card rounded-[1.8rem] border border-cyan-100/70 p-5"
            >
              <div className="grid gap-5 xl:grid-cols-[1fr_220px] xl:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="brand-gradient grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-black text-white shadow-lg">
                      {String(review.name || "A").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-black text-[#12315c]">
                          {review.name}
                        </h2>

                        <span
                          className={`rounded-full border px-4 py-2 text-xs font-black ${
                            review.approved
                              ? "border-[#05a99d]/20 bg-[#05a99d]/10 text-[#047e76]"
                              : "border-[#0b5cab]/15 bg-[#0b5cab]/8 text-[#0b5cab]"
                          }`}
                        >
                          {review.approved
                            ? "Опубликован"
                            : "Ожидает проверки"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-[#0b5cab]">
                          <UserRound size={14} />
                          {review.role || "Посетитель"}
                        </span>

                        {review.phone && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#12315c] ring-1 ring-slate-200">
                            <Phone size={14} />
                            {review.phone}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                          <CalendarDays size={14} />
                          {review.created_at}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                  <p className="mt-5 max-w-4xl text-[15px] leading-8 text-slate-600">
                    {review.text}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 xl:justify-end">
                  {!review.approved && (
                    <button
                      type="button"
                      onClick={() =>
                        updateReview(review.id, "approve")
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-[#05a99d]/25 bg-[#05a99d]/10 px-5 py-3 text-sm font-black text-[#047e76] transition hover:bg-[#05a99d]/15"
                    >
                      <CheckCircle2 size={17} />
                      Одобрить
                    </button>
                  )}

                  {review.approved && (
                    <button
                      type="button"
                      onClick={() =>
                        updateReview(review.id, "hide")
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-[#0b5cab]/20 bg-[#0b5cab]/8 px-5 py-3 text-sm font-black text-[#0b5cab] transition hover:bg-[#0b5cab]/12"
                    >
                      <EyeOff size={17} />
                      Скрыть
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteReview(review.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-black text-rose-500 transition hover:bg-rose-50"
                  >
                    <Trash2 size={17} />
                    Удалить
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}