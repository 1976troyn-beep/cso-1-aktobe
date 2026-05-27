import { useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  MessageSquareText,
  ExternalLink,
} from "lucide-react"

import SectionTitle from "../ui/SectionTitle"
import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

const API_URL = import.meta.env.VITE_API_URL

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "")
}

export default function Contacts() {
  const { getSection } = useSections()
  const { t, language } = useLanguage()

  const contacts = getSection("contacts")

  const address =
    language === "RU"
      ? contacts?.card_title || "г. Актобе, ул. Нефтяников 25"
      : t.contacts.address

  const phone =
    contacts?.card_text ||
    "+7 (707) 000-00-00"

  const email =
    contacts?.card_1_text ||
    "info@example.kz"

  const schedule =
    language === "RU"
      ? contacts?.card_2_text ||
        "Ежедневно · 24/7"
      : t.contacts.schedule

  const whatsappNumber =
    normalizePhone(
      contacts?.card_3_text ||
        "77070000000"
    )

  const twoGisUrl = `https://2gis.kz/aktobe/search/${encodeURIComponent(
    address
  )}`

  const contactInfo = [
    {
      icon: <Phone size={18} />,
      title: t.contacts.phone,
      text: phone,
    },

    {
      icon: <Mail size={18} />,
      title: "Email",
      text: email,
    },

    {
      icon: <Clock size={18} />,
      title: t.contacts.workMode,
      text: schedule,
    },
  ]

  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  })

  const [isSending, setIsSending] =
    useState(false)

  function handleChange(event) {
    const { name, value } =
      event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSending) return

    setIsSending(true)

    try {
      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            full_name: form.name,
            phone: form.phone,
            email,
            message: form.message,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Ошибка отправки заявки"
        )
      }

      const whatsappMessage = `
${t.contacts.whatsappTitle}

${t.contacts.formName}: ${form.name}
${t.contacts.formPhone}: ${form.phone}

${t.contacts.formMessage}:
${form.message}
      `

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`

      window.open(
        whatsappUrl,
        "_blank"
      )

      alert(
        "Заявка успешно отправлена"
      )

      setForm({
        name: "",
        phone: "",
        message: "",
      })
    } catch (error) {
      console.error(error)

      alert(
        "Ошибка отправки заявки"
      )
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section
      id="contacts"
      className="relative overflow-hidden bg-white/55 py-24 dark:bg-transparent md:py-28"
    >
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/6 md:top-20 md:h-72 md:w-72" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/8 md:h-96 md:w-96" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle
          badge={t.contacts.badge}
          title={t.contacts.title}
          text={t.contacts.text}
        />

        <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-7">
          {/* LEFT */}

          <div className="grid gap-4 md:gap-5">
            {/* ADDRESS CARD */}

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
                duration: 0.42,
                ease: "easeOut",
              }}
              whileHover={{
                y: -4,
                scale: 1.006,
              }}
              className="glass-card group relative overflow-hidden rounded-[1.7rem] p-5 transition-shadow duration-300 hover:shadow-[0_24px_65px_rgba(15,23,42,0.11)] md:rounded-[2rem] md:p-6"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/12 blur-3xl" />

                <div className="absolute -bottom-20 left-12 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
              </div>

              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.7rem] md:rounded-[2rem]">
                <div className="absolute -left-20 top-0 h-full w-24 rotate-12 bg-white/12 opacity-0 blur-2xl transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100 dark:bg-cyan-300/10" />
              </div>

              <div className="relative z-10 flex items-start gap-3 md:gap-4">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotate: 4,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="brand-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white md:h-14 md:w-14"
                >
                  <MapPin size={24} />
                </motion.div>

                <div>
                  <h3 className="text-lg font-black text-[#12315c] dark:text-white md:text-xl">
                    {t.contacts.addressTitle}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/70 md:text-base md:leading-7">
                    {address}
                  </p>

                  <motion.a
                    whileHover={{
                      x: 2,
                      y: -1,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    href={twoGisUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-[#12315c] transition hover:border-[#05a99d]/40 hover:bg-[#05a99d]/5 dark:border-white/10 dark:bg-white/5 dark:text-cyan-200 dark:hover:border-cyan-400/30 dark:hover:bg-cyan-500/10 md:mt-5 md:px-5 md:py-3 md:text-sm"
                  >
                    <ExternalLink size={15} />
                    {t.contacts.openMap}
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* CONTACT INFO */}

            <div className="grid gap-3 md:gap-4">
              {contactInfo.map(
                (item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      x: -20,
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
                      duration: 0.4,
                      delay:
                        index * 0.05,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.006,
                    }}
                    className="glass-card group relative overflow-hidden rounded-[1.3rem] p-4 transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] md:rounded-[1.5rem] md:p-5"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
                      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
                    </div>

                    <div className="relative z-10 flex items-center gap-3 md:gap-4">
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          rotate: 5,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className="brand-icon grid h-10 w-10 shrink-0 place-items-center rounded-full text-white md:h-11 md:w-11"
                      >
                        {item.icon}
                      </motion.div>

                      <div>
                        <h3 className="text-sm font-black text-[#12315c] dark:text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-600 dark:text-white/70 md:text-sm">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>

          {/* FORM */}

          <motion.form
            onSubmit={handleSubmit}
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
              duration: 0.45,
              ease: "easeOut",
            }}
            whileHover={{
              y: -3,
            }}
            className="glass-card group relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white/90 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_35px_90px_rgba(0,0,0,0.10)] dark:border-cyan-400/10 dark:bg-[#071827]/70 dark:shadow-[0_25px_80px_rgba(0,0,0,0.28)] md:rounded-[2rem] md:p-7"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-[#1bbce3]">
                    <User size={16} />
                    {t.contacts.formName}
                  </span>

                  <input
                    name="name"
                    value={form.name}
                    onChange={
                      handleChange
                    }
                    placeholder={
                      t.contacts
                        .namePlaceholder
                    }
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-[#eef5fb] px-4 py-3 text-sm text-[#12315c] placeholder:text-slate-500 outline-none transition duration-300 focus:border-[#3ce6d8] focus:bg-white focus:shadow-[0_0_18px_rgba(60,230,216,0.18)] dark:border-cyan-400/10 dark:bg-[#16324d]/75 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-[#1a3d5d]/90 md:text-base"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-[#1bbce3]">
                    <Phone size={16} />
                    {t.contacts.formPhone}
                  </span>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={
                      handleChange
                    }
                    placeholder="+7 (707) 000-00-00"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-[#eef5fb] px-4 py-3 text-sm text-[#12315c] placeholder:text-slate-500 outline-none transition duration-300 focus:border-[#3ce6d8] focus:bg-white focus:shadow-[0_0_18px_rgba(60,230,216,0.18)] dark:border-cyan-400/10 dark:bg-[#16324d]/75 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-[#1a3d5d]/90 md:text-base"
                  />
                </label>
              </div>

              <label className="mt-4 block md:mt-5">
                <span className="mb-2 flex items-center gap-2 text-sm font-black text-[#1bbce3]">
                  <MessageSquareText
                    size={16}
                  />
                  {t.contacts.formMessage}
                </span>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={
                    handleChange
                  }
                  placeholder={
                    t.contacts
                      .messagePlaceholder
                  }
                  rows="5"
                  required
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-[#eef5fb] px-4 py-3 text-sm text-[#12315c] placeholder:text-slate-500 outline-none transition duration-300 focus:border-[#3ce6d8] focus:bg-white focus:shadow-[0_0_18px_rgba(60,230,216,0.18)] dark:border-cyan-400/10 dark:bg-[#16324d]/75 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-[#1a3d5d]/90 md:text-base"
                />
              </label>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                disabled={isSending}
                className="brand-gradient brand-shadow mt-5 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-black text-white transition duration-300 hover:shadow-[0_0_30px_rgba(60,230,216,0.35)] disabled:cursor-not-allowed disabled:opacity-60 md:mt-6 md:px-8 md:py-4"
              >
                <Send size={18} />

                {isSending
                  ? "Отправка..."
                  : t.contacts.send}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}