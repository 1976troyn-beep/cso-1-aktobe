import { motion } from "framer-motion"
import {
  ShieldCheck,
  HeartHandshake,
  Coffee,
  BedDouble,
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

export default function Rooms() {
  const {
    getSection,
    loading,
  } = useSections()

  const { t, language } =
    useLanguage()

  const rooms =
    getSection("rooms")

  const media =
    rooms?.media || {}

  const heading =
    language === "RU"
      ? rooms?.heading ||
        t.rooms.heading
      : t.rooms.heading

  const text =
    language === "RU"
      ? rooms?.text ||
        t.rooms.text
      : t.rooms.text

  const roomBenefits = [
    {
      icon: (
        <ShieldCheck size={20} />
      ),

      title:
        t.rooms.benefits[0]
          .title,

      text:
        t.rooms.benefits[0]
          .text,
    },

    {
      icon: (
        <HeartHandshake size={20} />
      ),

      title:
        t.rooms.benefits[1]
          .title,

      text:
        t.rooms.benefits[1]
          .text,
    },

    {
      icon: (
        <Coffee size={20} />
      ),

      title:
        t.rooms.benefits[2]
          .title,

      text:
        t.rooms.benefits[2]
          .text,
    },
  ]

  const roomMedia = [
    {
      media: getMediaGroup(
        media,
        "card_1",
        0
      ),

      title:
        language === "RU"
          ? rooms?.card_1_title ||
            t.rooms.cards[0]
              .title
          : t.rooms.cards[0]
              .title,

      text:
        language === "RU"
          ? rooms?.card_1_text ||
            t.rooms.cards[0]
              .text
          : t.rooms.cards[0]
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
          ? rooms?.card_2_title ||
            t.rooms.cards[1]
              .title
          : t.rooms.cards[1]
              .title,

      text:
        language === "RU"
          ? rooms?.card_2_text ||
            t.rooms.cards[1]
              .text
          : t.rooms.cards[1]
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
          ? rooms?.card_3_title ||
            t.rooms.cards[2]
              .title
          : t.rooms.cards[2]
              .title,

      text:
        language === "RU"
          ? rooms?.card_3_text ||
            t.rooms.cards[2]
              .text
          : t.rooms.cards[2]
              .text,
    },
  ]

  return (
    <section
      id="rooms"
      className="relative overflow-hidden py-32"
    >
      <div className="mx-auto max-w-7xl px-[10px] sm:px-6">
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
            badge={t.rooms.badge}
            title={heading}
            text={text}
          />
        </motion.div>

        {loading ? (
          <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <SkeletonCard height="h-[560px]" />
            </motion.div>

            <div className="grid gap-6">
              {Array.from({
                length: 2,
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
                    <SkeletonCard height="h-[267px]" />
                  </motion.div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{
                opacity: 0,
                x: -24,
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
                  roomMedia[0]
                    .media
                }
                title={
                  roomMedia[0]
                    .title
                }
                text={
                  roomMedia[0]
                    .text
                }
                enableImageModal={true}
                className="[&>div]:h-[560px]"
              />
            </motion.div>

            <div className="grid gap-6">
              {roomMedia
                .slice(1)
                .map(
                  (
                    item,
                    index
                  ) => (
                    <motion.div
                      key={
                        item.title
                      }
                      initial={{
                        opacity: 0,
                        x: 24,
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
                          0.05,

                        ease:
                          "easeOut",
                      }}
                      whileHover={{
                        y: -4,
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
                        enableImageModal={true}
                        className="[&>div]:h-[267px]"
                      />
                    </motion.div>
                  )
                )}
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {roomBenefits.map(
            (card, index) => (
              <motion.div
                key={card.title}
                initial={{
                  opacity: 0,
                  y: 20,
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
                    index * 0.04,

                  ease: "easeOut",
                }}
                whileHover={{
                  y: -4,
                  scale: 1.006,
                }}
                className="brand-gradient group rounded-[1.4rem] p-4 text-white shadow-[0_12px_32px_rgba(5,169,157,0.12)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(5,169,157,0.20)]"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    whileHover={{
                      scale: 1.04,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 text-white"
                  >
                    {card.icon}
                  </motion.div>

                  <div>
                    <h3 className="text-base font-black leading-5 text-white">
                      {card.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-5 text-white/85">
                      {card.text}
                    </p>

                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>

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
          whileHover={{
            y: -3,
            scale: 1.005,
          }}
          className="brand-gradient mt-4 flex items-center gap-3 rounded-[1.4rem] p-4 text-white shadow-[0_16px_45px_rgba(5,169,157,0.14)]"
        >
          <motion.div
            whileHover={{
              rotate: -2,
              scale: 1.03,
            }}
            transition={{
              duration: 0.25,
            }}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur"
          >
            <BedDouble size={24} />
          </motion.div>

          <div className="min-w-0 text-sm leading-6 text-white md:whitespace-nowrap md:text-base">
            <span className="font-black">24/7 — </span>
            <span className="font-medium">{t.rooms.bottomText}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}