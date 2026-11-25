import { motion } from "framer-motion"
import { Accessibility, HeartPulse, ShieldCheck, UsersRound } from "lucide-react"
import SectionTitle from "../ui/SectionTitle"
import MediaSlider from "../ui/MediaSlider"
import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

function getMediaGroup(media, groupKey, fallbackIndex) {
  if (!media) return []
  if (Array.isArray(media)) return media[fallbackIndex] ? [media[fallbackIndex]] : []
  return media[groupKey] || []
}

export default function DisabilityCare() {
  const { getSection } = useSections()
  const { t, language } = useLanguage()
  const disabilitySection = getSection("disability")
  const media = disabilitySection?.media || {}
  const heading = language === "RU" ? disabilitySection?.heading || t.disability.heading : t.disability.heading
  const text = language === "RU" ? disabilitySection?.text || t.disability.text : t.disability.text

  const benefits = [
    { icon: <Accessibility size={20} />, title: t.disability.benefits[0] },
    { icon: <HeartPulse size={20} />, title: t.disability.benefits[1] },
    { icon: <ShieldCheck size={20} />, title: t.disability.benefits[2] },
    { icon: <UsersRound size={20} />, title: t.disability.benefits[3] },
  ]

  const disabilityCards = [0, 1, 2].map((index) => {
    const key = `card_${index + 1}`
    const fallback = t.disability.cards[index]
    return {
      media: getMediaGroup(media, key, index),
      title: language === "RU" ? disabilitySection?.[`${key}_title`] || fallback.title : fallback.title,
      text: language === "RU" ? disabilitySection?.[`${key}_text`] || fallback.text : fallback.text,
    }
  })

  return (
    <section className="relative overflow-hidden bg-white/55 py-24 md:py-32">
      <div className="pointer-events-none absolute left-0 top-14 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl md:top-20 md:h-72 md:w-72" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl md:h-80 md:w-80" />
      <div className="relative mx-auto max-w-7xl px-[10px] sm:px-6">
        <SectionTitle badge={t.disability.badge} title={heading} text={text} />
        <div className="mt-11 grid gap-5 lg:mt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <motion.div initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, ease: "easeOut" }} whileHover={{ y: -3 }}>
            <MediaSlider media={disabilityCards[0].media} title={disabilityCards[0].title} text={disabilityCards[0].text} enableImageModal={true} className="[&>div]:h-[320px] md:[&>div]:h-[560px]" />
          </motion.div>
          <div className="grid gap-5 md:gap-6">
            {disabilityCards.slice(1).map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, x: 35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08, duration: 0.45, ease: "easeOut" }} whileHover={{ y: -3 }}>
                <MediaSlider media={item.media} title={item.title} text={item.text} enableImageModal={true} className="[&>div]:h-[240px] md:[&>div]:h-[267px]" />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {benefits.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -3 }}
              className="brand-gradient flex min-h-[66px] items-center gap-2.5 rounded-[1.2rem] px-3 py-2.5 text-white shadow-[0_12px_30px_rgba(5,169,157,0.12)] sm:min-h-[70px]"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/15 text-white">
                {item.icon}
              </div>
              <h3 className="min-w-0 text-[13px] font-extrabold leading-[1.3] text-white sm:text-sm">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
