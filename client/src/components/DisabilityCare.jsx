import { motion } from "framer-motion"
import {
  Accessibility,
  HeartPulse,
  ShieldCheck,
  UsersRound,
} from "lucide-react"

import SectionTitle from "../ui/SectionTitle"
import MediaSlider from "../ui/MediaSlider"
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

export default function DisabilityCare() {
  const { getSection } =
    useSections()

  const { t, language } =
    useLanguage()

  const disabilitySection =
    getSection("disability")

  const media =
    disabilitySection?.media || {}

  const heading =
    language === "RU"
      ? disabilitySection?.heading ||
        t.disability.heading
      : t.disability.heading

  const text =
    language === "RU"
      ? disabilitySection?.text ||
        t.disability.text
      : t.disability.text

  const benefits = [
    {
      icon: (
        <Accessibility size={22} />
      ),
      title:
        t.disability.benefits[0],
    },

    {
      icon: (
        <HeartPulse size={22} />
      ),
      title:
        t.disability.benefits[1],
    },

    {
      icon: (
        <ShieldCheck size={22} />
      ),
      title:
        t.disability.benefits[2],
    },

    {
      icon: (
        <UsersRound size={22} />
      ),
      title:
        t.disability.benefits[3],
    },
  ]

  const disabilityCards = [
    {
      media: getMediaGroup(
        media,
        "card_1",
        0
      ),

      title:
        language === "RU"
          ? disabilitySection?.card_1_title ||
            t.disability.cards[0]
              .title
          : t.disability.cards[0]
              .title,

      text:
        language === "RU"
          ? disabilitySection?.card_1_text ||
            t.disability.cards[0]
              .text
          : t.disability.cards[0]
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
          ? disabilitySection?.card_2_title ||
            t.disability.cards[1]
              .title
          : t.disability.cards[1]
              .title,

      text:
        language === "RU"
          ? disabilitySection?.card_2_text ||
            t.disability.cards[1]
              .text
          : t.disability.cards[1]
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
          ? disabilitySection?.card_3_title ||
            t.disability.cards[2]
              .title
          : t.disability.cards[2]
              .title,

      text:
        language === "RU"
          ? disabilitySection?.card_3_text ||
            t.disability.cards[2]
              .text
          : t.disability.cards[2]
              .text,
    },
  ]

  return (
    <section className="relative overflow-hidden bg-white/55 py-24 dark:bg-transparent md:py-32">
      {/* AMBIENT BACKGROUND */}

      <div className="pointer-events-none absolute left-0 top-14 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/6 md:top-20 md:h-72 md:w-72" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/8 md:h-80 md:w-80" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle
          badge={
            t.disability.badge
          }
          title={heading}
          text={text}
        />

        {/* MAIN GRID */}

        <div className="mt-11 grid gap-5 lg:mt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          {/* LARGE CARD */}

          <motion.div
            initial={{
              opacity: 0,
              x: -35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            whileHover={{
              y: -3,
            }}
          >
            <MediaSlider
              media={
                disabilityCards[0]
                  .media
              }
              title={
                disabilityCards[0]
                  .title
              }
              text={
                disabilityCards[0]
                  .text
              }
              className="[&>div]:h-[320px] md:[&>div]:h-[560px]"
            />
          </motion.div>

          {/* SIDE CARDS */}

          <div className="grid gap-5 md:gap-6">
            {disabilityCards
              .slice(1)
              .map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    x: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    delay:
                      index * 0.08,
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -3,
                  }}
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
                    className="[&>div]:h-[240px] md:[&>div]:h-[267px]"
                  />
                </motion.div>
              ))}
          </div>
        </div>

        {/* BENEFITS */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-5">
          {benefits.map(
            (item, index) => (
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
                  amount: 0.25,
                }}
                transition={{
                  delay:
                    index * 0.06,
                  duration: 0.42,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -6,
                  scale: 1.015,
                }}
                className="glass-card group relative overflow-hidden rounded-[1.4rem] p-4 md:rounded-[1.6rem] md:p-5"
              >
                {/* GLOW */}

                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
                </div>

                {/* LIGHT SWEEP */}

                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.4rem] md:rounded-[1.6rem]">
                  <div className="absolute -left-20 top-0 h-full w-20 rotate-12 bg-white/10 opacity-0 blur-2xl transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100 dark:bg-cyan-300/10" />
                </div>

                <div className="relative z-10 flex items-center gap-3 md:gap-4">
                  <motion.div
                    whileHover={{
                      rotate: 5,
                      scale: 1.06,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="brand-icon grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white md:h-12 md:w-12"
                  >
                    {item.icon}
                  </motion.div>

                  <h3 className="text-sm font-black text-[#12315c] dark:text-white md:text-base">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-4 h-[2px] w-10 rounded-full brand-gradient transition-all duration-500 group-hover:w-16 md:mt-5 md:w-12 md:group-hover:w-20" />
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  )
}