import { motion } from "framer-motion"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Camera,
  Music2,
  UsersRound,
  ExternalLink,
} from "lucide-react"

import { useLanguage } from "../context/LanguageContext"
import useSections from "../hooks/useSections"

function getSocialIcon(name) {
  const social = String(name || "").toLowerCase()

  if (social.includes("instagram")) {
    return <Camera size={17} />
  }

  if (social.includes("tiktok")) {
    return <Music2 size={17} />
  }

  return <UsersRound size={17} />
}

export default function Footer() {
  const { t } = useLanguage()

  const { getSection } =
    useSections()

  const contacts =
    getSection("contacts")

  const navLinks = [
    {
      href: "#top",
      label: t.header.nav.home,
    },

    {
      href: "#rooms",
      label: t.header.nav.rooms,
    },

    {
      href: "#leadership",
      label:
        t.header.nav.leadership,
    },

    {
      href: "#specialists",
      label:
        t.header.nav.specialists,
    },

    {
      href: "#partners",
      label:
        t.header.nav.partners,
    },

    {
      href: "#documents",
      label:
        t.header.nav.documents,
    },

    {
      href: "#reviews",
      label:
        t.header.nav.reviews,
    },

    {
      href: "#contacts",
      label:
        t.header.nav.contacts,
    },
  ]

  const socials = [
    {
      href:
        contacts?.card_5_text ||
        "https://instagram.com",

      icon: getSocialIcon(
        contacts?.card_5_title ||
          "Instagram"
      ),

      label:
        contacts?.card_5_title ||
        "Instagram",
    },

    {
      href:
        contacts?.card_6_text ||
        "https://tiktok.com",

      icon: getSocialIcon(
        contacts?.card_6_title ||
          "TikTok"
      ),

      label:
        contacts?.card_6_title ||
        "TikTok",
    },

    {
      href:
        contacts?.card_7_text ||
        "https://ok.ru",

      icon: getSocialIcon(
        contacts?.card_7_title ||
          "Telegram"
      ),

      label:
        contacts?.card_7_title ||
        "Telegram",
    },
  ]

  const address =
    contacts?.card_title ||
    t.contacts.address

  const phone =
    contacts?.card_text ||
    "+7 (707) 000-00-00"

  const email =
    contacts?.card_1_text ||
    "info@example.kz"

  const schedule =
    contacts?.card_2_text ||
    "Пн-Пт / 9:00-18:00"

  const twoGisUrl = `https://2gis.kz/aktobe/search/${encodeURIComponent(
    address
  )}`

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[linear-gradient(180deg,#030b14_0%,#06131f_45%,#081726_100%)] text-white">
      {/* AMBIENT */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-56 w-56 rounded-full bg-cyan-500/6 blur-3xl md:h-72 md:w-72" />

        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/6 blur-3xl md:h-80 md:w-80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-11 md:py-14">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[1.25fr_0.75fr_0.9fr]">
          {/* BRAND */}

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
            <div className="flex items-center gap-3 md:gap-4">
              <motion.div
                whileHover={{
                  scale: 1.04,
                  rotate: 2,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-[4px] border-transparent bg-gradient-to-br from-[#05a99d] via-[#0b5cab] to-[#3ce6d8] p-[3px] shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:h-20 md:w-20"
              >
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                  <img
                    src="/logo.png"
                    alt="Логотип"
                    className="h-[88%] w-[88%] object-contain"
                  />
                </div>
              </motion.div>

              <div>
                <h3 className="text-lg font-black text-white md:text-xl">
                  {t.header.brandTitle}
                </h3>

                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300/72 md:text-xs md:tracking-[0.16em]">
                  {t.hero.topLine1}{" "}
                  {t.hero.topLine2}
                </p>
              </div>
            </div>

            <div className="mt-4 max-w-xl text-sm leading-6 text-white/68 md:mt-5 md:leading-7">
              <p className="font-bold text-white">
                {t.hero.centerName}
              </p>

              <p className="mt-2">
                {t.hero.department}
              </p>
            </div>

            {/* SOCIALS */}

            <div className="mt-5 flex flex-wrap gap-2.5 md:mt-6 md:gap-3">
              {socials.map(
                (item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={
                      item.label
                    }
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay:
                        index *
                        0.05,
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.04,
                    }}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white backdrop-blur transition hover:border-cyan-400/30 hover:bg-cyan-500/10 md:h-12 md:w-12"
                  >
                    <span className="transition duration-300 group-hover:scale-110">
                      {item.icon}
                    </span>
                  </motion.a>
                )
              )}
            </div>
          </motion.div>

          {/* NAVIGATION */}

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
              delay: 0.05,
              ease: "easeOut",
            }}
          >
            <h4 className="text-base font-black text-white">
              {t.footer.sections}
            </h4>

            <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm text-white/65 md:mt-5 md:gap-3">
              {navLinks.map(
                (item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{
                      opacity: 0,
                      x: -8,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay:
                        index *
                        0.03,
                    }}
                    whileHover={{
                      x: 3,
                    }}
                    className="group flex items-center gap-2 transition hover:text-cyan-300"
                  >
                    <span className="h-[5px] w-[5px] rounded-full bg-cyan-400 transition-all duration-300 group-hover:w-3" />

                    <span>
                      {item.label}
                    </span>
                  </motion.a>
                )
              )}
            </div>
          </motion.div>

          {/* CONTACTS */}

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
              delay: 0.1,
              ease: "easeOut",
            }}
          >
            <h4 className="text-base font-black text-white">
              {t.header.nav.contacts}
            </h4>

            <div className="mt-4 grid gap-3 text-sm text-white/68 md:mt-5 md:gap-4">
              <motion.div
                whileHover={{
                  x: 2,
                }}
                className="flex gap-3"
              >
                <Phone
                  size={16}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <span>{phone}</span>
              </motion.div>

              <motion.div
                whileHover={{
                  x: 2,
                }}
                className="flex gap-3"
              >
                <Mail
                  size={16}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <span>{email}</span>
              </motion.div>

              <motion.div
                whileHover={{
                  x: 2,
                }}
                className="flex gap-3"
              >
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <span>{address}</span>
              </motion.div>

              <motion.div
                whileHover={{
                  x: 2,
                }}
                className="flex gap-3"
              >
                <Clock
                  size={16}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <span>
                  {schedule}
                </span>
              </motion.div>

              <motion.a
                whileHover={{
                  y: -2,
                }}
                href={twoGisUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold text-cyan-200 backdrop-blur transition hover:border-cyan-400/30 hover:bg-cyan-500/10 md:mt-2 md:text-xs"
              >
                <ExternalLink
                  size={14}
                />

                {t.footer.openMap}
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM */}

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-4 text-[11px] text-white/45 md:mt-10 md:flex-row md:items-center md:justify-between md:gap-3 md:pt-5 md:text-xs">
          <span>
            {t.footer.copyright}
          </span>

          <span>
            {t.footer.region}
          </span>
        </div>
      </div>
    </footer>
  )
}