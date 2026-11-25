import { useEffect, useState } from "react"
import { useLanguage } from "../context/LanguageContext"

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "")

const cachedSections = new Map()
const pendingRequests = new Map()

function getApiLanguage(language) {
  if (language === "KZ") return "kk"
  if (language === "EN") return "en"
  return "ru"
}

function fetchSections(language) {
  if (cachedSections.has(language)) {
    return Promise.resolve(cachedSections.get(language))
  }

  if (!pendingRequests.has(language)) {
    const request = fetch(`${API_URL}/api/sections?lang=${language}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Некорректный формат ответа /api/sections")
        }
        cachedSections.set(language, data)
        return data
      })
      .finally(() => {
        pendingRequests.delete(language)
      })

    pendingRequests.set(language, request)
  }

  return pendingRequests.get(language)
}

export default function useSections() {
  const { language } = useLanguage()
  const apiLanguage = getApiLanguage(language)
  const [state, setState] = useState(() => ({
    language: apiLanguage,
    sections: cachedSections.get(apiLanguage) || [],
    loading: !cachedSections.has(apiLanguage),
  }))

  useEffect(() => {
    let active = true

    if (cachedSections.has(apiLanguage)) return undefined

    fetchSections(apiLanguage)
      .then((data) => {
        if (active) {
          setState({ language: apiLanguage, sections: data, loading: false })
        }
      })
      .catch((error) => {
        console.error("Ошибка загрузки разделов:", error)
        if (active) {
          setState({ language: apiLanguage, sections: [], loading: false })
        }
      })

    return () => {
      active = false
    }
  }, [apiLanguage])

  const isCurrentLanguage = state.language === apiLanguage
  const sections = isCurrentLanguage
    ? state.sections
    : cachedSections.get(apiLanguage) || []
  const loading = isCurrentLanguage
    ? state.loading
    : !cachedSections.has(apiLanguage)

  function getSection(id) {
    return sections.find((section) => section.id === id)
  }

  return { sections, loading, getSection }
}

