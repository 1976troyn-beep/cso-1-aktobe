import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Analytics } from "@vercel/analytics/react"

import App from "./App.jsx"

import "./index.css"

const rootElement =
  document.getElementById("root")

if (!rootElement) {
  throw new Error(
    "Root element not found"
  )
}

window.history.scrollRestoration =
  "manual"

createRoot(rootElement).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
)