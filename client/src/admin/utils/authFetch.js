const API_URL = import.meta.env.VITE_API_URL

export default async function authFetch(url, options = {}) {
  const token = localStorage.getItem("admin-token")

  const response = await fetch(`${API_URL}${url}`, {
    ...options,

    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("admin-token")

    window.location.href = "/admin"

    throw new Error("Сессия истекла")
  }

  return response
}