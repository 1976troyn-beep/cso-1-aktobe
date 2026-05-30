import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  User,
  Phone,
  MessageSquareText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  Users,
  CalendarDays,
} from "lucide-react"

import SectionTitle from "../ui/SectionTitle"
import SkeletonCard from "../ui/SkeletonCard"
import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

const API_URL = import.meta.env.VITE_API_URL

let cachedApprovedReviews = null
let approvedReviewsRequest = null

const roles = [
  "Посетитель",
  "Родственник",
  "Опекун",
  "Волонтёр",
  "Социальный работник",
  "Другое",
]

function getInitials(name) {
  return String(name || "A").trim().charAt(0).toUpperCase()
}

function formatDate(value, language) {
  if (!value) return ""

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const locale =
    language === "KZ"
      ? "kk-KZ"
      : language === "EN"
      ? "en-US"
      : "ru-RU"

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function Reviews() {
  const { getSection } = useSections()
  const { t, language } = useLanguage()

  const reviewsSection = getSection("reviews")

  const [reviews, setReviews] = useState(cachedApprovedReviews || [])
  const [loadingReviews, setLoadingReviews] = useState(!cachedApprovedReviews)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [opened, setOpened] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    text: "",
    rating: 5,
    role: "Посетитель",
  })

  const heading =
    language === "RU"
      ? reviewsSection?.heading || t.reviews.heading
      : t.reviews.heading

  const description =
    language === "RU"
      ? reviewsSection?.text || t.reviews.text
      : t.reviews.text

  useEffect(() => {
    let isMounted = true

    async function loadReviews() {
      try {
        if (cachedApprovedReviews) {
          setReviews(cachedApprovedReviews)
          setLoadingReviews(false)
          return
        }

        if (!approvedReviewsRequest) {
          approvedReviewsRequest = fetch(`${API_URL}/api/reviews/approved`)
            .then((res) => res.json())
            .then((data) => {
              const preparedData = Array.isArray(data) ? data : []
              cachedApprovedReviews = preparedData
              return preparedData
            })
        }

        const data = await approvedReviewsRequest

        if (isMounted) {
          setReviews(data)
          setLoadingReviews(false)
        }
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error)

        if (isMounted) {
          setReviews([])
          setLoadingReviews(false)
        }
      }
    }

    loadReviews()

    return () => {
      isMounted = false
    }
  }, [])

  const allReviews = reviews
  const visibleReviews = allReviews.slice(currentIndex, currentIndex + 3)

  function nextSlide() {
    if (allReviews.length === 0) return

    if (currentIndex + 3 >= allReviews.length) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  function prevSlide() {
    if (allReviews.length === 0) return

    if (currentIndex === 0) {
      setCurrentIndex(Math.max(allReviews.length - 3, 0))
    } else {
      setCurrentIndex(currentIndex - 1)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      form.phone.trim().length < 10 ||
      !form.text.trim()
    ) {
      alert("Введите корректный номер телефона")
      return
    }

    try {
      setSending(true)

      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          text: form.text.trim(),
          rating: Number(form.rating) || 5,
          role: form.role,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Ошибка отправки")
      }

      cachedApprovedReviews = null
      approvedReviewsRequest = null

      setForm({
        name: "",
        phone: "",
        text: "",
        rating: 5,
        role: "Посетитель",
      })

      setSent(true)

      setTimeout(() => {
        setSent(false)
        setOpened(false)
      }, 4000)
    } catch (error) {
      console.error(error)
      alert(error.message || t.reviews.error)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="reviews" className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <SectionTitle
            badge={t.reviews.badge}
            title={heading}
            text={description}
          />
        </motion.div>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={prevSlide}
              disabled={loadingReviews || allReviews.length === 0}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="glass-card rounded-full p-3 transition disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </motion.button>

            <motion.button
              type="button"
              onClick={nextSlide}
              disabled={loadingReviews || allReviews.length === 0}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="glass-card rounded-full p-3 transition disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>

          <div className="text-sm font-bold text-slate-500">
            {loadingReviews ? "..." : allReviews.length} {t.reviews.count}
          </div>
        </div>

        {loadingReviews ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <SkeletonCard height="h-[340px]" />
              </motion.div>
            ))}
          </div>
        ) : allReviews.length > 0 ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {visibleReviews.map((review, index) => (
              <motion.article
                key={review.id || `${review.name}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.04,
                  ease: "easeOut",
                }}
                whileHover={{ y: -4 }}
                className="glass-card flex h-full min-w-0 flex-col rounded-[1.8rem] border border-cyan-100/70 bg-white/85 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-white/5 dark:shadow-none"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      className="brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-lg"
                    >
                      {getInitials(review.name)}
                    </motion.div>

                    <div className="min-w-0">
                      <h3 className="break-words text-base font-black leading-6 text-[#12315c] sm:text-lg">
                        {review.name}
                      </h3>

                      <div className="mt-3 flex flex-col items-start gap-2">
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#0b5cab]">
                          {review.role || "Посетитель"}
                        </span>

                        {review.created_at && (
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <CalendarDays
                              size={13}
                              className="text-slate-400"
                            />
                            {formatDate(review.created_at, language)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-fit shrink-0 gap-1 self-end rounded-full bg-[#05a99d]/10 px-3 py-2 sm:self-start">
                    {Array.from({
                      length: Number(review.rating) || 5,
                    }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-[#05a99d] text-[#05a99d]"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-[#0b5cab]/18 to-transparent dark:via-white/12" />

                <p className="mt-5 flex-1 break-words text-[15px] leading-8 text-slate-600">
                  {review.text}
                </p>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="glass-card mt-6 rounded-[1.6rem] p-6 text-center">
            <MessageSquareText
              size={34}
              className="mx-auto text-[#05a99d]"
            />

            <h3 className="mt-3 text-xl font-black text-[#12315c]">
              Отзывов пока нет
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              После проверки администратором отзывы появятся здесь.
            </p>
          </div>
        )}

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <motion.div
            whileHover={{ y: -2 }}
            className="brand-gradient brand-shadow rounded-[1.4rem] p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h3 className="text-base font-black">
                  {t.reviews.checked}
                </h3>

                <p className="mt-1 text-sm text-white/80">
                  {t.reviews.publishedCount}{" "}
                  {loadingReviews ? "..." : allReviews.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setOpened(!opened)}
            whileHover={{ y: -2 }}
            className="glass-card flex items-center justify-between rounded-[1.4rem] px-5 py-4 text-left transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-center gap-3">
              <div className="brand-icon grid h-10 w-10 place-items-center rounded-full text-white">
                <MessageSquareText size={17} />
              </div>

              <div>
                <h3 className="text-base font-black text-[#12315c]">
                  {t.reviews.leave}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {t.reviews.moderation}
                </p>
              </div>
            </div>

            <motion.div animate={{ rotate: opened ? 180 : 0 }}>
              <ChevronDown />
            </motion.div>
          </motion.button>
        </div>

        <AnimatePresence>
          {opened && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card relative mt-4 rounded-[1.6rem] p-5"
            >
              <button
                type="button"
                onClick={() => setOpened(false)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500"
              >
                <X size={18} />
              </button>

              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-[#12315c]">
                    <User size={16} />
                    {t.reviews.name}
                  </span>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[#12315c] outline-none transition focus:border-[#05a99d]"
                    placeholder={t.reviews.namePlaceholder}
                  />
                </label>

                <label>
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-[#12315c]">
                    <Phone size={16} />
                    {t.reviews.phone}
                  </span>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[#12315c] outline-none transition focus:border-[#05a99d]"
                    placeholder="+7 (700) 000-00-00"
                  />
                </label>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-[#12315c]">
                  <Users size={16} />
                  Кто оставляет отзыв?
                </span>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[#12315c] outline-none transition focus:border-[#05a99d]"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5">
                <p className="mb-3 text-sm font-black text-[#12315c]">
                  {t.reviews.rating}
                </p>

                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            rating: value,
                          }))
                        }
                      >
                        <Star
                          size={24}
                          className={
                            value <= form.rating
                              ? "fill-[#05a99d] text-[#05a99d]"
                              : "text-slate-300"
                          }
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-[#12315c]">
                  <MessageSquareText size={16} />
                  {t.reviews.reviewText}
                </span>

                <textarea
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  rows="4"
                  required
                  placeholder={t.reviews.reviewPlaceholder}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[#12315c] outline-none transition focus:border-[#05a99d]"
                />
              </label>

              {sent && (
                <div className="mt-4 rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-bold text-[#0b5cab]">
                  {t.reviews.success || "Отзыв успешно отправлен и появится после проверки администратора."}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="brand-gradient brand-shadow mt-5 inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-black text-white disabled:opacity-60"
              >
                <MessageSquareText size={17} />
                {sending ? t.reviews.sending : t.reviews.send}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}