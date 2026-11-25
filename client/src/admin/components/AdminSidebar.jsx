
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  MessageSquareText,
  Handshake,
  Inbox,
  X,
} from "lucide-react"

const menu = [
  {
    id: "sections",
    title: "Разделы сайта",
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: "official",
    title: "Официальная информация",
    icon: <FileText size={18} />,
  },
  {
    id: "partners",
    title: "Партнёры",
    icon: <Handshake size={18} />,
  },
  {
    id: "reviews",
    title: "Модерация отзывов",
    icon: <MessageSquareText size={18} />,
  },
  {
    id: "applications",
    title: "Заявки",
    icon: <Inbox size={18} />,
  },
]

export default function AdminSidebar({
  activePage,
  setActivePage,
  onClose,
}) {
  return (
    <aside className="relative flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-slate-200/70 bg-white/90 p-3 shadow-[12px_0_40px_rgba(18,49,92,0.05)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -left-24 top-0 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#05a99d] via-[#0b8fb4] to-[#3ce6d8] p-[2px] shadow-[0_6px_18px_rgba(5,169,157,0.15)]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <img
                  src="/logo.png"
                  alt="Логотип ЦСО №1"
                  className="h-[86%] w-[86%] object-contain"
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-black text-[#12315c]">
                Админ-панель
              </h2>

              <p className="text-xs font-semibold text-slate-500">
                ЦСО №1 · Актобе
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-[#12315c] shadow-sm transition hover:border-[#05a99d]/40 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-[#05a99d]/25 bg-gradient-to-r from-[#eaf7ff] to-[#e9fbf7] p-3">
          <div className="flex items-center gap-2 text-xs font-black text-[#0b5cab]">
            Панель управления
          </div>

          <p className="mt-1 text-xs leading-4 text-slate-500">
            Редактирование материалов сайта
          </p>
        </div>

        <nav className="mt-3 grid gap-1.5">
          {menu.map((item, index) => {
            const isActive = activePage === item.id

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                  isActive
                    ? "bg-gradient-to-r from-[#0b5cab] via-[#078fb4] to-[#05a99d] text-white shadow-[0_8px_22px_rgba(5,169,157,0.18)]"
                    : "bg-white/70 text-slate-600 hover:bg-cyan-50 hover:text-[#0b5cab]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="admin-active-pill"
                    className="pointer-events-none absolute inset-0 rounded-xl bg-white/0"
                  />
                )}

                <span
                  className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#eaf7fa] text-[#0b5cab] group-hover:bg-white"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="relative z-10 leading-5">
                  {item.title}
                </span>
              </motion.button>
            )
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-slate-200/70 bg-white/70 p-3 text-xs leading-4 text-slate-500">
          <span className="font-black text-[#12315c]">
            CSO №1 Aktobe
          </span>
          <p className="mt-1">
            Внутренняя система управления контентом.
          </p>
        </div>
      </div>
    </aside>
  )
}


