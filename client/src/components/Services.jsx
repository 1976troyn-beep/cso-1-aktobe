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
  const { t } = useLanguage()
  const servicesSection = getSection("services")
  const heading = servicesSection?.heading || t.services.heading
  const text = servicesSection?.text || t.services.text
  const services = icons.map((icon, index) => {
    const card = t.services.cards[index]
    const number = index + 1
    const title = servicesSection?.[`card_${number}_title`] || card.title
    const description = servicesSection?.[`card_${number}_text`] || ""
    return { title, text: description || card.text, details: description || card.details, icon }
  })

  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 md:py-32"
    >
      <style>{`
        @media (max-width: 767px) {
          #services .cso-services-container { padding-left: 10px !important; padding-right: 10px !important; }
          #services .cso-service-card { padding: 12px !important; border-radius: 18px !important; }
          #services .cso-service-title { font-size: 16px !important; line-height: 1.3 !important; font-weight: 700 !important; }
          #services .cso-service-description { font-size: 13px !important; line-height: 1.5 !important; }
          #services .cso-service-modal { width: calc(100% - 20px); max-height: calc(100dvh - 24px); overflow-y: auto; padding: 16px !important; }
          #services .cso-service-modal h3 { font-size: 19px !important; line-height: 1.25 !important; }
          #services .cso-service-modal p { font-size: 13px !important; line-height: 1.55 !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          #services .cso-services-container { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl  md:top-24 md:h-72 md:w-72" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl  md:bottom-16 md:h-80 md:w-80" />

      <div className="cso-services-container relative mx-auto max-w-7xl px-6">
        <SectionTitle
          badge={t.services.badge}
          title={heading}
          text={text}
        />

        <div className="mt-8 grid gap-3 md:mt-10 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
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
              className="cso-service-card glass-card group relative overflow-hidden rounded-[1.7rem] p-4 transition-all duration-300 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)] md:rounded-[1.7rem] md:p-5"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
                <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/12 blur-3xl" />
                <div className="absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
              </div>

              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.7rem] md:rounded-[2rem]">
                <div className="absolute -left-20 top-0 h-full w-24 rotate-12 bg-white/12 opacity-0 blur-2xl transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100 " />
              </div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{
                    rotate: 4,
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.25 }}
                  className="brand-icon grid h-11 w-11 place-items-center rounded-xl text-white md:h-12 md:w-12"
                >
                  {service.icon}
                </motion.div>

                <h3 className="cso-service-title mt-3 text-xl font-black leading-tight text-[#12315c] md:mt-4 md:text-xl">
                  {service.title}
                </h3>

                <p className="cso-service-description mt-2 line-clamp-3 text-sm leading-[22px] text-slate-600 md:mt-2 md:text-base md:leading-[22px]">
                  {service.text}
                </p>

                <button
                  type="button"
                  onClick={() => setActiveService(service)}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#05a99d] transition-all duration-300 hover:gap-3 hover:text-[#0b5cab] md:mt-4"
                >
                  {t.services.more}
                  <ArrowRight size={16} />
                </button>

                <div className="mt-3 h-[2px] w-14 rounded-full brand-gradient transition-all duration-500 group-hover:w-24 md:mt-4 md:w-16 md:group-hover:w-28" />
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
              className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm "
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="cso-service-modal fixed left-1/2 top-1/2 z-[100] w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-2xl transition-colors duration-500     md:rounded-[2rem] md:p-7"
            >
              <div className="pointer-events-none absolute inset-0 hidden ">
                <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
              </div>

              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="absolute right-4 top-4 z-[120] grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-[#12315c] transition hover:bg-slate-200    md:right-5 md:top-5"
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

                <h3 className="mt-5 pr-10 text-2xl font-black text-[#12315c]      md:mt-6 md:text-3xl">
                  {activeService.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600  md:text-base md:leading-8">
                  {activeService.details}
                </p>

                <div className="mt-5 rounded-2xl bg-cyan-50 p-4 text-sm font-semibold leading-6 text-[#0b5cab]     md:mt-6">
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
