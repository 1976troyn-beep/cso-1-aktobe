import { createContext, useContext, useEffect, useState } from "react"

import ru from "../locales/ru"
import kz from "../locales/kz"
import en from "../locales/en"

const LanguageContext = createContext(null)

const translations = {
  RU: ru,
  KZ: kz,
  EN: en,
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("site-language") || "RU"
  })

  useEffect(() => {
    localStorage.setItem("site-language", language)
  }, [language])

  const t = translations[language] || translations.RU

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    )
  }

  return context
}