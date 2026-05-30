import { useState } from "react"
import { createPortal } from "react-dom"
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

  const whatsappPhone = normalizePhone(contacts?.card_3_text)
  const hotlinePhone = normalizePhone(contacts?.card_4_text)

  const hasContacts = Boolean(whatsappPhone || hotlinePhone)

  const whatsappText = encodeURIComponent(
    "Здравствуйте, хочу получить консультацию."
  )

  return createPortal(
    <div
      className="
        fixed
        right-4
        bottom-20
        z-[99999]
        flex
        flex-col
        items-end
        gap-3
        md:right-6
        md:bottom-6
      "
      style={{
        transform: "translate3d(0,0,0)",
        WebkitTransform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            transition={{
              duration: 0.18,
              ease: "easeOut",
            }}
            className="
              glass-card
              relative
              w-[min(280px,calc(100vw-28px))]
              overflow-hidden
              rounded-[1.3rem]
              border
              border-white/70
              bg-white/92
              p-4
              shadow-[0_24px_60px_rgba(15,23,42,0.14)]
              backdrop-blur-xl
              dark:border-cyan-400/10
              dark:bg-[#071827]/88
              dark:shadow-[0_30px_70px_rgba(0,0,0,0.34)]
            "
          >
            <div className="pointer-events-none absolute inset-0 hidden dark:block">
              <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="mb-5 flex items-start gap-4">
                <div
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
                </div>

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
                {!hasContacts && (
                  <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-bold text-[#0b5cab] dark:bg-white/5 dark:text-white">
                    Контакты загружаются...
                  </div>
                )}

                {whatsappPhone && (
                  <motion.a
                    whileTap={{ scale: 0.98 }}
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
                    whileTap={{ scale: 0.98 }}
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
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t.hotline?.call || "Горячая линия"}
        whileTap={{
          scale: 0.96,
        }}
        transition={{
          duration: 0.18,
          ease: "easeOut",
        }}
        className="
          brand-gradient
          brand-shadow
          relative
          grid
          h-[58px]
          w-[58px]
          place-items-center
          rounded-full
          text-white
          shadow-[0_16px_46px_rgba(5,169,157,0.34)]
          md:h-[72px]
          md:w-[72px]
        "
      >
        {!isOpen && (
          <span className="pointer-events-none absolute inset-0 rounded-full bg-cyan-300/30 animate-ping" />
        )}

        <motion.span
          animate={{
            rotate: isOpen ? 0 : [0, -8, 8, -5, 5, 0],
          }}
          transition={{
            duration: 1.7,
            repeat: isOpen ? 0 : Infinity,
            repeatDelay: 2.6,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          {isOpen ? <X size={25} /> : <PhoneCall size={25} />}
        </motion.span>
      </motion.button>
    </div>,
    document.body
  )
}