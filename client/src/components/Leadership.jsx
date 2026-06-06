import { useState } from "react"
import { motion } from "framer-motion"
import {
  BriefcaseBusiness,
  Award,
  ShieldCheck,
} from "lucide-react"

import SectionTitle from "../ui/SectionTitle"
import MediaSlider from "../ui/MediaSlider"
import SkeletonCard from "../ui/SkeletonCard"

import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

function MobileLeadershipDeck({ cards }) {
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
              className={`
                absolute
                left-0
                top-0
                w-full
                origin-top
                text-left
                transition
                "cursor-pointer"
              `}
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
                  imagePosition="object-top"
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

export default function Leadership() {
  const {
    getSection,
    loading,
  } = useSections()

  const { t, language } =
    useLanguage()

  const leadershipSection =
    getSection("leadership")

  const media =
    leadershipSection?.media || {}

  const heading =
    language === "RU"
      ? leadershipSection?.heading ||
        t.leadership.heading
      : t.leadership.heading

  const text =
    language === "RU"
      ? leadershipSection?.text ||
        t.leadership.text
      : t.leadership.text

  const stats = [
    {
      icon: (
        <BriefcaseBusiness size={18} />
      ),

      title:
        t.leadership.stats[0]
          .title,

      text:
        t.leadership.stats[0]
          .text,
    },

    {
      icon: <Award size={18} />,

      title:
        t.leadership.stats[1]
          .title,

      text:
        t.leadership.stats[1]
          .text,
    },

    {
      icon: (
        <ShieldCheck size={18} />
      ),

      title:
        t.leadership.stats[2]
          .title,

      text:
        t.leadership.stats[2]
          .text,
    },
  ]

  const leadership = {
    director: {
      key: "director",

      media:
        media.card_1 || [],

      name:
        language === "RU"
          ? leadershipSection?.card_1_title ||
            t.leadership.cards[0]
              .name
          : t.leadership.cards[0]
              .name,

      text:
        language === "RU"
          ? leadershipSection?.card_1_text ||
            t.leadership.cards[0]
              .text
          : t.leadership.cards[0]
              .text,
    },

    deputy: {
      key: "deputy",

      media:
        media.card_2 || [],

      name:
        language === "RU"
          ? leadershipSection?.card_2_title ||
            t.leadership.cards[1]
              .name
          : t.leadership.cards[1]
              .name,

      text:
        language === "RU"
          ? leadershipSection?.card_2_text ||
            t.leadership.cards[1]
              .text
          : t.leadership.cards[1]
              .text,
    },

    medical: {
      key: "medical",

      media:
        media.card_3 || [],

      name:
        language === "RU"
          ? leadershipSection?.card_3_title ||
            t.leadership.cards[2]
              .name
          : t.leadership.cards[2]
              .name,

      text:
        language === "RU"
          ? leadershipSection?.card_3_text ||
            t.leadership.cards[2]
              .text
          : t.leadership.cards[2]
              .text,
    },

    social: {
      key: "social",

      media:
        media.card_4 || [],

      name:
        language === "RU"
          ? leadershipSection?.card_4_title ||
            t.leadership.cards[3]
              .name
          : t.leadership.cards[3]
              .name,

      text:
        language === "RU"
          ? leadershipSection?.card_4_text ||
            t.leadership.cards[3]
              .text
          : t.leadership.cards[3]
              .text,
    },
  }

  const leadershipCards = [
    leadership.director,
    leadership.deputy,
    leadership.medical,
    leadership.social,
  ]

  return (
    <section
      id="leadership"
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
            badge={
              t.leadership.badge
            }
            title={heading}
            text={text}
          />
        </motion.div>

        <div className="mt-16 grid gap-6 xl:grid-cols-[1.15fr_0.38fr]">
          <div className="grid gap-6">
            {loading ? (
              <>
                <div className="md:hidden">
                  <SkeletonCard height="h-[440px]" />
                </div>

                <div className="hidden gap-6 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
                  <SkeletonCard height="h-[420px]" />

                  <SkeletonCard height="h-[420px]" />
                </div>

                <div className="hidden gap-6 md:grid md:grid-cols-2">
                  <SkeletonCard height="h-[320px]" />

                  <SkeletonCard height="h-[320px]" />
                </div>
              </>
            ) : (
              <>
                <MobileLeadershipDeck cards={leadershipCards} />

                <div className="hidden gap-6 md:grid lg:grid-cols-[1.15fr_0.85fr]">
                  <motion.div
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
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="transition-shadow duration-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
                  >
                    <MediaSlider
                      media={
                        leadership
                          .director
                          .media
                      }
                      title={
                        leadership
                          .director
                          .name
                      }
                      text={
                        leadership
                          .director
                          .text
                      }
                      imagePosition="object-top"
                      className="[&>div]:h-[420px] [&_h3]:text-2xl [&_p]:mt-2 [&_p]:text-sm [&_p]:leading-[1.15] [&_.absolute.bottom-0]:p-5"
                    />
                  </motion.div>

                  <motion.div
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
                      delay: 0.05,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="transition-shadow duration-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
                  >
                    <MediaSlider
                      media={
                        leadership
                          .deputy
                          .media
                      }
                      title={
                        leadership
                          .deputy
                          .name
                      }
                      text={
                        leadership
                          .deputy
                          .text
                      }
                      imagePosition="object-top"
                      className="[&>div]:h-[420px] [&_h3]:text-xl [&_p]:mt-2 [&_p]:text-sm [&_p]:leading-6 [&_.absolute.bottom-0]:p-5"
                    />
                  </motion.div>
                </div>

                <div className="hidden gap-6 md:grid md:grid-cols-2">
                  <motion.div
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
                      delay: 0.08,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                  >
                    <MediaSlider
                      media={
                        leadership
                          .medical
                          .media
                      }
                      title={
                        leadership
                          .medical
                          .name
                      }
                      text={
                        leadership
                          .medical
                          .text
                      }
                      imagePosition="object-top"
                      className="[&>div]:h-[320px] [&_h3]:text-lg [&_p]:mt-1 [&_p]:text-xs [&_p]:leading-5 [&_.absolute.bottom-0]:p-4"
                    />
                  </motion.div>

                  <motion.div
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
                      delay: 0.11,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                  >
                    <MediaSlider
                      media={
                        leadership
                          .social
                          .media
                      }
                      title={
                        leadership
                          .social
                          .name
                      }
                      text={
                        leadership
                          .social
                          .text
                      }
                      imagePosition="object-top"
                      className="[&>div]:h-[320px] [&_h3]:text-lg [&_p]:mt-1 [&_p]:text-xs [&_p]:leading-5 [&_.absolute.bottom-0]:p-4"
                    />
                  </motion.div>
                </div>
              </>
            )}
          </div>

          <div className="grid gap-5">
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
                          index *
                          0.04,
                      }}
                    >
                      <SkeletonCard height="h-[170px]" />
                    </motion.div>
                  )
                )
              : stats.map(
                  (
                    item,
                    index
                  ) => (
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
                      className="glass-card group rounded-[1.5rem] p-5 transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex items-start gap-4">
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

                        <div>
                          <h3 className="text-lg font-black text-[#12315c]">
                            {
                              item.title
                            }
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {
                              item.text
                            }
                          </p>

                          <div className="mt-4 h-[2px] w-10 rounded-full brand-gradient transition-all duration-500 group-hover:w-20" />
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
          </div>
        </div>
      </div>
    </section>
  )
}