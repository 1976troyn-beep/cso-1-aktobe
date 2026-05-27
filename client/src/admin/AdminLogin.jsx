import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({
    login: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Ошибка входа")
      }

      localStorage.setItem("admin-token", data.token)
      onLogin()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#071827] px-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      >
        <h1 className="text-3xl font-black">Вход в админ-панель</h1>

        <p className="mt-2 text-sm text-white/60">
          Введите логин и пароль администратора.
        </p>

        <div className="mt-7 grid gap-4">
          <input
            name="login"
            value={form.login}
            onChange={handleChange}
            placeholder="Логин"
            className="rounded-2xl border border-white/10 bg-[#10283d] px-4 py-3 text-white outline-none transition focus:border-cyan-300"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Пароль"
            className="rounded-2xl border border-white/10 bg-[#10283d] px-4 py-3 text-white outline-none transition focus:border-cyan-300"
            required
          />
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-cyan-400 px-6 py-4 text-sm font-black text-[#071827] transition hover:bg-cyan-300 disabled:opacity-60"
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  )
}