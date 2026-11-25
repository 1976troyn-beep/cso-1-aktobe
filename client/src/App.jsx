import { useEffect, useState, lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { motion } from "framer-motion"
import { LanguageProvider } from "./context/LanguageContext"
import useSections from "./hooks/useSections"
import Header from "./components/Header"
import HeroSection from "./sections/HeroSection"
import Services from "./components/Services"
import Conditions from "./components/Conditions"
import Rooms from "./components/Rooms"
import DisabilityCare from "./components/DisabilityCare"
import Leadership from "./components/Leadership"
import Specialists from "./components/Specialists"
import News from "./components/News"
import SocialLinks from "./components/SocialLinks"
import Documents from "./components/Documents"
import Reviews from "./components/Reviews"
import Contacts from "./components/Contacts"
import Footer from "./components/Footer"
import FloatingHotline from "./components/FloatingHotline"
import Partners from "./components/Partners"

const OfficialPage = lazy(() => import("./components/OfficialPage"))
const AdminLayout = lazy(() => import("./admin/AdminLayout"))
const AdminLogin = lazy(() => import("./admin/AdminLogin"))
const SPLASH_MS = 1600

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] grid min-h-screen place-items-center overflow-hidden bg-[#eef7f7] px-6 text-[#12315c]">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/14 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/14 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 22, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease: "easeOut" }} className="relative text-center">
        <motion.div animate={{ boxShadow: ["0 0 35px rgba(5,169,157,0.14)", "0 0 70px rgba(11,92,171,0.22)", "0 0 35px rgba(5,169,157,0.14)"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="mx-auto mb-5 grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#18d5cc] via-[#1198e8] to-[#0b5cab] p-[7px]">
          <div className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-white">
            <motion.img src="/logo.png" alt="Логотип ЦСО №1" animate={{ scale: [1, 1.035, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="block h-[90%] w-[90%] rounded-full object-contain" />
          </div>
        </motion.div>
        <h1 className="text-xl font-bold md:text-2xl">Загрузка сайта</h1>
        <p className="mt-2 text-xs font-medium text-slate-500 md:text-sm">Подготавливаем разделы и данные...</p>
        <div className="mx-auto mt-5 h-1 w-44 overflow-hidden rounded-full bg-slate-200">
          <motion.div className="h-full w-full origin-left rounded-full bg-gradient-to-r from-cyan-400 to-blue-600" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: SPLASH_MS / 1000, ease: "linear" }} />
        </div>
      </motion.div>
    </div>
  )
}

function SitePage() {
  const { loading, getSection } = useSections()
  const [minimumElapsed, setMinimumElapsed] = useState(false)
  const [readyImage, setReadyImage] = useState(null)
  const hero = getSection("hero")
  const media = hero?.media?.[0]
  const imageUrl = media?.type === "video" ? null : media?.src || "/hero-bg.jpg"
  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumElapsed(true), SPLASH_MS)
    return () => window.clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (loading) return
    if (!imageUrl) return
    let active = true
    const image = new Image()
    image.onload = () => { if (active) setReadyImage(imageUrl) }
    image.onerror = () => { if (active) setReadyImage(imageUrl) }
    image.src = imageUrl
    return () => { active = false }
  }, [loading, imageUrl])
  const splashDone = minimumElapsed && !loading && (!imageUrl || readyImage === imageUrl)
  if (!splashDone) return <LoadingScreen />
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eef7f7] text-[#12315c] transition-colors duration-500">
      <Header />
      <FloatingHotline />
      <main>
        <HeroSection />
        <Services />
        <Conditions />
        <Rooms />
        <DisabilityCare />
        <Leadership />
        <Specialists />
        <News />
        <SocialLinks />
        <Documents />
        <Partners />
        <Reviews />
        <Contacts />
        <Footer />
      </main>
    </div>
  )
}

function ProtectedAdmin() {
  const [isAuth, setIsAuth] = useState(() => Boolean(localStorage.getItem("admin-token")))
  if (!isAuth) return <AdminLogin onLogin={() => setIsAuth(true)} />
  return <AdminLayout />
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<SitePage />} />
            <Route path="/official" element={<OfficialPage />} />
            <Route path="/admin" element={<ProtectedAdmin />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  )
}







