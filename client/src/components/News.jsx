import { motion } from "framer-motion"
import {
  CalendarDays,
  Newspaper,
  Video,
  ImagePlus,
} from "lucide-react"

import SectionTitle from "../ui/SectionTitle"
import MediaSlider from "../ui/MediaSlider"
import SkeletonCard from "../ui/SkeletonCard"

import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

function getMediaGroup(
  media,
  groupKey,
  fallbackIndex
) {
  if (!media) return []

  if (Array.isArray(media)) {
    return media[fallbackIndex]
      ? [media[fallbackIndex]]
      : []
  }

  return media[groupKey] || []
}

export default function News() {
  const { getSection, loading } =
    useSections()

  const { t, language } =
    useLanguage()

  const newsSection =
    getSection("news")

  const media =
    newsSection?.media || {}

  const heading =
    language === "RU"
      ? newsSection?.heading ||
        t.news.heading
      : t.news.heading

  const text =
    language === "RU"
      ? newsSection?.text ||
        t.news.text
      : t.news.text

  const newsFeatures = [
    {
      icon: (
        <Newspaper size={20} />
      ),

      title:
        t.news.features[0],
    },

    {
      icon: (
        <ImagePlus size={20} />
      ),

      title:
        t.news.features[1],
    },

    {
      icon: (
        <Video size={20} />
      ),

      title:
        t.news.features[2],
    },
  ]

  const news = [
    {
      title:
        language === "RU"
          ? newsSection?.card_1_title ||
            t.news.cards[0]
              .title
          : t.news.cards[0]
              .title,

      text:
        language === "RU"
          ? newsSection?.card_1_text ||
            t.news.cards[0]
              .text
          : t.news.cards[0]
              .text,

      date: "2026",

      media: getMediaGroup(
        media,
        "card_1",
        0
      ),
    },

    {
      title:
        language === "RU"
          ? newsSection?.card_2_title ||
            t.news.cards[1]
              .title
          : t.news.cards[1]
              .title,

      text:
        language === "RU"
          ? newsSection?.card_2_text ||
            t.news.cards[1]
              .text
          : t.news.cards[1]
              .text,

      date: "2026",

      media: getMediaGroup(
        media,
        "card_2",
        1
      ),
    },

    {
      title:
        language === "RU"
          ? newsSection?.card_3_title ||
            t.news.cards[2]
              .title
          : t.news.cards[2]
              .title,

      text:
        language === "RU"
          ? newsSection?.card_3_text ||
            t.news.cards[2]
              .text
          : t.news.cards[2]
              .text,

      date: "2026",

      media: getMediaGroup(
        media,
        "card_3",
        2
      ),
    },

    {
      title:
        language === "RU"
          ? newsSection?.card_4_title ||
            t.news.cards[3]
              .title
          : t.news.cards[3]
              .title,

      text:
        language === "RU"
          ? newsSection?.card_4_text ||
            t.news.cards[3]
              .text
          : t.news.cards[3]
              .text,

      date: "2026",

      media: getMediaGroup(
        media,
        "card_4",
        3
      ),
    },
  ]

  return (
    <section
      id="news"
      className="relative overflow-hidden bg-white/55 py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
        >
          <SectionTitle
            badge={t.news.badge}
            title={heading}
            text={text}
          />
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({
                length: 4,
              }).map(
                (_, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                  >
                    <SkeletonCard height="h-[390px]" />

                    <div className="mt-4 h-4 w-20 rounded-full bg-slate-200 dark:bg-[#16324d]" />

                    <div className="mt-3 h-[2px] w-10 rounded-full bg-slate-200 dark:bg-[#16324d]" />
                  </motion.div>
                )
              )
            : news.map(
                (
                  item,
                  index
                ) => (
                  <motion.article
                    key={`${item.title}-${index}`}
                    initial={{
                      opacity: 0,
                      y: 22,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.18,
                    }}
                    transition={{
                      duration: 0.42,
                      delay:
                        index *
                        0.05,

                      ease:
                        "easeOut",
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="group transition-shadow duration-300 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)]"
                  >
                    <MediaSlider
                      media={
                        item.media
                      }
                      title={
                        item.title
                      }
                      text={item.text}
                      enableImageModal={true}
                      className="[&>div]:h-[390px] [&_h3]:text-xl [&_p]:text-sm [&_p]:leading-6"
                    />

                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-[#0b5cab] transition-colors duration-300 group-hover:text-[#05a99d]">
                      <CalendarDays
                        size={16}
                      />

                      {item.date}
                    </div>

                    <div className="mt-3 h-[2px] w-10 rounded-full brand-gradient transition-all duration-500 group-hover:w-20" />
                  </motion.article>
                )
              )}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {newsFeatures.map(
            (item, index) => (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.18,
                }}
                transition={{
                  duration: 0.4,
                  delay:
                    index * 0.04,

                  ease: "easeOut",
                }}
                whileHover={{
                  y: -4,
                  scale: 1.006,
                }}
                className="glass-card group flex items-center gap-4 rounded-[1.5rem] p-5 transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <motion.div
                  whileHover={{
                    scale: 1.04,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="brand-icon grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
                >
                  {item.icon}
                </motion.div>

                <h3 className="font-black text-[#12315c]">
                  {item.title}
                </h3>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  )
}