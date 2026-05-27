import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HeartPulse,
  Utensils,
  ShieldCheck,
  Accessibility,
  UsersRound,
  Stethoscope,
  X,
  ArrowRight,
} from "lucide-react"

import SectionTitle from "../ui/SectionTitle"
import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

const icons = [
  <HeartPulse size={28} />,
  <Utensils size={28} />,
  <ShieldCheck size={28} />,
  <Accessibility size={28} />,
  <UsersRound size={28} />,
  <Stethoscope size={28} />,
]

export default function Services() {
  const [activeService, setActiveService] = useState(null)

  const { getSection } = useSections()
  const { t, language } = useLanguage()

  const servicesSection = getSection("services")

  const heading =
    language === "RU"
      ? servicesSection?.heading || t.services.heading
      : t.services.heading

  const text =
    language === "RU"
      ? servicesSection?.text || t.services.text
      : t.services.text

  const services = [
    {
      title:
        language === "RU"
          ? servicesSection?.card_1_title || t.services.cards[0].title
          : t.services.cards[0].title,
      text:
        language === "RU"
          ? servicesSection?.card_1_text || t.services.cards[0].text
          : t.services.cards[0].text,
      details:
        language === "RU"
          ? servicesSection?.card_1_text || t.services.cards[0].details
          : t.services.cards[0].details,
      icon: icons[0],
    },
    {
      title:
        language === "RU"
          ? servicesSection?.card_2_title || t.services.cards[1].title
          : t.services.cards[1].title,
      text:
        language === "RU"
          ? servicesSection?.card_2_text || t.services.cards[1].text
          : t.services.cards[1].text,
      details:
        language === "RU"
          ? servicesSection?.card_2_text || t.services.cards[1].details
          : t.services.cards[1].details,
      icon: icons[1],
    },
    {
      title:
        language === "RU"
          ? servicesSection?.card_3_title || t.services.cards[2].title
          : t.services.cards[2].title,
      text:
        language === "RU"
          ? servicesSection?.card_3_text || t.services.cards[2].text
          : t.services.cards[2].text,
      details:
        language === "RU"
          ? servicesSection?.card_3_text || t.services.cards[2].details
          : t.services.cards[2].details,
      icon: icons[2],
    },
    {
      title:
        language === "RU"
          ? servicesSection?.card_4_title || t.services.cards[3].title
          : t.services.cards[3].title,
      text:
        language === "RU"
          ? servicesSection?.card_4_text || t.services.cards[3].text
          : t.services.cards[3].text,
      details:
        language === "RU"
          ? servicesSection?.card_4_text || t.services.cards[3].details
          : t.services.cards[3].details,
      icon: icons[3],
    },
    {
      title:
        language === "RU"
          ? servicesSection?.card_5_title || t.services.cards[4].title
          : t.services.cards[4].title,
      text:
        language === "RU"
          ? servicesSection?.card_5_text || t.services.cards[4].text
          : t.services.cards[4].text,
      details:
        language === "RU"
          ? servicesSection?.card_5_text || t.services.cards[4].details
          : t.services.cards[4].details,
      icon: icons[4],
    },
    {
      title:
        language === "RU"
          ? servicesSection?.card_6_title || t.services.cards[5].title
          : t.services.cards[5].title,
      text:
        language === "RU"
          ? servicesSection?.card_6_text || t.services.cards[5].text
          : t.services.cards[5].text,
      details:
        language === "RU"
          ? servicesSection?.card_6_text || t.services.cards[5].details
          : t.services.cards[5].details,
      icon: icons[5],
    },
  ]

  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/6 md:top-24 md:h-72 md:w-72" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/8 md:bottom-16 md:h-80 md:w-80" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle
          badge={t.services.badge}
          title={heading}
          text={text}
        />

        <div className="mt-11 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-7 xl:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              whileHover={{
                y: -6,
                scale: 1.01,
              }}
              className="glass-card group relative overflow-hidden rounded-[1.7rem] p-5 transition-all duration-300 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)] md:rounded-[2rem] md:p-7"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
                <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/12 blur-3xl" />
                <div className="absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
              </div>

              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.7rem] md:rounded-[2rem]">
                <div className="absolute -left-20 top-0 h-full w-24 rotate-12 bg-white/12 opacity-0 blur-2xl transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100 dark:bg-cyan-300/10" />
              </div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{
                    rotate: 4,
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.25 }}
                  className="brand-icon grid h-12 w-12 place-items-center rounded-2xl text-white md:h-14 md:w-14"
                >
                  {service.icon}
                </motion.div>

                <h3 className="mt-5 text-xl font-black text-[#12315c] md:mt-6 md:text-2xl">
                  {service.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 md:text-base md:leading-7">
                  {service.text}
                </p>

                <button
                  type="button"
                  onClick={() => setActiveService(service)}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#05a99d] transition-all duration-300 hover:gap-3 hover:text-[#0b5cab] md:mt-6"
                >
                  {t.services.more}
                  <ArrowRight size={16} />
                </button>

                <div className="mt-5 h-[2px] w-14 rounded-full brand-gradient transition-all duration-500 group-hover:w-24 md:mt-6 md:w-16 md:group-hover:w-28" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm dark:bg-black/70"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 z-[100] w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-2xl transition-colors duration-500 dark:border-white/10 dark:bg-[#071827] dark:text-white dark:shadow-[0_30px_90px_rgba(0,0,0,0.55)] md:rounded-[2rem] md:p-7"
            >
              <div className="pointer-events-none absolute inset-0 hidden dark:block">
                <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
              </div>

              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="absolute right-4 top-4 z-[120] grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-[#12315c] transition hover:bg-slate-200 dark:bg-white/8 dark:text-white dark:hover:bg-white/14 md:right-5 md:top-5"
              >
                <X size={18} />
              </button>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.28 }}
                  className="brand-icon grid h-14 w-14 place-items-center rounded-2xl text-white md:h-16 md:w-16"
                >
                  {activeService.icon}
                </motion.div>

                <h3 className="mt-5 pr-10 text-2xl font-black text-[#12315c] dark:bg-gradient-to-r dark:from-[#67b8ff] dark:to-[#43e7da] dark:bg-clip-text dark:text-transparent md:mt-6 md:text-3xl">
                  {activeService.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/72 md:text-base md:leading-8">
                  {activeService.details}
                </p>

                <div className="mt-5 rounded-2xl bg-cyan-50 p-4 text-sm font-semibold leading-6 text-[#0b5cab] dark:border dark:border-cyan-400/10 dark:bg-cyan-500/10 dark:text-cyan-100 md:mt-6">
                  {t.services.consultationText}
                </div>

                <motion.a
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  href="#contacts"
                  onClick={() => setActiveService(null)}
                  className="brand-gradient brand-shadow mt-5 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-black text-white md:mt-6 md:px-7 md:py-4"
                >
                  {t.hero.consultation}
                  <ArrowRight size={17} />
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}