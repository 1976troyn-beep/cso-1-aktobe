
import { motion } from "framer-motion"
import { CalendarDays, Newspaper, Video, ImagePlus } from "lucide-react"
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

const MONTHS = {
  RU: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  KZ: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"],
  EN: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
}

function formatPublicationDate(value, language) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null

  const lang = MONTHS[language] ? language : "RU"
  const monthName = MONTHS[lang][month - 1]

  if (lang === "KZ") return `${day} ${monthName} ${year} ж.`
  if (lang === "EN") return `${day} ${monthName} ${year}`
  return `${day} ${monthName} ${year} г.`
}

export default function News() {
  const { getSection, loading } = useSections()
  const { t, language } = useLanguage()
  const newsSection = getSection("news")
  const media = newsSection?.media || {}
  const heading = language === "RU" ? newsSection?.heading || t.news.heading : t.news.heading
  const text = language === "RU" ? newsSection?.text || t.news.text : t.news.text

  const newsFeatures = [
    { icon: <Newspaper size={19} />, title: t.news.features[0] },
    { icon: <ImagePlus size={19} />, title: t.news.features[1] },
    { icon: <Video size={19} />, title: t.news.features[2] },
  ]

  const news = Array.from({ length: 4 }, (_, index) => {
    const num = index + 1
    return {
      title: language === "RU"
        ? newsSection?.[`card_${num}_title`] || t.news.cards[index].title
        : t.news.cards[index].title,
      text: language === "RU"
        ? newsSection?.[`card_${num}_text`] || t.news.cards[index].text
        : t.news.cards[index].text,
      date: formatPublicationDate(media?.news_dates?.[`card_${num}`], language),
      media: getMediaGroup(media, `card_${num}`, index),
    }
  })

  return (
    <section id="news" className="relative overflow-hidden bg-white/55 py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <SectionTitle badge={t.news.badge} title={heading} text={text} />
        </motion.div>

        <div className="mt-8 grid gap-3 sm:gap-6 md:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <SkeletonCard height="h-[310px] sm:h-[390px]" />
                  <div className="mt-4 h-4 w-20 rounded-full bg-slate-200" />
                  <div className="mt-3 h-[2px] w-10 rounded-full bg-slate-200" />
                </motion.div>
              ))
            : news.map((item, index) => (
                <motion.article
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.42, delay: index * 0.05, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  className="group transition-shadow duration-300 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)]"
                >
                  <MediaSlider
                    media={item.media}
                    title={item.title}
                    text={item.text}
                    enableImageModal={true}
                    className="[&>div]:h-[310px] sm:[&>div]:h-[390px] [&_h3]:text-xl [&_p]:text-sm [&_p]:leading-6"
                  />
                  {item.date && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-[#0b5cab] transition-colors duration-300 group-hover:text-[#05a99d]">
                      <CalendarDays size={16} />
                      {item.date}
                    </div>
                  )}
                  <div className="mt-3 h-[2px] w-10 rounded-full brand-gradient transition-all duration-500 group-hover:w-20" />
                </motion.article>
              ))}
        </div>

        <div className="mt-4 grid gap-2.5 md:mt-6 md:grid-cols-3">
          {newsFeatures.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              whileHover={{ y: -3, scale: 1.006 }}
              className="brand-gradient group flex min-h-[68px] items-center gap-3 rounded-[1.25rem] px-4 py-3 text-white shadow-[0_12px_30px_rgba(5,169,157,0.12)]"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.25 }}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/15"
              >
                {item.icon}
              </motion.div>
              <h3 className="min-w-0 text-[13px] font-semibold leading-[18px] text-white sm:text-sm md:text-base">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}



