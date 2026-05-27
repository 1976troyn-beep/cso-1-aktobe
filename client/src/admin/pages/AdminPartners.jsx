import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Handshake,
  Plus,
  Trash2,
  EyeOff,
  Eye,
  ExternalLink,
} from "lucide-react"

import authFetch from "../utils/authFetch"

export default function AdminPartners() {
  const [partners, setPartners] = useState([])

  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    logo: "",
  })

  async function loadPartners() {
    try {
      const response = await authFetch(
        "/api/admin/partners"
      )

      const data = await response.json()

      setPartners(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    async function init() {
      await loadPartners()
    }

    init()
  }, [])

  async function createPartner(event) {
    event.preventDefault()

    if (!form.title.trim()) return

    try {
      await authFetch("/api/partners", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      })

      setForm({
        title: "",
        description: "",
        link: "",
        logo: "",
      })

      loadPartners()
    } catch (error) {
      console.error(error)
    }
  }

  async function deletePartner(id) {
    const confirmDelete = confirm(
      "Удалить партнёра?"
    )

    if (!confirmDelete) return

    try {
      await authFetch(`/api/partners/${id}`, {
        method: "DELETE",
      })

      loadPartners()
    } catch (error) {
      console.error(error)
    }
  }

  async function togglePartner(id, visible) {
    try {
      await authFetch(
        `/api/partners/${id}/${visible ? "hide" : "show"}`,
        {
          method: "PATCH",
        }
      )

      loadPartners()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#05a99d]">
          Partners CMS
        </p>

        <h1 className="mt-3 text-4xl font-black text-[#12315c]">
          Партнёры и сотрудничество
        </h1>

        <p className="mt-4 max-w-2xl text-slate-600">
          Управление карточками партнёров,
          организаций и социальных программ.
        </p>
      </div>

      <form
        onSubmit={createPartner}
        className="glass-card mt-8 rounded-[2rem] p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-black text-[#12315c]">
              Название партнёра
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm({
                  ...form,
                  title: event.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-cyan-400"
              placeholder="Название организации"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-[#12315c]">
              Ссылка
            </label>

            <input
              type="text"
              value={form.link}
              onChange={(event) =>
                setForm({
                  ...form,
                  link: event.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-cyan-400"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-black text-[#12315c]">
            Описание
          </label>

          <textarea
            rows={4}
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-cyan-400"
            placeholder="Описание партнёра"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-black text-[#12315c]">
            Логотип (URL)
          </label>

          <input
            type="text"
            value={form.logo}
            onChange={(event) =>
              setForm({
                ...form,
                logo: event.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-cyan-400"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          className="brand-gradient brand-shadow mt-6 inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-black text-white"
        >
          <Plus size={18} />
          Добавить партнёра
        </button>
      </form>

      <div className="mt-8 grid gap-5">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="glass-card rounded-[1.8rem] p-5"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="brand-icon grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.title}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <Handshake size={22} />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black text-[#12315c]">
                      {partner.title}
                    </h2>

                    <span
                      className={`rounded-full px-4 py-2 text-xs font-black ${
                        partner.visible
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {partner.visible
                        ? "Опубликован"
                        : "Скрыт"}
                    </span>
                  </div>

                  <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                    {partner.description}
                  </p>

                  {partner.link && (
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#0b5cab]"
                    >
                      <ExternalLink size={16} />
                      Перейти
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    togglePartner(
                      partner.id,
                      partner.visible
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-5 py-3 text-sm font-black text-[#0b5cab]"
                >
                  {partner.visible ? (
                    <>
                      <EyeOff size={17} />
                      Скрыть
                    </>
                  ) : (
                    <>
                      <Eye size={17} />
                      Показать
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deletePartner(partner.id)
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-3 text-sm font-black text-red-500"
                >
                  <Trash2 size={17} />
                  Удалить
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}