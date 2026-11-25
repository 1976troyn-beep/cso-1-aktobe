import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Files,
  CalendarDays,
  ClipboardList,
  ArrowRight,
  X,
} from "lucide-react"
import SectionTitle from "../ui/SectionTitle"
import SkeletonCard from "../ui/SkeletonCard"
import useSections from "../hooks/useSections"
import { useLanguage } from "../context/LanguageContext"
const icons = [
  <ClipboardList size={20} />,
  <FileText size={20} />,
  <Files size={20} />,
  <CalendarDays size={20} />,
]
export default function Documents() {
  const [activeDoc, setActiveDoc] =
    useState(null)
  const {
    getSection,
    loading,
  } = useSections()
  const { t } =
    useLanguage()
  const documentsSection =
    getSection("documents")
  const heading = documentsSection?.heading || t.documents.heading
  const text = documentsSection?.text || t.documents.text
  const documents = Array.from({ length: 4 }, (_, index) => ({
    title: documentsSection?.[`card_${index + 1}_title`] || t.documents.cards[index].title,
    description: documentsSection?.[`card_${index + 1}_text`] || t.documents.cards[index].text,
    icon: icons[index],
  }))
  return (
    <section
      id="documents"
      className="relative overflow-hidden py-24"
    >
      <div className="mx-auto max-w-7xl px-2.5 sm:px-6">
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
              t.documents.badge
            }
            title={heading}
            text={text}
          />
        </motion.div>
        <div className="mt-9 grid gap-3 sm:gap-4 md:grid-cols-2">
          {loading
            ? Array.from({
                length: 4,
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
                    <SkeletonCard height="h-[190px]" />
                  </motion.div>
                )
              )
            : documents.map(
                (
                  doc,
                  index
                ) => (
                  <motion.div
                    key={doc.title}
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
                        index *
                        0.05,
                      ease:
                        "easeOut",
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.005,
                    }}
                    className="glass-card group rounded-[1.5rem] p-3 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)]"
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        whileHover={{
                          scale: 1.04,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className="brand-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                      >
                        {doc.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-base font-black text-[#12315c] sm:text-[1.12rem]     ">
                          {doc.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-[21px] text-slate-600">
                          {
                            doc.description
                          }
                        </p>
                        <motion.button
                          whileHover={{
                            x: 2,
                          }}
                          type="button"
                          onClick={() =>
                            setActiveDoc(
                              doc
                            )
                          }
                          className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#05a99d] transition-all duration-300 hover:gap-3"
                        >
                          {
                            t.services
                              .more
                          }
                          <ArrowRight
                            size={16}
                          />
                        </motion.button>
                        <div className="mt-3 h-[2px] w-14 rounded-full brand-gradient transition-all duration-500 group-hover:w-28" />
                      </div>
                    </div>
                  </motion.div>
                )
              )}
        </div>
      </div>
      <AnimatePresence>
        {activeDoc && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setActiveDoc(null)
              }
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm "
            />
            <motion.div
              initial={{
                opacity: 0,
                y: 24,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 24,
                scale: 0.97,
              }}
              transition={{
                duration: 0.24,
                ease: "easeOut",
              }}
              className="fixed left-1/2 top-1/2 z-[100] max-h-[90dvh] w-[calc(100%-20px)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.5rem] border border-slate-100 bg-white p-4 sm:w-[92%] sm:rounded-[2rem] sm:p-7 shadow-2xl transition-all duration-500   "
            >
              <div className="pointer-events-none absolute inset-0 hidden ">
                <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveDoc(null)
                }
                className="absolute right-5 top-5 z-[120] grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-[#12315c] transition hover:bg-slate-200   "
              >
                <X size={18} />
              </button>
              <div className="relative z-10">
                <motion.div
                  whileHover={{
                    scale: 1.03,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="brand-icon grid h-16 w-16 place-items-center rounded-2xl text-white"
                >
                  {activeDoc.icon}
                </motion.div>
                <h3 className="mt-6 pr-10 text-2xl font-black sm:text-3xl text-[#12315c]     ">
                  {activeDoc.title}
                </h3>
                <p className="mt-5 whitespace-pre-line leading-7 sm:leading-8 text-slate-600 ">
                  {
                    activeDoc.description
                  }
                </p>
                <div className="mt-7 rounded-2xl bg-cyan-50 p-4 text-sm font-semibold leading-6 text-[#0b5cab]    ">
                  {t.documents.note}
                </div>
                <motion.a
                  whileHover={{
                    y: -2,
                    scale: 1.01,
                  }}
                  href="#contacts"
                  onClick={() =>
                    setActiveDoc(null)
                  }
                  className="brand-gradient brand-shadow mt-7 inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-black text-white"
                >
                  {
                    t.documents
                      .contactButton
                  }
                  <ArrowRight
                    size={17}
                  />
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}