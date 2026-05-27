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
    <aside className="relative flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-white/70 bg-white/80 p-5 shadow-[18px_0_60px_rgba(18,49,92,0.08)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -left-24 top-0 h-60 w-60 rounded-full bg-cyan-400/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-13 w-13 shrink-0 overflow-hidden rounded-full border-[3px] border-transparent bg-gradient-to-br from-[#05a99d] via-[#0b5cab] to-[#3ce6d8] p-[2px] shadow-[0_10px_30px_rgba(5,169,157,0.18)]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-[86%] w-[86%] object-contain"
                />
              </div>
            </div>

            <div>
              <h2 className="font-black text-[#12315c]">
                Админ-панель
              </h2>

              <p className="text-xs font-semibold text-slate-500">
                Управление сайтом
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 bg-white text-[#12315c] shadow-sm transition hover:border-[#05a99d]/40 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-[0_16px_45px_rgba(18,49,92,0.08)]">
          <div className="flex items-center gap-2 text-sm font-black text-[#0b5cab]">
            <FileText size={16} />
            Панель управления
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-600">
            Редактирование разделов сайта, партнёров, контактов,
            документов, новостей, отзывов и заявок.
          </p>
        </div>

        <nav className="mt-6 grid gap-2">
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
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  isActive
                    ? "brand-gradient text-white shadow-[0_14px_35px_rgba(5,169,157,0.25)]"
                    : "bg-white/72 text-slate-600 shadow-sm hover:bg-cyan-50 hover:text-[#0b5cab]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="admin-active-pill"
                    className="absolute inset-0 rounded-2xl bg-white/0"
                  />
                )}

                <span
                  className={`relative z-10 grid h-8 w-8 place-items-center rounded-xl transition ${
                    isActive
                      ? "bg-white/16 text-white"
                      : "bg-cyan-50 text-[#0b5cab] group-hover:bg-white"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="relative z-10">
                  {item.title}
                </span>
              </motion.button>
            )
          })}
        </nav>
      </div>

      <div className="relative z-10 mt-auto rounded-[1.4rem] border border-white/70 bg-white/58 p-4 text-xs leading-5 text-slate-500 shadow-sm">
        <span className="font-black text-[#12315c]">
          CSO №1 Aktobe
        </span>
        <br />
        Внутренняя система управления контентом.
      </div>
    </aside>
  )
}
