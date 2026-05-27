import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Trash2,
  Phone,
  Mail,
  User,
  MessageSquareText,
  Inbox,
  RefreshCw,
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

export default function AdminApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const token = localStorage.getItem("admin-token")

  useEffect(() => {
    async function loadInitialApplications() {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`${API_URL}/api/admin/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Ошибка загрузки заявок")
        }

        setApplications(data)
      } catch (error) {
        console.error(error)
        setError("Не удалось загрузить заявки")
      } finally {
        setLoading(false)
      }
    }

    loadInitialApplications()
  }, [token])

  async function loadApplications() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`${API_URL}/api/admin/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Ошибка загрузки заявок")
      }

      setApplications(data)
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
      const response = await fetch(`${API_URL}/api/applications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Ошибка удаления")
      }

      setApplications((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error(error)
      alert("Ошибка удаления заявки")
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#05a99d]">
            Applications
          </p>

          <h1 className="mt-3 text-4xl font-black text-[#12315c]">
            Заявки с сайта
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Пользовательские заявки из формы обратной связи.
          </p>
        </div>

        <button
          type="button"
          onClick={loadApplications}
          className="brand-gradient brand-shadow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black text-white"
        >
          <RefreshCw size={17} />
          Обновить
        </button>
      </div>

      {loading && (
        <div className="mt-10 rounded-2xl bg-white p-6 font-bold text-slate-600">
          Загрузка заявок...
        </div>
      )}

      {!loading && error && (
        <div className="mt-10 rounded-2xl bg-red-50 p-6 font-bold text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="mt-10 rounded-[1.6rem] bg-white p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-500">
            <Inbox size={28} />
          </div>

          <h3 className="mt-4 text-2xl font-black text-[#12315c]">
            Заявок пока нет
          </h3>

          <p className="mt-2 text-slate-500">
            После отправки формы заявки появятся здесь.
          </p>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="mt-10 grid gap-5">
          {applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-[1.6rem] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-black text-[#0b5cab]">
                      <User size={16} />
                      {application.full_name || "Без имени"}
                    </span>

                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-500">
                      ID: {application.id}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <a
                      href={`tel:${application.phone}`}
                      className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 font-bold text-[#12315c]"
                    >
                      <Phone size={17} className="text-[#05a99d]" />
                      {application.phone || "Телефон не указан"}
                    </a>

                    <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 font-bold text-[#12315c]">
                      <Mail size={17} className="text-[#05a99d]" />
                      {application.email || "Email не указан"}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white/80 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#05a99d]">
                      <MessageSquareText size={17} />
                      Сообщение
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {application.message || "Сообщение не указано"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteApplication(application.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 size={17} />
                  Удалить
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}