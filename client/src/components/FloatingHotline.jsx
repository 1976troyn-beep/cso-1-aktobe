import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  MessageCircle,
  PhoneCall,
  X,
  Headphones,
} from "lucide-react"

import { useLanguage } from "../context/LanguageContext"
import useSections from "../hooks/useSections"

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "")
}

export default function FloatingHotline() {
  const { getSection } = useSections()
  const { t } = useLanguage()

  const [isOpen, setIsOpen] = useState(false)

  const contacts = getSection("contacts")

  const whatsappPhone = normalizePhone(
    contacts?.card_3_text
  )

  const hotlinePhone = normalizePhone(
    contacts?.card_4_text
  )

  if (!whatsappPhone && !hotlinePhone) {
    return null
  }

  const whatsappText = encodeURIComponent(
    "Здравствуйте, хочу получить консультацию."
  )

  return (
    <div
      className="
        fixed
        right-4
        bottom-4
        z-[9999]
        flex
        flex-col
        items-end
        gap-3
        md:right-6
        md:bottom-6
      "
      style={{
        paddingBottom:
          "env(safe-area-inset-bottom)",
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.96,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className="
              glass-card
              relative
              w-[300px]
              overflow-hidden
              rounded-[1.8rem]
              border
              border-white/70
              bg-white/92
              p-5
              shadow-[0_30px_80px_rgba(15,23,42,0.16)]
              backdrop-blur-xl
              dark:border-cyan-400/10
              dark:bg-[#071827]/88
              dark:shadow-[0_35px_90px_rgba(0,0,0,0.38)]
            "
          >
            <div className="pointer-events-none absolute inset-0 hidden dark:block">
              <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="mb-5 flex items-start gap-4">
                <motion.div
                  whileHover={{
                    scale: 1.04,
                  }}
                  className="
                    brand-icon
                    grid
                    h-12
                    w-12
                    shrink-0
                    place-items-center
                    rounded-2xl
                    text-white
                  "
                >
                  <Headphones size={22} />
                </motion.div>

                <div>
                  <h3 className="text-lg font-black text-[#12315c] dark:text-white">
                    Горячая линия
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-white/70">
                    Выберите удобный способ связи.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {whatsappPhone && (
                  <motion.a
                    whileHover={{
                      y: -2,
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      brand-gradient
                      inline-flex
                      items-center
                      justify-center
                      gap-3
                      rounded-2xl
                      px-5
                      py-4
                      text-sm
                      font-black
                      text-white
                      shadow-[0_15px_40px_rgba(5,169,157,0.22)]
                    "
                  >
                    <MessageCircle size={18} />
                    Написать в WhatsApp
                  </motion.a>
                )}

                {hotlinePhone && (
                  <motion.a
                    whileHover={{
                      y: -2,
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    href={`tel:+${hotlinePhone}`}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-3
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      px-5
                      py-4
                      text-sm
                      font-black
                      text-[#12315c]
                      shadow-lg
                      transition
                      hover:border-[#05a99d]/30
                      hover:bg-[#05a99d]/5
                      dark:border-white/10
                      dark:bg-white/5
                      dark:text-white
                      dark:hover:border-cyan-400/20
                      dark:hover:bg-cyan-500/10
                    "
                  >
                    <PhoneCall size={18} />
                    Позвонить
                  </motion.a>
                )}
              </div>

              <div className="mt-5 h-[2px] w-16 rounded-full brand-gradient" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
        aria-label={
          t.hotline?.call ||
          "Горячая линия"
        }
        initial={{
          opacity: 0,
          scale: 0.9,
          y: 18,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        whileHover={{
          scale: 1.08,
          y: -3,
        }}
        whileTap={{
          scale: 0.94,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="
          brand-gradient
          brand-shadow
          relative
          grid
          h-14
          w-14
          place-items-center
          rounded-full
          text-white
          shadow-[0_18px_50px_rgba(5,169,157,0.35)]
          md:h-16
          md:w-16
        "
      >
        <motion.span
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(5,169,157,0.34)",
              "0 0 0 14px rgba(5,169,157,0)",
              "0 0 0 0 rgba(5,169,157,0)",
            ],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full"
        />

        <motion.span
          animate={{
            rotate: isOpen
              ? 0
              : [0, -8, 8, -5, 5, 0],
          }}
          transition={{
            duration: 1.7,
            repeat: isOpen
              ? 0
              : Infinity,
            repeatDelay: 2.6,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          {isOpen ? (
            <X size={25} />
          ) : (
            <PhoneCall size={25} />
          )}
        </motion.span>
      </motion.button>
    </div>
  )
}