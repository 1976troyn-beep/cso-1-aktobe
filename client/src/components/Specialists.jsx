import { useState } from "react"
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


function MobileSpecialistsDeck({ cards }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const orderedCards = [
    ...cards.slice(activeIndex),
    ...cards.slice(0, activeIndex),
  ]

  function getRealIndex(card) {
    return cards.findIndex((item) => item.key === card.key)
  }

  return (
    <div className="mt-8 md:hidden">
      <div className="relative mx-auto h-[500px] max-w-[320px]">
        {orderedCards.map((person, index) => {
          const isActive = index === 0
          const realIndex = getRealIndex(person)

          const y = index * 52
          const scale = 1 - index * 0.06
          const rotate =
            index === 0
              ? 0
              : index % 2 === 0
              ? 2.4
              : -2.4

          return (
            <motion.button
              key={person.key}
              type="button"
              onClick={() => {
                if (isActive) {
                  setActiveIndex((current) => (current + 1) % cards.length)
                } else {
                  setActiveIndex(realIndex)
                }
              }}
              initial={false}
              animate={{
                y,
                scale,
                rotate,
                zIndex: 40 - index,
              }}
              whileTap={{
                y: isActive ? y - 10 : y - 8,
                scale: isActive ? 1.035 : scale + 0.055,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 22,
                mass: 0.72,
              }}
              className="
                absolute
                left-0
                top-0
                w-full
                origin-top
                cursor-pointer
                text-left
                transition
              "
            >
              <div
                className={`
                  rounded-[1.35rem]
                  shadow-[0_22px_60px_rgba(15,23,42,0.16)]
                  transition
                  ${
                    isActive
                      ? "opacity-100"
                      : "opacity-95 brightness-[0.92]"
                  }
                `}
              >
                <MediaSlider
                  media={person.media}
                  title={person.name}
                  text={person.text}
                  className={`
                    [&>div]:h-[430px]
                    [&_h3]:text-[1.05rem]
                    [&_p]:mt-1.5
                    [&_p]:line-clamp-2
                    [&_p]:text-xs
                    [&_p]:leading-5
                    [&_.absolute.bottom-0]:p-4
                    ${
                      isActive
                        ? ""
                        : "[&>div]:h-[118px] [&_p]:hidden [&_.absolute.bottom-0]:p-3"
                    }
                  `}
                />
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {cards.map((person, index) => (
          <button
            key={person.key}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-8 bg-[#05a99d]"
                : "w-2 bg-slate-300 dark:bg-white/25"
            }`}
            aria-label={person.name}
          />
        ))}
      </div>
    </div>
  )
}

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
      key: "specialist-1",

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
      key: "specialist-2",

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
      key: "specialist-3",

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
      key: "specialist-4",

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

        {loading ? (
          <>
            <div className="mt-16 md:hidden">
              <SkeletonCard height="h-[440px]" />
            </div>

            <div className="mt-16 hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
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
                    delay: index * 0.04,
                  }}
                >
                  <SkeletonCard height="h-[360px]" />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            <MobileSpecialistsDeck cards={specialists} />

            <div className="mt-16 hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
              {specialists.map((person, index) => (
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
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  className="transition-shadow duration-300 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)]"
                >
                  <MediaSlider
                    media={person.media}
                    title={person.name}
                    text={person.text}
                    className="[&>div]:h-[360px] [&_h3]:text-xl [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-5 [&_.absolute.bottom-0]:p-5"
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}

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