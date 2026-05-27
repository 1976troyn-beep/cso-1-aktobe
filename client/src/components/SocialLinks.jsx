import { motion } from "framer-motion"
import {
  Camera,
  Music2,
  UsersRound,
  ArrowUpRight,
  Send,
  MessageCircle,
} from "lucide-react"

import SectionTitle from "../ui/SectionTitle"
import { useLanguage } from "../context/LanguageContext"
import useSections from "../hooks/useSections"

function getSocialIcon(name) {
  const social = String(name || "").toLowerCase()

  if (social.includes("instagram")) return <Camera size={18} />
  if (social.includes("tiktok")) return <Music2 size={18} />
  if (social.includes("telegram")) return <Send size={18} />
  if (social.includes("youtube")) return <UsersRound size={18} />
  if (social.includes("facebook")) return <UsersRound size={18} />
  if (social.includes("whatsapp")) return <MessageCircle size={18} />

  return <UsersRound size={18} />
}

export default function SocialLinks() {
  const { t } = useLanguage()
  const { getSection } = useSections()

  const contacts = getSection("contacts")

  const socials = [
    {
      title: contacts?.card_5_title || "Instagram",
      text: t.socials.cards[0],
      icon: getSocialIcon(
        contacts?.card_5_title || "Instagram"
      ),
      href:
        contacts?.card_5_text ||
        "https://instagram.com",
    },

    {
      title: contacts?.card_6_title || "TikTok",
      text: t.socials.cards[1],
      icon: getSocialIcon(
        contacts?.card_6_title || "TikTok"
      ),
      href:
        contacts?.card_6_text ||
        "https://tiktok.com",
    },

    {
      title: contacts?.card_7_title || "Telegram",
      text: t.socials.cards[2],
      icon: getSocialIcon(
        contacts?.card_7_title || "Telegram"
      ),
      href:
        contacts?.card_7_text ||
        "https://telegram.org",
    },
  ]

  return (
    <section className="relative overflow-hidden py-18 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <SectionTitle
            badge={t.socials.badge}
            title={t.socials.heading}
            text={t.socials.text}
          />
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {socials.map((item, index) => (
            <motion.a
              key={`${item.title}-${index}`}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{
                duration: 0.42,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              whileHover={{
                y: -4,
                scale: 1.006,
              }}
              className="glass-card group rounded-[1.4rem] p-4 transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.25 }}
                    className="brand-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                  >
                    {item.icon}
                  </motion.div>

                  <div>
                    <h3 className="text-base font-black text-[#12315c]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </div>

                <motion.div
                  whileHover={{
                    x: 2,
                    y: -2,
                  }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 text-[#0b5cab]"
                >
                  <ArrowUpRight size={18} />
                </motion.div>
              </div>

              <div className="mt-4 h-[2px] w-10 rounded-full brand-gradient transition-all duration-500 group-hover:w-20" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}