import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL

export default function useSections() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadSections() {
      try {
        const res = await fetch(
          `${API_URL}/api/sections?ts=${Date.now()}`
        )

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()

        if (isMounted) {
          setSections(
            Array.isArray(data) ? data : []
          )
          setLoading(false)
        }
      } catch (error) {
        console.error(
          "Ошибка загрузки секций:",
          error
        )

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
    return sections.find(
      (section) => section.id === id
    )
  }

  return {
    sections,
    loading,
    getSection,
  }
}