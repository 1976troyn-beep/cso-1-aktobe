import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  CalendarDays,
  Check,
  HeartPulse,
  ShieldCheck,
  HeartHandshake,
  Accessibility,
} from "lucide-react"

import StatCard from "../ui/StatCard"
import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

const EMPTY_MEDIA = []

export default function HeroSection() {
  const { getSection } = useSections()
  const { t, language } = useLanguage()

  const [heroLoaded, setHeroLoaded] = useState(false)

  const hero = getSection("hero")

  const heading =
    language === "RU"
      ? hero?.heading || t.hero.heading
      : t.hero.heading

  const text =
    language === "RU"
      ? hero?.text || t.hero.text
      : t.hero.text

  const cardTitle =
    language === "RU"
      ? hero?.card_title || t.hero.cardTitle
      : t.hero.cardTitle

  const cardText =
    language === "RU"
      ? hero?.card_text || t.hero.cardText
      : t.hero.cardText

  const heroMedia = hero?.media || EMPTY_MEDIA

  const backgroundMedia = useMemo(() => {
    return (
      heroMedia[0] || {
        src: "/hero-bg.jpg",
        type: "image",
      }
    )
  }, [heroMedia])

  const cardImage = heroMedia[1]?.src || "/care-card.jpg"

  useEffect(() => {
    if (backgroundMedia?.type !== "image") {
      return
    }

    let mounted = true

    const image = new Image()
    image.src = backgroundMedia.src

    image.onload = () => {
      requestAnimationFrame(() => {
        if (mounted) {
          setHeroLoaded(true)
        }
      })
    }

    return () => {
      mounted = false
    }
  }, [backgroundMedia])

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden pt-24 md:pt-32"
    >
      {backgroundMedia?.type === "video" ? (
        <motion.video
          initial={{
            opacity: 0,
            scale: 1.03,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          ref={(video) => {
            if (video) {
              video.playbackRate = 0.72
            }
          }}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={backgroundMedia.src} type="video/mp4" />
        </motion.video>
      ) : (
        <>
          <div className="absolute inset-0 bg-[#dfeeed] dark:bg-[#071827]" />

          <motion.div
            initial={{
              opacity: 0,
              scale: 1.04,
              filter: "blur(18px)",
            }}
            animate={{
              opacity: heroLoaded ? 1 : 0,
              scale: heroLoaded ? 1 : 1.04,
              filter: heroLoaded ? "blur(0px)" : "blur(18px)",
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundMedia.src})`,
            }}
          />
        </>
      )}

      <div className="absolute inset-0 bg-white/28 transition-all duration-500 dark:bg-[#03111d]/66" />
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -25, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-24 top-[12%] h-[420px] w-[420px] rounded-full bg-cyan-300/16 blur-3xl dark:bg-cyan-400/10"
      />

      <motion.div
        animate={{
          x: [0, -35, 0],
          y: [0, 30, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[-120px] top-[22%] h-[460px] w-[460px] rounded-full bg-blue-300/14 blur-3xl dark:bg-blue-500/10"
      />

      <motion.div
        animate={{
          y: [0, -18, 0],
          opacity: [0.22, 0.34, 0.22],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-[-140px] left-1/2 h-[320px] w-[620px] -translate-x-1/2 rounded-full bg-cyan-200/14 blur-3xl dark:bg-cyan-400/6"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/6 to-cyan-100/12 transition-all duration-500 dark:from-[#071827]/5 dark:via-[#071827]/30 dark:to-[#071827]/92" />

      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-[56%] bg-gradient-to-r from-[#eef7f7]/72 via-[#eef7f7]/34 to-transparent transition-all duration-500 dark:w-[54%] dark:from-[#03111d]/82 dark:via-[#03111d]/34 dark:to-transparent lg:block" />

      <div className="pointer-events-none absolute left-[18%] top-[20%] hidden h-[420px] w-[520px] rounded-full bg-[#dff7f4]/22 blur-3xl transition-all duration-500 dark:bg-transparent lg:block" />

      <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-8 px-6 pb-10 pt-2 md:min-h-screen md:gap-10 md:pb-12 md:pt-4 lg:-translate-y-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-0">
        <motion.div
          initial={{
            opacity: 0,
            y: 32,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          className="relative"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.18,
              duration: 0.55,
              ease: "easeOut",
            }}
            className="relative max-w-[720px] pl-4"
          >
            <div className="absolute left-0 top-1 h-[74px] w-[3px] rounded-full brand-gradient" />

            <p className="text-[17px] font-black uppercase leading-tight tracking-[0.18em] text-[#0b5cab] drop-shadow-sm dark:text-cyan-300 md:text-[20px]">
              {t.hero.topLine1}
            </p>

            <p className="mt-1 text-[17px] font-black uppercase leading-tight tracking-[0.16em] text-[#12315c] drop-shadow-sm dark:text-white md:text-[20px]">
              {t.hero.topLine2}
            </p>

            <p className="mt-3 text-[13px] font-black uppercase tracking-[0.08em] text-[#05a99d] md:text-[15px]">
              {t.hero.centerName}
            </p>

            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-[#12315c] dark:text-white/72">
              {t.hero.department}
            </p>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.22,
              duration: 0.7,
              ease: "easeOut",
            }}
            className="mt-6 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.04em] md:text-7xl"
          >
            <span className="brand-text-gradient block drop-shadow-[0_4px_12px_rgba(255,255,255,0.18)] dark:drop-shadow-[0_0_24px_rgba(5,169,157,0.16)]">
              {heading}
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.32,
              duration: 0.6,
              ease: "easeOut",
            }}
            className="mt-6 max-w-2xl text-base font-bold leading-7 text-[#12315c] dark:text-white/78 md:text-lg md:leading-8"
          >
            {text}
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0.6,
            }}
            animate={{
              opacity: 1,
              scaleX: 1,
            }}
            transition={{
              delay: 0.38,
              duration: 0.55,
              ease: "easeOut",
            }}
            className="mt-7 h-[2px] w-52 origin-left rounded-full brand-gradient"
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.42,
              duration: 0.55,
              ease: "easeOut",
            }}
            className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2 md:mt-10"
          >
            <motion.a
              whileHover={{
                y: -3,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              href="#contacts"
              className="brand-gradient brand-shadow inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-black text-white md:px-8 md:py-4"
            >
              <CalendarDays size={18} />
              {t.hero.consultation}
            </motion.a>

            <motion.a
              whileHover={{
                y: -3,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              href="#services"
              className="glass-card inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-black text-[#12315c] dark:text-white md:px-8 md:py-4"
            >
              <Check size={18} />
              {t.hero.services}
            </motion.a>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
              duration: 0.55,
              ease: "easeOut",
            }}
            className="mt-7 grid max-w-[640px] gap-3 sm:grid-cols-3 md:mt-9"
          >
            <StatCard
              value="24/7"
              text={t.hero.statCare}
              icon={<HeartPulse size={20} />}
            />

            <StatCard
              value="100%"
              text={t.hero.statSafety}
              icon={<ShieldCheck size={20} />}
            />

            <StatCard
              value="15+"
              text={t.hero.statSpecialists}
              icon={<HeartHandshake size={20} />}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            x: 42,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="relative hidden lg:block"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              y: -5,
              scale: 1.01,
            }}
            className="relative ml-auto max-w-[500px] overflow-hidden rounded-[2.2rem] border border-white/20 bg-transparent shadow-[0_35px_80px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-[#081826] dark:shadow-[0_35px_80px_rgba(15,23,42,0.35)]"
          >
            <motion.img
              initial={{
                opacity: 0,
                scale: 1.03,
                filter: "blur(12px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: "easeOut",
              }}
              src={cardImage}
              alt="Care"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-[330px] w-full object-cover brightness-[0.97] dark:brightness-[0.92]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 via-black/36 to-transparent p-7 text-white dark:from-[#04111d] dark:via-[#04111d]/48">
              <div className="flex items-end gap-4">
                <motion.div
                  whileHover={{
                    scale: 1.04,
                  }}
                  className="brand-icon grid h-16 w-16 place-items-center rounded-2xl text-white"
                >
                  <Accessibility size={34} />
                </motion.div>

                <div>
                  <h3 className="text-xl font-black text-white">
                    {cardTitle}
                  </h3>

                  <p className="mt-1 text-sm text-white/82">
                    {cardText}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.84,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.7,
              duration: 0.5,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.03,
              rotate: 2,
            }}
            className="absolute -top-20 right-8 z-20"
          >
            <div className="h-42 w-42 overflow-hidden rounded-full border-[5px] border-transparent bg-gradient-to-br from-[#05a99d] via-[#0b5cab] to-[#3ce6d8] p-[4px] shadow-[0_15px_55px_rgba(5,169,157,0.22)]">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                <img
                  src="/logo.png"
                  alt="Логотип"
                  loading="eager"
                  fetchPriority="high"
                  className="h-[88%] w-[88%] object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}