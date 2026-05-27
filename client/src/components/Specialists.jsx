import { motion } from "framer-motion"
import {
  Stethoscope,
  HeartPulse,
  UserRoundCheck,
  Activity,
} from "lucide-react"

import SectionTitle from "../ui/SectionTitle"
import MediaSlider from "../ui/MediaSlider"
import SkeletonCard from "../ui/SkeletonCard"

import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

export default function Specialists() {
  const { getSection, loading } =
    useSections()

  const { t, language } =
    useLanguage()

  const specialistsSection =
    getSection("specialists")

  const media =
    specialistsSection?.media || {}

  const heading =
    language === "RU"
      ? specialistsSection?.heading ||
        t.specialists.heading
      : t.specialists.heading

  const text =
    language === "RU"
      ? specialistsSection?.text ||
        t.specialists.text
      : t.specialists.text

  const directions = [
    {
      icon: (
        <Stethoscope size={20} />
      ),

      title:
        t.specialists
          .directions[0],
    },

    {
      icon: (
        <HeartPulse size={20} />
      ),

      title:
        t.specialists
          .directions[1],
    },

    {
      icon: (
        <UserRoundCheck size={20} />
      ),

      title:
        t.specialists
          .directions[2],
    },

    {
      icon: (
        <Activity size={20} />
      ),

      title:
        t.specialists
          .directions[3],
    },
  ]

  const specialists = [
    {
      media:
        media.card_1 || [],

      name:
        language === "RU"
          ? specialistsSection?.card_1_title ||
            t.specialists.cards[0]
              .name
          : t.specialists.cards[0]
              .name,

      text:
        language === "RU"
          ? specialistsSection?.card_1_text ||
            t.specialists.cards[0]
              .text
          : t.specialists.cards[0]
              .text,
    },

    {
      media:
        media.card_2 || [],

      name:
        language === "RU"
          ? specialistsSection?.card_2_title ||
            t.specialists.cards[1]
              .name
          : t.specialists.cards[1]
              .name,

      text:
        language === "RU"
          ? specialistsSection?.card_2_text ||
            t.specialists.cards[1]
              .text
          : t.specialists.cards[1]
              .text,
    },

    {
      media:
        media.card_3 || [],

      name:
        language === "RU"
          ? specialistsSection?.card_3_title ||
            t.specialists.cards[2]
              .name
          : t.specialists.cards[2]
              .name,

      text:
        language === "RU"
          ? specialistsSection?.card_3_text ||
            t.specialists.cards[2]
              .text
          : t.specialists.cards[2]
              .text,
    },

    {
      media:
        media.card_4 || [],

      name:
        language === "RU"
          ? specialistsSection?.card_4_title ||
            t.specialists.cards[3]
              .name
          : t.specialists.cards[3]
              .name,

      text:
        language === "RU"
          ? specialistsSection?.card_4_text ||
            t.specialists.cards[3]
              .text
          : t.specialists.cards[3]
              .text,
    },
  ]

  return (
    <section
      id="specialists"
      className="relative overflow-hidden py-32"
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
            badge={
              t.specialists.badge
            }
            title={heading}
            text={text}
          />
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
                    <SkeletonCard height="h-[360px]" />
                  </motion.div>
                )
              )
            : specialists.map(
                (
                  person,
                  index
                ) => (
                  <motion.div
                    key={`${person.name}-${index}`}
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
                    className="transition-shadow duration-300 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)]"
                  >
                    <MediaSlider
                      media={
                        person.media
                      }
                      title={
                        person.name
                      }
                      text={
                        person.text
                      }
                      className="[&>div]:h-[360px] [&_h3]:text-xl [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-5 [&_.absolute.bottom-0]:p-5"
                    />
                  </motion.div>
                )
              )}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {directions.map(
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