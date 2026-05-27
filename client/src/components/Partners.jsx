import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Handshake,
  ArrowUpRight,
  ExternalLink,
  Building2,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react"

import SectionTitle from "../ui/SectionTitle"
import SkeletonCard from "../ui/SkeletonCard"

import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"

const API_URL = import.meta.env.VITE_API_URL

let cachedPartners = null
let partnersRequest = null

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "")
}

export default function Partners() {
  const { getSection } = useSections()

  const { t, language } =
    useLanguage()

  const [partners, setPartners] =
    useState(cachedPartners || [])

  const [loadingPartners, setLoadingPartners] =
    useState(!cachedPartners)

  useEffect(() => {
    let isMounted = true

    async function loadPartners() {
      try {
        if (cachedPartners) {
          setPartners(cachedPartners)
          setLoadingPartners(false)
          return
        }

        if (!partnersRequest) {
          partnersRequest = fetch(
            `${API_URL}/api/partners`
          )
            .then((res) => res.json())
            .then((data) => {
              const preparedData =
                Array.isArray(data)
                  ? data
                  : []

              cachedPartners =
                preparedData

              return preparedData
            })
        }

        const data =
          await partnersRequest

        if (isMounted) {
          setPartners(data)
          setLoadingPartners(false)
        }
      } catch (error) {
        console.error(
          "Ошибка загрузки партнёров:",
          error
        )

        if (isMounted) {
          setPartners([])
          setLoadingPartners(false)
        }
      }
    }

    loadPartners()

    return () => {
      isMounted = false
    }
  }, [])

  const contacts =
    getSection("contacts")

  const partnersSection =
    getSection("partners")

  const whatsappNumber =
    normalizePhone(
      contacts?.card_3_text
    )

  const collaborationLink =
    whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          t.partners.whatsappText
        )}`
      : "#contacts"

  const categories = [
    {
      title:
        t.partners.categories[0],

      icon: (
        <Building2 size={16} />
      ),
    },

    {
      title:
        t.partners.categories[1],

      icon: (
        <HeartHandshake size={16} />
      ),
    },

    {
      title:
        t.partners.categories[2],

      icon: (
        <ShieldCheck size={16} />
      ),
    },

    {
      title:
        t.partners.categories[3],

      icon: (
        <Handshake size={16} />
      ),
    },
  ]

  const heading =
    language === "RU"
      ? partnersSection?.heading ||
        t.partners.heading
      : t.partners.heading

  const text =
    language === "RU"
      ? partnersSection?.text ||
        t.partners.text
      : t.partners.text

  return (
    <section
      id="partners"
      className="relative overflow-hidden py-18 md:py-20"
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
            badge={t.partners.badge}
            title={heading}
            text={text}
          />
        </motion.div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map(
            (item, index) => (
              <motion.article
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 16,
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
                  y: -3,
                  scale: 1.006,
                }}
                className="glass-card group rounded-[1.2rem] p-3 transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{
                      scale: 1.04,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="brand-icon grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
                  >
                    {item.icon}
                  </motion.div>

                  <h3 className="text-sm font-black leading-5 text-[#12315c]">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-3 h-[1.5px] w-7 rounded-full brand-gradient transition-all duration-500 group-hover:w-14" />
              </motion.article>
            )
          )}
        </div>

        {loadingPartners ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                  delay:
                    index * 0.04,
                }}
              >
                <SkeletonCard height="h-[240px]" />
              </motion.div>
            ))}
          </div>
        ) : partners.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {partners.map(
              (partner, index) => (
                <motion.article
                  key={partner.id}
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
                    duration: 0.42,
                    delay:
                      index * 0.05,

                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  className="glass-card group rounded-[1.3rem] p-4 transition-all duration-300 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      whileHover={{
                        scale: 1.04,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className={`grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full ${
                        partner.logo
                          ? "border border-slate-200 bg-white p-1 shadow-md"
                          : "brand-icon text-white"
                      }`}
                    >
                      {partner.logo ? (
                        <motion.img
                          initial={{
                            opacity: 0,
                            scale: 0.96,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          transition={{
                            duration: 0.35,
                          }}
                          src={
                            partner.logo
                          }
                          alt={
                            partner.title
                          }
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full rounded-full object-contain"
                        />
                      ) : (
                        <Handshake
                          size={18}
                        />
                      )}
                    </motion.div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-black text-[#12315c]">
                        {
                          partner.title
                        }
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {
                          partner.description
                        }
                      </p>

                      {partner.link && (
                        <motion.a
                          whileHover={{
                            x: 2,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                          href={
                            partner.link
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#0b5cab] transition-colors duration-300 hover:text-[#05a99d]"
                        >
                          <ExternalLink
                            size={15}
                          />

                          {
                            t.partners
                              .open
                          }
                        </motion.a>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 h-[1.5px] w-8 rounded-full brand-gradient transition-all duration-500 group-hover:w-16" />
                </motion.article>
              )
            )}
          </div>
        ) : null}

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
            y: -2,
          }}
          className="glass-card mt-6 flex flex-col items-start justify-between gap-4 rounded-[1.4rem] p-4 transition-shadow duration-300 hover:shadow-[0_22px_55px_rgba(15,23,42,0.08)] lg:flex-row lg:items-center"
        >
          <div>
            <h3 className="text-lg font-black text-[#12315c]">
              {
                t.partners
                  .cooperation
              }
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {
                t.partners
                  .cooperationText
              }
            </p>
          </div>

          <motion.a
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.98,
            }}
            href={collaborationLink}
            target="_blank"
            rel="noreferrer"
            className="brand-gradient brand-shadow inline-flex shrink-0 items-center gap-3 rounded-full px-5 py-3 text-sm font-black text-white"
          >
            <ArrowUpRight
              size={16}
            />

            {t.partners.contact}
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
