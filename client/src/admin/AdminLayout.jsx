import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ExternalLink,
  LogOut,
  Menu,
} from "lucide-react"

import AdminSidebar from "./components/AdminSidebar"

import AdminSections from "./pages/AdminSections"
import AdminReviews from "./pages/AdminReviews"
import AdminPartners from "./pages/AdminPartners"
import AdminApplications from "./pages/AdminApplications"

export default function AdminLayout() {
  const [activePage, setActivePage] = useState("sections")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function logout() {
    const confirmed = window.confirm(
      "Вы действительно хотите выйти из админ-панели?"
    )

    if (!confirmed) return

    localStorage.removeItem("admin-token")
    window.location.reload()
  }

  function handleSetPage(page) {
    setActivePage(page)
    setIsSidebarOpen(false)
  }

  function renderPage() {
    switch (activePage) {
      case "sections":
        return <AdminSections />

      case "partners":
        return <AdminPartners />

      case "reviews":
        return <AdminReviews />

      case "applications":
        return <AdminApplications />

      default:
        return <AdminSections />
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#eef7f7] text-[#12315c]">
      <div className="pointer-events-none fixed -left-24 top-0 h-80 w-80 rounded-full bg-cyan-400/12 blur-3xl" />

      <div className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/12 blur-3xl" />

      <div className="relative flex min-h-screen">
        <div className="hidden lg:block">
          <AdminSidebar
            activePage={activePage}
            setActivePage={handleSetPage}
          />
        </div>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden"
              />

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  type: "spring",
                  damping: 28,
                  stiffness: 240,
                }}
                className="fixed left-0 top-0 z-50 h-full"
              >
                <AdminSidebar
                  activePage={activePage}
                  setActivePage={handleSetPage}
                  onClose={() =>
                    setIsSidebarOpen(false)
                  }
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 py-4 shadow-[0_12px_40px_rgba(18,49,92,0.08)] backdrop-blur-xl lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-[#12315c] shadow-sm transition hover:border-[#05a99d]/40 lg:hidden"
                >
                  <Menu size={20} />
                </button>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#05a99d]">
                    Admin panel
                  </p>

                  <h1 className="mt-1 truncate text-xl font-black text-[#12315c]">
                    Управление сайтом
                  </h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <motion.a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-3 text-sm font-black text-[#0b5cab] shadow-sm transition hover:border-[#05a99d]/40 hover:bg-cyan-50"
                >
                  <ExternalLink size={16} />

                  <span className="hidden sm:inline">
                    Открыть сайт
                  </span>
                </motion.a>

                <motion.button
                  type="button"
                  onClick={logout}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#12315c] px-4 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(18,49,92,0.22)] transition hover:bg-[#0e274b] md:px-5"
                >
                  <LogOut size={16} />

                  <span className="hidden sm:inline">
                    Выйти
                  </span>
                </motion.button>
              </div>
            </div>
          </header>

          <section className="min-w-0 flex-1 px-4 py-5 lg:px-8 lg:py-8">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.28,
                ease: "easeOut",
              }}
            >
              {renderPage()}
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  )
}