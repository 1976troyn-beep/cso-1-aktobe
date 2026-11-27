import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  CalendarDays,
  Check,
  HeartPulse,
  ShieldCheck,
  HeartHandshake,
  Accessibility,
  FileText,
  ArrowRight,
} from "lucide-react"
import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"
const EMPTY_MEDIA = []
const LOCAL_BACKGROUND_SOURCE = "https://uiwvbwhpxywctdqonypj.supabase.co/storage/v1/object/public/uploads/1780642757336-blob"
const LOCAL_CARD_SOURCE = "https://uiwvbwhpxywctdqonypj.supabase.co/storage/v1/object/public/uploads/1780642785164-ddd"
function ReadyImage({ src, className, alt = "", ...props }) {
  const [ready, setReady] = useState(false)
  return <img src={src} alt={alt} {...props} onLoad={() => setReady(true)} className={`${className} transition-opacity duration-500 motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`} />
}
function HeroVideo({ src }) {
  const [ready, setReady] = useState(false)
  return <video src={src} autoPlay muted loop playsInline preload="auto" onPlaying={() => setReady(true)} onError={() => setReady(false)} ref={video => { if (video) video.playbackRate = 0.72 }} className={`absolute inset-0 h-full w-full object-cover !absolute !inset-0 !h-full !max-h-none !w-full !object-cover transition-opacity duration-500 motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`} />
}
export default function HeroSection() {
  const { getSection } = useSections()
  const { t, language } = useLanguage()
  const hero = getSection("hero")
  const heading =
    language === "RU"
      ? hero?.heading || t.hero.heading
      : t.hero.heading
  const text =
    language === "RU"
      ? hero?.text || t.hero.text
      : t.hero.text
  const cardTitle =
    language === "RU"
      ? hero?.card_title || t.hero.cardTitle
      : t.hero.cardTitle
  const cardText =
    language === "RU"
      ? hero?.card_text || t.hero.cardText
      : t.hero.cardText
  const heroMedia = hero?.media || EMPTY_MEDIA
  const backgroundMedia = heroMedia[0]
  const cardSource = heroMedia[1]?.src
  const cardImage = !cardSource || cardSource === LOCAL_CARD_SOURCE ? "/care-card.jpg" : cardSource
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden pt-24 md:pt-32 lg:[@media(max-height:900px)]:pt-32"
    >
      <div className="absolute inset-0 bg-[#dfeeed]" />
      <div className="absolute inset-0 overflow-hidden">
        <img src="/hero-bg.jpg" alt="" fetchPriority="high" loading="eager" className="absolute inset-0 h-full w-full object-cover !absolute !inset-0 !h-full !max-h-none !w-full !object-cover" />
      {backgroundMedia?.type === "video" ? (
        <HeroVideo key={backgroundMedia.src} src={backgroundMedia.src} />
      ) : backgroundMedia?.src && backgroundMedia.src !== "/hero-bg.jpg" && backgroundMedia.src !== LOCAL_BACKGROUND_SOURCE ? (
        <ReadyImage key={backgroundMedia.src} src={backgroundMedia.src} className="absolute inset-0 h-full w-full object-cover !absolute !inset-0 !h-full !max-h-none !w-full !object-cover" decoding="async" />
      ) : null}
      </div>
      {/* Soft Premium: a calm, light backdrop for readable text.
          The background photo/video remains fully managed by the admin panel. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/20" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f3f8f6]/[0.57] via-[#f3f8f6]/[0.30] to-[#f3f8f6]/[0.12] lg:from-[#f3f8f6]/[0.65] lg:via-[#f3f8f6]/[0.29] lg:to-[#f3f8f6]/[0.10]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-[#112d39]/[0.08]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl items-center gap-8 px-6 pb-20 pt-2 md:min-h-screen md:gap-10 md:pb-12 md:pt-4 lg:-translate-y-8 lg:grid-cols-[1.05fr_0.95fr] lg:content-center lg:items-end lg:gap-x-12 lg:gap-y-7 lg:py-0 lg:[@media(max-height:900px)]:min-h-[calc(100svh-8rem)] lg:[@media(max-height:900px)]:translate-y-0 lg:[@media(max-height:900px)]:gap-x-6 lg:[@media(max-height:900px)]:pb-6">
        <motion.div
            initial={false}
          className="relative translate-y-8 sm:translate-y-6 md:translate-y-0"
        >
          <motion.div
            initial={false}
            className="relative max-w-[720px] pl-4"
          >
            <div className="absolute left-0 top-1 h-[74px] w-[3px] rounded-full brand-gradient" />
            <p className="text-[17px] font-black uppercase leading-tight tracking-[0.18em] text-[#0b5cab] drop-shadow-sm  md:text-[20px]">
              {t.hero.topLine1}
            </p>
            <p className="mt-1 text-[17px] font-black uppercase leading-tight tracking-[0.16em] text-[#12315c] drop-shadow-sm  md:text-[20px]">
              {t.hero.topLine2}
            </p>
            <p className="mt-3 text-[13px] font-black uppercase tracking-[0.08em] text-[#05a99d] md:text-[15px]">
              {t.hero.centerName}
            </p>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-[#12315c] ">
              {t.hero.department}
            </p>
          </motion.div>
          <motion.h1
            initial={false}
            className="mt-6 max-w-4xl text-[2.8rem] font-black leading-[0.93] tracking-[-0.04em] sm:text-5xl md:text-7xl lg:[@media(max-height:900px)]:text-[clamp(2rem,4.1vw,3.5rem)] lg:[@media(max-height:900px)]:mt-3"
          >
            <span className="brand-text-gradient block drop-shadow-[0_4px_12px_rgba(255,255,255,0.18)]  ">
              {heading}
            </span>
          </motion.h1>
          <motion.p
            initial={false}
            className="mt-5 max-w-2xl text-base font-bold leading-7 text-[#12315c]  md:text-lg md:leading-8 lg:[@media(max-height:900px)]:mt-3 lg:[@media(max-height:900px)]:text-base lg:[@media(max-height:900px)]:leading-6"
          >
            {text}
          </motion.p>
          <motion.div
            initial={false}
            className="mt-7 lg:[@media(max-height:900px)]:mt-3 h-[2px] w-52 origin-left rounded-full brand-gradient"
          />
          <motion.div
            initial={false}
            className="mt-7 grid max-w-2xl gap-3.5 sm:grid-cols-2 md:mt-10 md:gap-4 lg:[@media(max-height:900px)]:mt-4"
          >
            <motion.a
              whileHover={{
                y: -3,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              href="#contacts"
              className="brand-gradient brand-shadow inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-black text-white md:px-8 md:py-4 lg:[@media(max-height:900px)]:px-4 lg:[@media(max-height:900px)]:py-3"
            >
              <CalendarDays size={18} />
              {t.hero.consultation}
            </motion.a>
            <motion.a
              whileHover={{
                y: -3,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              href="#services"
              className="glass-card inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-black text-[#12315c]  md:px-8 md:py-4 lg:[@media(max-height:900px)]:px-4 lg:[@media(max-height:900px)]:py-3"
            >
              <Check size={18} />
              {t.hero.services}
            </motion.a>
          </motion.div>
          {/* Four matching cards directly beneath the hero buttons.
              Desktop: one horizontal row. Tablet: two columns. Mobile: stacked. */}
          <motion.div
            initial={false}
            className="mt-6 lg:[@media(max-height:900px)]:mt-3 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-2"
          >
            {[
              { value: "24/7", text: t.hero.statCare, icon: <HeartPulse size={19} /> },
              { value: "100%", text: t.hero.statSafety, icon: <ShieldCheck size={19} /> },
              { value: "15+", text: t.hero.statSpecialists, icon: <HeartHandshake size={19} /> },
            ].map((item) => (
              <motion.div
                key={item.value}
                whileHover={{ y: -4, scale: 1.025, rotate: -0.35 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className="glass-card flex min-h-[76px] min-w-0 items-center gap-2 rounded-[1.2rem] px-3 py-3   "
              >
                <span className="brand-icon grid h-9 w-9 shrink-0 place-items-center rounded-full text-white">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-lg font-black leading-tight text-[#12315c] ">
                    {item.value}
                  </div>
                  <div className="mt-0.5 text-[11px] font-semibold leading-[1.25] text-[#12315c] ">
                    {item.text}
                  </div>
                </div>
              </motion.div>
            ))}
            <Link
              to="/official"
              aria-label={language === "KZ" ? "Ресми ақпарат" : language === "EN" ? "Official information" : "Официальная информация"}
              className="brand-gradient relative flex min-h-[76px] min-w-0 items-center gap-2 rounded-[1.2rem] px-3 py-3 text-white lg:hidden shadow-[0_10px_26px_rgba(11,92,171,0.20)] transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/40 bg-white/15">
                <FileText size={19} />
              </span>
              <div className="min-w-0 flex-1 pr-1">
                <div className="text-[13px] font-black leading-tight">
                  {language === "KZ" ? "Бөлімдер" : language === "EN" ? "Sections" : "Разделы"}
                </div>
                <div className="mt-0.5 text-[11px] font-semibold leading-[1.25] text-white/90">
                  {language === "KZ" ? "Ақпарат және құжаттар" : language === "EN" ? "Information and documents" : "Информация и документы"}
                </div>
              </div>
              <ArrowRight size={15} className="absolute right-2 top-2 opacity-90" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
            initial={false}
          className="relative hidden lg:block"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              y: -5,
              scale: 1.01,
            }}
            className="relative ml-auto max-w-[500px] overflow-hidden rounded-[2.2rem] border border-white/20 bg-transparent shadow-[0_35px_80px_rgba(15,23,42,0.22)]   "
          >
            <div className="relative h-[330px] lg:[@media(max-height:900px)]:h-[clamp(180px,32vh,280px)] w-full bg-[#dfeeed]">
              <img src="/care-card.jpg" alt="Care" loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover brightness-[0.97]" />
              {cardImage !== "/care-card.jpg" && <ReadyImage key={cardImage} src={cardImage} className="absolute inset-0 h-full w-full object-cover brightness-[0.97]" decoding="async" />}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 via-black/36 to-transparent p-7 lg:[@media(max-height:900px)]:p-4 text-white  ">
              <div className="flex items-end gap-4">
                <motion.div
                  whileHover={{
                    scale: 1.04,
                  }}
                  className="brand-icon grid h-16 w-16 place-items-center rounded-2xl text-white"
                >
                  <Accessibility size={34} />
                </motion.div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {cardTitle}
                  </h3>
                  <p className="mt-1 text-sm text-white/82">
                    {cardText}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Desktop official sections link: directly below the care photo,
              exactly the same width as the photo card. */}
          <Link
            to="/official"
            aria-label={language === "KZ" ? "Бөлімдер: ақпарат және құжаттар" : language === "EN" ? "Sections: information and documents" : "Разделы: информация и документы"}
            className="brand-gradient relative ml-auto mt-6 lg:[@media(max-height:900px)]:mt-3 flex min-h-[76px] w-full max-w-[500px] items-center gap-3 rounded-[1.2rem] px-5 py-3 text-white shadow-[0_10px_26px_rgba(11,92,171,0.20)] transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 bg-white/15">
              <FileText size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] font-black leading-tight">
                {language === "KZ" ? "Бөлімдер" : language === "EN" ? "Sections" : "Разделы"}
              </div>
              <div className="mt-1 text-[12px] font-semibold leading-tight text-white/90">
                {language === "KZ" ? "Ақпарат және құжаттар" : language === "EN" ? "Information and documents" : "Информация и документы"}
              </div>
            </div>
            <ArrowRight size={19} className="shrink-0" aria-hidden="true" />
          </Link>
          <motion.div
            initial={false}
            whileHover={{
              scale: 1.03,
              rotate: 2,
            }}
            className="absolute -top-20 right-8 z-20 lg:[@media(max-height:900px)]:-top-10"
          >
            <div className="h-42 w-42 lg:[@media(max-height:900px)]:h-28 lg:[@media(max-height:900px)]:w-28 overflow-hidden rounded-full border-[5px] border-transparent bg-gradient-to-br from-[#05a99d] via-[#0b5cab] to-[#3ce6d8] p-[4px] shadow-[0_15px_55px_rgba(5,169,157,0.22)]">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                <img
                  src="/logo.png"
                  alt="Логотип"
                  loading="eager"
                  fetchPriority="high"
                  className="h-[88%] w-[88%] object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
