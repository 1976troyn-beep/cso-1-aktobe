import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Handshake,
  Plus,
  Trash2,
  EyeOff,
  Eye,
  ExternalLink,
  X,
} from "lucide-react"

import authFetch from "../utils/authFetch"

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#12315c] outline-none transition placeholder:text-slate-400 focus:border-[#05a99d] focus:ring-2 focus:ring-[#05a99d]/10"
const gradientClass = "bg-gradient-to-r from-[#0b5cab] via-[#078fb4] to-[#05a99d]"

export default function AdminPartners() {
  const [partners, setPartners] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    logo: "",
  })

  async function loadPartners() {
    try {
      const response = await authFetch("/api/admin/partners")
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      setForm({ title: "", description: "", link: "", logo: "" })
      setFormOpen(false)
      loadPartners()
    } catch (error) {
      console.error(error)
    }
  }

  async function deletePartner(id) {
    const confirmDelete = confirm("Удалить партнёра?")
    if (!confirmDelete) return

    try {
      await authFetch(`/api/partners/${id}`, { method: "DELETE" })
      loadPartners()
    } catch (error) {
      console.error(error)
    }
  }

  async function togglePartner(id, visible) {
    try {
      await authFetch(`/api/partners/${id}/${visible ? "hide" : "show"}`, {
        method: "PATCH",
      })
      loadPartners()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-4 text-[#12315c]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#05a99d]">
            Partners CMS
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#12315c] sm:text-3xl">
            Партнёры и сотрудничество
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Управление карточками партнёров, организаций и социальных программ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((open) => !open)}
          aria-expanded={formOpen}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(5,169,157,0.16)] transition hover:brightness-105 ${gradientClass}`}
        >
          {formOpen ? <X size={17} /> : <Plus size={17} />}
          {formOpen ? "Закрыть форму" : "Добавить партнёра"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <form onSubmit={createPartner} className="rounded-2xl border border-[#d9e9ef] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className={`grid h-9 w-9 place-items-center rounded-xl text-white ${gradientClass}`}>
                  <Handshake size={18} />
                </span>
                <div>
                  <h2 className="text-sm font-black">Новый партнёр</h2>
                  <p className="text-xs text-slate-500">Заполните информацию об организации</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor="partner-title" className="mb-1 block text-xs font-bold">Название партнёра</label>
                  <input id="partner-title" type="text" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={inputClass} placeholder="Название организации" />
                </div>
                <div>
                  <label htmlFor="partner-link" className="mb-1 block text-xs font-bold">Ссылка</label>
                  <input id="partner-link" type="text" value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} className={inputClass} placeholder="https://..." />
                </div>
                <div>
                  <label htmlFor="partner-logo" className="mb-1 block text-xs font-bold">Логотип (URL)</label>
                  <input id="partner-logo" type="text" value={form.logo} onChange={(event) => setForm({ ...form, logo: event.target.value })} className={inputClass} placeholder="https://..." />
                </div>
                <div className="md:row-span-2">
                  <label htmlFor="partner-description" className="mb-1 block text-xs font-bold">Описание</label>
                  <textarea id="partner-description" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={`${inputClass} min-h-[88px] resize-y`} placeholder="Описание партнёра" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:brightness-105 ${gradientClass}`}>
                  <Plus size={17} /> Добавить партнёра
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-hidden rounded-2xl border border-[#d9e9ef] bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-[#edf6ff] to-[#e7faf6] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Handshake size={17} className="text-[#0b5cab]" />
            <h2 className="text-sm font-black">Список партнёров</h2>
          </div>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#0b5cab]">
            Всего: {partners.length}
          </span>
        </div>

        {partners.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            Партнёров пока нет в списке.
          </div>
        ) : (
          <div className="grid gap-2">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
                className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-[#05a99d]/35 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#d9e9ef] bg-gradient-to-br from-[#edf6ff] to-[#e7faf6] text-[#0b5cab]">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.title} className="h-full w-full object-contain p-1" />
                    ) : (
                      <Handshake size={21} />
                    )}
                  </div>

                  <div className="min-w-[180px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-[#12315c]">{partner.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${partner.visible ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {partner.visible ? "Опубликован" : "Скрыт"}
                      </span>
                    </div>
                    {partner.description && (
                      <p className="mt-1 text-xs leading-5 text-slate-600">{partner.description}</p>
                    )}
                    {partner.link && (
                      <a href={partner.link} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#0b5cab] hover:underline">
                        <ExternalLink size={13} /> Перейти на сайт
                      </a>
                    )}
                  </div>

                  <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => togglePartner(partner.id, partner.visible)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-bold text-[#0b5cab] transition hover:bg-cyan-100"
                    >
                      {partner.visible ? <EyeOff size={15} /> : <Eye size={15} />}
                      {partner.visible ? "Скрыть" : "Показать"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePartner(partner.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={15} /> Удалить
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
