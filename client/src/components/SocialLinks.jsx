import { motion } from "framer-motion"
import { Music2, UsersRound, ArrowUpRight, Send, MessageCircle } from "lucide-react"
import SectionTitle from "../ui/SectionTitle"
import { useLanguage } from "../context/LanguageContext"
import useSections from "../hooks/useSections"

function InstagramIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
}

function getSocialIcon(name) {
  const social = String(name || "").toLowerCase()
  if (social.includes("instagram")) return <InstagramIcon />
  if (social.includes("tiktok")) return <Music2 size={20} />
  if (social.includes("telegram")) return <Send size={20} />
  if (social.includes("youtube") || social.includes("facebook")) return <UsersRound size={20} />
  if (social.includes("whatsapp")) return <MessageCircle size={20} />
  return <UsersRound size={20} />
}

const gradients = ["from-[#0b5cab] to-[#1688c3]", "from-[#0869aa] to-[#079da9]", "from-[#087fa4] to-[#05a99d]"]

export default function SocialLinks() {
  const { t } = useLanguage()
  const { getSection } = useSections()
  const contacts = getSection("contacts")
  const socials = [
    { title: contacts?.card_5_title || "Instagram", text: t.socials.cards[0], href: contacts?.card_5_text || "https://instagram.com" },
    { title: contacts?.card_6_title || "TikTok", text: t.socials.cards[1], href: contacts?.card_6_text || "https://tiktok.com" },
    { title: contacts?.card_7_title || "Telegram", text: t.socials.cards[2], href: contacts?.card_7_text || "https://telegram.org" },
  ]
  return (
    <section className="relative overflow-hidden py-18 md:py-20">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, ease: "easeOut" }}>
          <SectionTitle badge={t.socials.badge} title={t.socials.heading} text={t.socials.text} />
        </motion.div>
        <div className="mt-6 grid gap-2.5 sm:mt-8 sm:gap-3 md:grid-cols-3">
          {socials.map((item, index) => (
            <motion.a key={`${item.title}-${index}`} href={item.href} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.42, delay: index * 0.05, ease: "easeOut" }} whileHover={{ y: -3, scale: 1.004 }} className={`group relative flex min-h-[70px] items-center gap-2.5 rounded-[1.1rem] bg-gradient-to-r ${gradients[index]} px-3 py-2.5 text-white shadow-[0_12px_26px_rgba(11,92,171,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_32px_rgba(11,92,171,0.20)] sm:min-h-[78px] sm:gap-3 sm:px-4 sm:py-3`}>
              <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.2 }} className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full border border-white/30 bg-white/20 text-white sm:h-[38px] sm:w-[38px]">
                {getSocialIcon(item.title)}
              </motion.div>
              <div className="min-w-0 flex-1 pr-5">
                <h3 className="break-words text-[13px] font-semibold leading-[18px] text-white sm:text-sm sm:font-black sm:leading-5">{item.title}</h3>
                <p className="mt-0.5 text-[11px] leading-[15px] text-white/85 sm:text-xs sm:leading-4">{item.text}</p>
              </div>
              <ArrowUpRight size={17} className="absolute right-3 top-3 text-white/90 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

