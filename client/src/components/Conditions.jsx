import { motion } from "framer-motion"
import {
  Home,
  Soup,
  Bath,
  Sparkles,
  ShieldCheck,
  HeartPulse,
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

export default function Conditions() {
  const {
    getSection,
    loading,
  } = useSections()

  const { t, language } =
    useLanguage()

  const conditionsSection =
    getSection("conditions")

  const media =
    conditionsSection?.media || {}

  const heading =
    language === "RU"
      ? conditionsSection?.heading ||
        t.conditions.heading
      : t.conditions.heading

  const text =
    language === "RU"
      ? conditionsSection?.text ||
        t.conditions.text
      : t.conditions.text

  const conditions = [
    {
      title:
        t.conditions.items[0],

      icon: <Home size={24} />,
    },

    {
      title:
        t.conditions.items[1],

      icon: <Soup size={24} />,
    },

    {
      title:
        t.conditions.items[2],

      icon: <Bath size={24} />,
    },

    {
      title:
        t.conditions.items[3],

      icon: (
        <Sparkles size={24} />
      ),
    },

    {
      title:
        t.conditions.items[4],

      icon: (
        <ShieldCheck size={24} />
      ),
    },

    {
      title:
        t.conditions.items[5],

      icon: (
        <HeartPulse size={24} />
      ),
    },
  ]

  const conditionMedia = [
    {
      media: getMediaGroup(
        media,
        "card_1",
        0
      ),

      title:
        language === "RU"
          ? conditionsSection?.card_1_title ||
            t.conditions.cards[0]
              .title
          : t.conditions.cards[0]
              .title,

      text:
        language === "RU"
          ? conditionsSection?.card_1_text ||
            t.conditions.cards[0]
              .text
          : t.conditions.cards[0]
              .text,
    },

    {
      media: getMediaGroup(
        media,
        "card_2",
        1
      ),

      title:
        language === "RU"
          ? conditionsSection?.card_2_title ||
            t.conditions.cards[1]
              .title
          : t.conditions.cards[1]
              .title,

      text:
        language === "RU"
          ? conditionsSection?.card_2_text ||
            t.conditions.cards[1]
              .text
          : t.conditions.cards[1]
              .text,
    },

    {
      media: getMediaGroup(
        media,
        "card_3",
        2
      ),

      title:
        language === "RU"
          ? conditionsSection?.card_3_title ||
            t.conditions.cards[2]
              .title
          : t.conditions.cards[2]
              .title,

      text:
        language === "RU"
          ? conditionsSection?.card_3_text ||
            t.conditions.cards[2]
              .text
          : t.conditions.cards[2]
              .text,
    },
  ]

  return (
    <section id="conditions"className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-white/55 transition-colors duration-500 dark:bg-transparent" />

      <div className="pointer-events-none absolute left-0 top-0 hidden h-80 w-80 rounded-full bg-cyan-400/0 blur-3xl dark:block dark:bg-cyan-400/6" />

      <div className="pointer-events-none absolute bottom-0 right-0 hidden h-96 w-96 rounded-full bg-blue-500/0 blur-3xl dark:block dark:bg-blue-500/8" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
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
              badge={
                t.conditions.badge
              }
              title={heading}
              text={text}
            />
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {conditions.map(
              (item, index) => (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    x: 22,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.18,
                  }}
                  transition={{
                    duration: 0.42,
                    delay:
                      index *
                      0.04,

                    ease:
                      "easeOut",
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.006,
                  }}
                  className="glass-card group flex items-center gap-5 rounded-[1.5rem] p-5 transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.04,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="brand-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white"
                  >
                    {item.icon}
                  </motion.div>

                  <h3 className="text-lg font-black text-[#12315c] dark:bg-gradient-to-r dark:from-[#58b4ff] dark:to-[#3ce6d8] dark:bg-clip-text dark:text-transparent">
                    {item.title}
                  </h3>
                </motion.div>
              )
            )}
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {loading
            ? Array.from({
                length: 3,
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
                    <SkeletonCard height="h-[288px]" />
                  </motion.div>
                )
              )
            : conditionMedia.map(
                (
                  item,
                  index
                ) => (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 24,
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
                      duration: 0.45,
                      delay:
                        index *
                        0.05,

                      ease:
                        "easeOut",
                    }}
                    whileHover={{
                      y: -5,
                      scale: 1.006,
                    }}
                    className="transition-shadow duration-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
                  >
                    <MediaSlider
                      media={
                        item.media
                      }
                      title={
                        item.title
                      }
                      text={
                        item.text
                      }
                      className="[&>div]:h-[288px] [&_h3]:text-2xl [&_p]:mt-3 [&_p]:leading-7 [&_.absolute.bottom-0]:p-7"
                    />
                  </motion.div>
                )
              )}
        </div>
      </div>
    </section>
  )
}