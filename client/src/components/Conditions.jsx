import { motion } from "framer-motion"
import { Home, Soup, Bath, Sparkles, ShieldCheck, HeartPulse } from "lucide-react"
import SectionTitle from "../ui/SectionTitle"
import MediaSlider from "../ui/MediaSlider"
import SkeletonCard from "../ui/SkeletonCard"
import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

function getMediaGroup(media, groupKey, fallbackIndex) {
  if (!media) return []
  if (Array.isArray(media)) return media[fallbackIndex] ? [media[fallbackIndex]] : []
  return media[groupKey] || []
}

export default function Conditions() {
  const { getSection, loading } = useSections()
  const { t, language } = useLanguage()
  const conditionsSection = getSection("conditions")
  const media = conditionsSection?.media || {}
  const heading = language === "RU" ? conditionsSection?.heading || t.conditions.heading : t.conditions.heading
  const text = language === "RU" ? conditionsSection?.text || t.conditions.text : t.conditions.text
  const iconClasses = "h-5 w-5"
  const conditions = [
    { title: t.conditions.items[0], icon: <Home className={iconClasses} /> },
    { title: t.conditions.items[1], icon: <Soup className={iconClasses} /> },
    { title: t.conditions.items[2], icon: <Bath className={iconClasses} /> },
    { title: t.conditions.items[3], icon: <Sparkles className={iconClasses} /> },
    { title: t.conditions.items[4], icon: <ShieldCheck className={iconClasses} /> },
    { title: t.conditions.items[5], icon: <HeartPulse className={iconClasses} /> },
  ]
  const conditionMedia = [0, 1, 2].map((index) => ({
    media: getMediaGroup(media, `card_${index + 1}`, index),
    title: language === "RU" ? conditionsSection?.[`card_${index + 1}_title`] || t.conditions.cards[index].title : t.conditions.cards[index].title,
    text: language === "RU" ? conditionsSection?.[`card_${index + 1}_text`] || t.conditions.cards[index].text : t.conditions.cards[index].text,
  }))
  return (
    <section id="conditions" className="relative overflow-hidden py-16 md:py-32">
      <style>{`@media (max-width: 639px) { #conditions .conditions-content { padding-left: 10px !important; padding-right: 10px !important; } }`}</style>
      <div className="absolute inset-0 bg-white/55 transition-colors duration-500" />
      <div className="pointer-events-none absolute left-0 top-0 hidden h-80 w-80 rounded-full bg-cyan-400/0 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 hidden h-96 w-96 rounded-full bg-blue-500/0 blur-3xl" />
      <div className="conditions-content relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-8 md:gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, ease: "easeOut" }}>
            <SectionTitle badge={t.conditions.badge} title={heading} text={text} />
          </motion.div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {conditions.map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.35, delay: index * 0.04 }} whileHover={{ y: -3 }} className="brand-gradient flex min-h-[84px] min-w-0 flex-col items-center justify-center gap-1 rounded-[1.2rem] px-2 py-2 text-center text-white shadow-[0_10px_25px_rgba(5,169,157,0.12)] sm:h-[76px] sm:min-h-[76px] sm:flex-row sm:justify-start sm:gap-2 sm:px-2.5 sm:text-left">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/15 sm:h-9 sm:w-9">{item.icon}</div>
                <h3 className="w-full min-w-0 break-words text-[12px] font-semibold leading-[16px] text-white sm:w-auto sm:flex-1 sm:text-[13px] sm:font-black sm:leading-[19px]">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {loading ? Array.from({ length: 3 }).map((_, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
              <SkeletonCard height="h-[288px]" />
            </motion.div>
          )) : conditionMedia.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }} whileHover={{ y: -5, scale: 1.006 }} className="transition-shadow duration-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.10)]">
              <MediaSlider media={item.media} title={item.title} text={item.text} enableImageModal={true} className="[&>div]:h-[288px] [&_h3]:text-2xl [&_p]:mt-3 [&_p]:leading-7 [&_.absolute.bottom-0]:p-7" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}



