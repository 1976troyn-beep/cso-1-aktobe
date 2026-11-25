import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, LogOut, Menu } from "lucide-react"
import AdminSidebar from "./components/AdminSidebar"
import AdminSections from "./pages/AdminSections"
import AdminOfficial from "./pages/AdminOfficial"
import AdminReviews from "./pages/AdminReviews"
import AdminPartners from "./pages/AdminPartners"
import AdminApplications from "./pages/AdminApplications"

export default function AdminLayout() {
  const [activePage, setActivePage] = useState("sections")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  function logout() {
    const confirmed = window.confirm("Вы действительно хотите выйти из админ-панели?")
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
      case "sections": return <AdminSections />
      case "official": return <AdminOfficial />
      case "partners": return <AdminPartners />
      case "reviews": return <AdminReviews />
      case "applications": return <AdminApplications />
      default: return <AdminSections />
    }
  }
  return (
    <div className="admin-layout min-h-screen overflow-x-hidden bg-[#f0f7fa] text-[#12315c]">
      <div className="pointer-events-none fixed -left-24 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative flex min-h-screen">
        <div className="hidden lg:block">
          <AdminSidebar activePage={activePage} setActivePage={handleSetPage} />
        </div>
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-40 bg-[#12315c]/45 backdrop-blur-sm lg:hidden" />
              <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 28, stiffness: 240 }} className="fixed left-0 top-0 z-50 h-full">
                <AdminSidebar activePage={activePage} setActivePage={handleSetPage} onClose={() => setIsSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[#dcebf0] bg-white/90 px-4 py-3 shadow-[0_8px_28px_rgba(18,49,92,0.06)] backdrop-blur-xl lg:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" onClick={() => setIsSidebarOpen(true)} aria-label="Открыть меню" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#d5e7eb] bg-white text-[#12315c] shadow-sm transition hover:border-[#05a99d] lg:hidden">
                  <Menu size={20} />
                </button>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#05a99d]">ЦСО №1 · Админ-панель</p>
                  <h1 className="mt-0.5 truncate text-lg font-black text-[#12315c] sm:text-xl">Управление сайтом</h1>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <motion.a href="/" target="_blank" rel="noreferrer" aria-label="Открыть сайт" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cce9e9] bg-[#edf9f8] px-3 text-sm font-bold text-[#0b5cab] transition hover:border-[#05a99d] hover:bg-[#e1f6f3] sm:px-4">
                  <ExternalLink size={16} />
                  <span className="hidden sm:inline">Открыть сайт</span>
                </motion.a>
                <motion.button type="button" onClick={logout} aria-label="Выйти" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#12315c] px-3 text-sm font-bold text-white shadow-[0_6px_18px_rgba(18,49,92,0.16)] transition hover:bg-[#0b5cab] sm:px-4">
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Выйти</span>
                </motion.button>
              </div>
            </div>
          </header>
          <section className="min-w-0 flex-1 px-4 py-4 lg:px-6 lg:py-5">
            <motion.div key={activePage} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
              {renderPage()}
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  )
}



