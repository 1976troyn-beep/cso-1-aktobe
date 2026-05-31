import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { useLanguage } from "../context/LanguageContext"

import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion"

import {
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  Home,
  BedDouble,
  UsersRound,
  UserRoundCheck,
  FileText,
  MessageCircle,
  Phone,
  Handshake,
} from "lucide-react"

const languages = [
  {
    code: "RU",
    label: "Русский",
    flag: "🇷🇺",
  },

  {
    code: "KZ",
    label: "Қазақша",
    flag: "🇰🇿",
  },

  {
    code: "EN",
    label: "English",
    flag: "🇬🇧",
  },
]

export default function Header() {
  const { language, setLanguage, t } =
    useLanguage()

  const [isLangOpen, setIsLangOpen] =
    useState(false)

  const [isDark, setIsDark] =
    useState(() => {
    if (typeof window === "undefined") {
      return false
    }

    const savedTheme =
      localStorage.getItem("theme")

    if (savedTheme === "dark") {
      document.documentElement.classList.add(
        "dark"
      )

      return true
    }

    if (savedTheme === "light") {
      document.documentElement.classList.remove(
        "dark"
      )

      return false
    }

    const isMobile =
      window.innerWidth < 768

    if (isMobile) {
      document.documentElement.classList.add(
        "dark"
      )

      return true
    }

    document.documentElement.classList.remove(
      "dark"
    )

    return false
  })
  const [isMobileOpen, setIsMobileOpen] =
    useState(false)

  const [activeSection, setActiveSection] =
    useState("top")

  const { scrollYProgress } =
    useScroll()

  const scaleX = useSpring(
    scrollYProgress,
    {
      stiffness: 120,
      damping: 24,
      mass: 0.24,
    }
  )

  const activeLang =
    languages.find(
      (lang) =>
        lang.code === language
    ) || languages[0]

  const navLinks = useMemo(
    () => [
      {
        href: "#top",
        label: t.header.nav.home,
        icon: <Home size={18} />,
      },

      {
        href: "#rooms",
        label: t.header.nav.rooms,
        icon: (
          <BedDouble size={18} />
        ),
      },

      {
        href: "#leadership",
        label:
          t.header.nav
            .leadership,
        icon: (
          <UsersRound size={18} />
        ),
      },

      {
        href: "#specialists",
        label:
          t.header.nav
            .specialists,
        icon: (
          <UserRoundCheck
            size={18}
          />
        ),
      },

      {
        href: "#partners",
        label:
          t.header.nav
            .partners,
        icon: (
          <Handshake size={18} />
        ),
      },

      {
        href: "#documents",
        label:
          t.header.nav
            .documents,
        icon: (
          <FileText size={18} />
        ),
      },

      {
        href: "#reviews",
        label:
          t.header.nav.reviews,
        icon: (
          <MessageCircle
            size={18}
          />
        ),
      },

      {
        href: "#contacts",
        label:
          t.header.nav
            .contacts,
        icon: (
          <Phone size={18} />
        ),
      },
    ],
    [t]
  )

  function toggleTheme() {
  const overlay = document.createElement("div")

  overlay.className =
    "theme-transition-overlay"

  document.body.appendChild(overlay)

  requestAnimationFrame(() => {
    overlay.classList.add("theme-transition-overlay-active")
  })

  const nextTheme = !isDark

  setTimeout(() => {
    setIsDark(nextTheme)
     localStorage.setItem(
      "theme",
      nextTheme ? "dark" : "light"
    )
    if (nextTheme) {
      document.documentElement.classList.add(
        "dark"
      )
    } else {
      document.documentElement.classList.remove(
        "dark"
      )
    }
  }, 140)

  setTimeout(() => {
    overlay.classList.remove(
      "theme-transition-overlay-active"
    )

    setTimeout(() => {
      overlay.remove()
    }, 700)
  }, 420)
  }

  /* BODY LOCK */

  useEffect(() => {
    if (!isMobileOpen) {
      return
    }

    const scrollY = window.scrollY

    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = "0"
    document.body.style.right = "0"
    document.body.style.width = "100%"

    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""

      window.scrollTo(0, scrollY)
    }
  }, [isMobileOpen])

  /* ACTIVE SECTION */

  useEffect(() => {
    let ticking = false

    function updateActiveSection() {
      const scrollPosition =
        window.scrollY + 140

      for (const link of navLinks) {
        const section =
          document.querySelector(
            link.href
          )

        if (!section) continue

        const sectionTop =
          section.offsetTop

        const sectionHeight =
          section.offsetHeight

        if (
          scrollPosition >=
            sectionTop &&
          scrollPosition <
            sectionTop +
              sectionHeight
        ) {
          setActiveSection(
            link.href.replace(
              "#",
              ""
            )
          )

          break
        }
      }

      ticking = false
    }

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(
          updateActiveSection
        )

        ticking = true
      }
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    )

    updateActiveSection()

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      )
  }, [navLinks])

  return createPortal(
    <>
      {/* TOP PROGRESS */}

      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[9999] h-[3px] origin-left bg-gradient-to-r from-[#05a99d] via-[#0b5cab] to-[#3ce6d8] shadow-[0_0_18px_rgba(5,169,157,0.35)]"
      />

      <motion.header
        initial={{
          y: -80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
        }}
        className="fixed left-0 right-0 top-0 z-[99990] px-2 pt-2 md:px-4 md:pt-3"
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          right: "0px",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.25rem] border border-white/70 bg-white/78 px-3 py-2 shadow-[0_14px_42px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-all duration-500 dark:border-white/10 dark:bg-[#081826]/82 dark:shadow-[0_20px_70px_rgba(0,0,0,0.45)] md:mt-4 md:rounded-[1.8rem] md:px-5 md:py-3">
          {/* LOGO */}

          <a
             href="#top"
            className="flex min-w-0 items-center gap-2.5 md:gap-3"
          >
            <motion.div
              whileHover={{
                scale: 1.03,
                rotate: 2,
              }}
              transition={{
                duration: 0.25,
              }}
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-[2px] border-transparent bg-gradient-to-br from-[#05a99d] via-[#0b5cab] to-[#3ce6d8] p-[2px] shadow-[0_8px_30px_rgba(5,169,157,0.18)] sm:h-11 sm:w-11 md:h-15 md:w-15"
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                <img
                  src="/logo.png"
                  alt="Логотип"
                  className="h-[86%] w-[86%] object-contain"
                />
              </div>
            </motion.div>

            <div className="min-w-0 max-w-[220px] leading-none">
              <h1
                className="whitespace-nowrap font-black leading-tight tracking-[-0.03em] md:text-[1.05rem]"
                style={{
                  fontSize: "0.9rem",
                }}
              >
                <span className="text-[#0b5cab] dark:text-cyan-300">
                  {t.header.brandTitle}
                </span>
              </h1>

              <p className="mt-1 hidden text-[11px] font-bold leading-[1.2] text-[#05a99d] md:block">
                {t.header.brandLine1}
                <br />
                {t.header.brandLine2}
              </p>
            </div>
          </a>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-4 lg:flex">
            {navLinks.map(
              (link) => {
                const isActive =
                  activeSection ===
                  link.href.replace(
                    "#",
                    ""
                  )

                return (
                  <a
                    key={
                      link.href
                    }
                    href={
                      link.href
                    }
                    className={`relative pb-2 text-[0.82rem] font-semibold transition ${
                      isActive
                        ? "text-[#05a99d]"
                        : "text-slate-700 hover:text-[#05a99d] dark:text-white/72"
                    }`}
                  >
                    {link.label}

                    <span
                      className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#05a99d] transition-all duration-300 ${
                        isActive
                          ? "w-full"
                          : "w-0"
                      }`}
                    />
                  </a>
                )
              }
            )}
          </nav>

          {/* DESKTOP ACTIONS */}

          <div className="hidden items-center gap-2.5 lg:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/85 text-[#12315c] shadow-lg backdrop-blur transition hover:border-[#05a99d]/40 dark:border-white/10 dark:bg-[#0d2233] dark:text-white"
            >
              {isDark ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsLangOpen(
                    !isLangOpen
                  )
                }
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-3 text-sm font-semibold text-[#12315c] shadow-lg backdrop-blur transition hover:border-[#05a99d]/50 dark:border-white/10 dark:bg-[#0d2233] dark:text-white"
              >
                <span>
                  {
                    activeLang.flag
                  }
                </span>

                <span>
                  {
                    activeLang.code
                  }
                </span>

                <ChevronDown
                  size={16}
                  className={`transition ${
                    isLangOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.96,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    className="absolute right-0 top-14 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1d2b]/96 p-2 shadow-2xl backdrop-blur-xl"
                  >
                    {languages.map(
                      (
                        lang
                      ) => (
                        <button
                          key={
                            lang.code
                          }
                          type="button"
                          onClick={() => {
                            setLanguage(
                              lang.code
                            )

                            setIsLangOpen(
                              false
                            )
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-white/82 transition hover:bg-white/6"
                        >
                          <span>
                            {
                              lang.flag
                            }
                          </span>

                          <span>
                            {
                              lang.label
                            }
                          </span>
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            onClick={() =>
              setIsMobileOpen(true)
            }
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[1rem] border border-slate-200 bg-white/85 text-[#12315c] shadow-lg backdrop-blur transition hover:border-[#05a99d]/40 dark:border-white/10 dark:bg-[#0d2233] dark:text-white sm:h-11 sm:w-11 lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* MOBILE MENU */}

        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* OVERLAY */}

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
                transition={{
                  duration: 0.22,
                }}
                onClick={() =>
                  setIsMobileOpen(
                    false
                  )
                }
                className="fixed inset-0 z-[99991] bg-[#020817]/55 backdrop-blur-md lg:hidden"
              />

              {/* DRAWER */}

              <motion.div
                initial={{
                  x: "100%",
                }}
                animate={{
                  x: 0,
                }}
                exit={{
                  x: "100%",
                }}
                transition={{
                  type: "spring",
                  damping: 28,
                  stiffness: 240,
                }}
                className="fixed right-0 top-0 z-[99992] flex h-[100dvh] max-h-[100dvh] w-[300px] flex-col overflow-hidden overscroll-contain border-l border-white/10 bg-[#071827]/96 shadow-[0_0_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:hidden"
              >
                {/* TOP */}

                <div className="brand-gradient relative overflow-hidden px-5 py-4 text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_42%)]" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-[2px] border-transparent bg-gradient-to-br from-[#05a99d] via-[#0b5cab] to-[#3ce6d8] p-[2px] shadow-lg">
                        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                          <img
                            src="/logo.png"
                            alt="Логотип"
                            className="h-[84%] w-[84%] object-contain"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[15px] font-black">
                          {
                            t.header
                              .brandTitle
                          }
                        </h3>

                        <p className="mt-0.5 text-[11px] font-medium leading-[1.15] text-white/75">
                          {
                            t.header
                              .brandLine1
                          }

                          <br />

                          {
                            t.header
                              .brandLine2
                          }
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setIsMobileOpen(
                          false
                        )
                      }
                      className="grid h-10 w-10 place-items-center rounded-2xl bg-white/12 text-white backdrop-blur transition hover:bg-white/18"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* CONTENT */}

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [-webkit-overflow-scrolling:touch] touch-pan-y">
                  {/* NAV */}

                  <div className="grid gap-2">
                    {navLinks.map(
                      (
                        link,
                        index
                      ) => {
                        const isActive =
                          activeSection ===
                          link.href.replace(
                            "#",
                            ""
                          )

                        return (
                          <motion.a
                            key={
                              link.href
                            }
                            href={
                              link.href
                            }
                            initial={{
                              opacity: 0,
                              x: 16,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            transition={{
                              delay:
                                index *
                                0.04,
                            }}
                            onClick={() =>
                              setIsMobileOpen(
                                false
                              )
                            }
                            className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                              isActive
                                ? "bg-cyan-500/10 font-bold text-cyan-300"
                                : "bg-white/5 font-medium text-white/82 hover:bg-white/[0.07]"
                            }`}
                          >
                            <span
                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                                isActive
                                  ? "brand-gradient text-white shadow-[0_0_20px_rgba(5,169,157,0.28)]"
                                  : "bg-[#0d2233] text-cyan-300 group-hover:bg-[#12314d]"
                              }`}
                            >
                              {
                                link.icon
                              }
                            </span>

                            <span>
                              {
                                link.label
                              }
                            </span>
                          </motion.a>
                        )
                      }
                    )}
                  </div>

                  {/* LANG */}

                  <div className="mt-5 rounded-[1.5rem] border border-white/6 bg-white/5 p-3">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300/75">
                      {
                        t.header
                          .languageSettings
                      }
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {languages.map(
                        (
                          lang
                        ) => {
                          const isActive =
                            activeLang.code ===
                            lang.code

                          return (
                            <button
                              key={
                                lang.code
                              }
                              type="button"
                              onClick={() =>
                                setLanguage(
                                  lang.code
                                )
                              }
                              className={`rounded-2xl px-2 py-2 text-xs font-semibold transition ${
                                isActive
                                  ? "brand-gradient text-white shadow-[0_0_20px_rgba(5,169,157,0.25)]"
                                  : "bg-[#0d2233] text-white/82"
                              }`}
                            >
                              <span className="block text-base">
                                {
                                  lang.flag
                                }
                              </span>

                              <span className="mt-0.5 block">
                                {
                                  lang.code
                                }
                              </span>
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>

                  {/* THEME */}

                  <div className="mt-3 rounded-[1.5rem] border border-white/6 bg-white/5 p-3">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300/75">
                      {
                        t.header
                          .themeSettings
                      }
                    </p>

                    <button
                      type="button"
                      onClick={
                        toggleTheme
                      }
                      className="flex w-full items-center justify-between rounded-2xl bg-[#0d2233] px-3 py-3 text-xs font-medium text-white transition hover:bg-[#12314d]"
                    >
                      <span>
                        {isDark
                          ? t.header
                              .darkTheme
                          : t.header
                              .lightTheme}
                      </span>

                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500/10 text-cyan-300">
                        {isDark ? (
                          <Sun
                            size={
                              16
                            }
                          />
                        ) : (
                          <Moon
                            size={
                              16
                            }
                          />
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                {/* FOOTER */}

                <div className="border-t border-white/6 px-4 py-3">
                  <p className="text-[10px] leading-5 text-white/40">
                    {
                      t.header
                        .copyright
                    }
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>,
    document.body
  )
}