import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL

let cachedSections = null
let sectionsRequest = null

export default function useSections() {
  const [sections, setSections] = useState(cachedSections || [])
  const [loading, setLoading] = useState(!cachedSections)

  useEffect(() => {
    let isMounted = true

    async function loadSections() {
      try {
        if (cachedSections) {
          setSections(cachedSections)
          setLoading(false)
          return
        }

        if (!sectionsRequest) {
          sectionsRequest = fetch(`${API_URL}/api/sections`)
            .then((res) => {
              if (!res.ok) {
                throw new Error(`HTTP ${res.status}`)
              }

              return res.json()
            })
            .then((data) => {
              const preparedData = Array.isArray(data) ? data : []
              cachedSections = preparedData
              return preparedData
            })
            .catch((error) => {
              sectionsRequest = null
              throw error
            })
        }

        const data = await sectionsRequest

        if (isMounted) {
          setSections(data)
          setLoading(false)
        }
      } catch (error) {
        console.error("Ошибка загрузки секций:", error)

        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSections()

    return () => {
      isMounted = false
    }
  }, [])

  function getSection(id) {
    return sections.find((section) => section.id === id)
  }

  return {
    sections,
    loading,
    getSection,
  }
}