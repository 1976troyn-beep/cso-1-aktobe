import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

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

import AdminLayout from "./admin/AdminLayout"
import AdminLogin from "./admin/AdminLogin"

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative grid min-h-screen place-items-center overflow-hidden bg-[#eef7f7] px-6 text-[#12315c] dark:bg-[#071827] dark:text-white"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/14 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/14 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative text-center"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 35px rgba(5,169,157,0.14)",
              "0 0 70px rgba(11,92,171,0.22)",
              "0 0 35px rgba(5,169,157,0.14)",
            ],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto mb-5 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-[#18d5cc] via-[#1198e8] to-[#0b5cab] p-[7px]"
        >
          <div className="grid h-full w-full place-items-center rounded-full bg-white">
            <motion.img
              src="/logo.png"
              alt="Logo"
              animate={{ scale: [1, 1.035, 1] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-[90%] w-[90%] object-contain"
            />
          </div>
        </motion.div>

        <h1 className="text-2xl font-black">Загрузка сайта</h1>

        <p className="mt-2 text-sm font-bold text-slate-500 dark:text-white/60">
          Подготавливаем разделы и данные...
        </p>
      </motion.div>
    </motion.div>
  )
}

function SitePage() {
  const { loading } = useSections()

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loader" />
      ) : (
        <div
          key="site"
          className="min-h-screen overflow-x-hidden bg-[#eef7f7] text-[#12315c] transition-colors duration-500 dark:bg-[#071827] dark:text-white"
        >
          <Header />
          <FloatingHotline />

          <motion.main
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
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
            <Reviews />
            <Partners />
            <Contacts />
            <Footer />
          </motion.main>
        </div>
      )}
    </AnimatePresence>
  )
}
function ProtectedAdmin() {
  const [isAuth, setIsAuth] = useState(() => {
    return Boolean(localStorage.getItem("admin-token"))
  })

  if (!isAuth) {
    return <AdminLogin onLogin={() => setIsAuth(true)} />
  }

  return <AdminLayout />
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SitePage />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}