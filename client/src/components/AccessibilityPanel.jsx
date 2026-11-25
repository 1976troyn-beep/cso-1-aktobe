import { useEffect, useState } from "react"
import { ScanEye, X, RotateCcw } from "lucide-react"

const STORAGE_KEY = "cso-accessibility-settings"
const defaults = { size: 0, contrast: false, grayscale: false }

function readSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")
    return stored && typeof stored === "object"
      ? { size: [0, 1, 2].includes(stored.size) ? stored.size : 0, contrast: stored.contrast === true, grayscale: stored.grayscale === true }
      : defaults
  } catch {
    return defaults
  }
}

const translations = {
  RU: { title: "Версия для слабовидящих", size: "Размер текста", normal: "Обычный", large: "Крупный", larger: "Очень крупный", contrast: "Высокая контрастность", grayscale: "Чёрно-белый режим", reset: "Сбросить настройки", close: "Закрыть" },
  KZ: { title: "Нашар көретіндерге арналған нұсқа", size: "Мәтін өлшемі", normal: "Қалыпты", large: "Үлкен", larger: "Өте үлкен", contrast: "Жоғары контраст", grayscale: "Ақ-қара режим", reset: "Баптауларды қалпына келтіру", close: "Жабу" },
  EN: { title: "Accessibility settings", size: "Text size", normal: "Normal", large: "Large", larger: "Extra large", contrast: "High contrast", grayscale: "Grayscale mode", reset: "Reset settings", close: "Close" },
}

const css = `
/* Accessibility settings apply to the public site without changing its layout structure. */
html[data-a11y-size="1"] { font-size: 112.5%; }
html[data-a11y-size="2"] { font-size: 125%; }
html[data-a11y-size="1"] body :is(p, li, label, a, button, input, textarea, select):not(.cso-a11y-panel *) { letter-spacing: .01em; }
html[data-a11y-size="2"] body :is(p, li, label, a, button, input, textarea, select):not(.cso-a11y-panel *) { letter-spacing: .015em; }
html[data-a11y-contrast="true"] body { background: #fff !important; color: #111 !important; }
html[data-a11y-contrast="true"] body :is(p, h1, h2, h3, h4, h5, h6, li, label):not(.cso-a11y-panel *) { text-shadow: none !important; }
html[data-a11y-contrast="true"] body :is(a, button):not(.cso-a11y-panel *) { outline-offset: 3px; }
html[data-a11y-contrast="true"] body :is(a, button):not(.cso-a11y-panel *):focus-visible { outline: 3px solid #f59e0b !important; }
html[data-a11y-grayscale="true"] body { filter: grayscale(1); }
/* Override global heading styles only inside the mobile accessibility dialog. */
@media (max-width: 639px) {
  .cso-a11y-panel .cso-a11y-heading { font-size: 15px !important; line-height: 18px !important; font-weight: 800 !important; letter-spacing: 0 !important; margin: 0 !important; }
  .cso-a11y-panel .cso-a11y-heading-text { font-size: 15px !important; line-height: 18px !important; font-weight: 800 !important; letter-spacing: 0 !important; overflow-wrap: anywhere; }
  .cso-a11y-panel .cso-a11y-heading-icon { width: 44px !important; height: 44px !important; min-width: 44px !important; }
  .cso-a11y-panel .cso-a11y-size-button { font-size: 12px !important; line-height: 15px !important; letter-spacing: 0 !important; }
}
@media (prefers-reduced-motion: reduce) { .cso-a11y-panel * { transition: none !important; } }
`

export default function AccessibilityPanel({ open, onClose, language = "RU" }) {
  const [settings, setSettings] = useState(readSettings)
  const labels = translations[language] || translations.RU

  useEffect(() => {
    const root = document.documentElement
    root.dataset.a11ySize = String(settings.size)
    root.dataset.a11yContrast = String(settings.contrast)
    root.dataset.a11yGrayscale = String(settings.grayscale)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!open) return
    const onKey = (event) => { if (event.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <>
      <style>{css}</style>
      {open && (
        <div className="cso-a11y-panel fixed inset-0 z-[200000] flex items-start justify-center bg-slate-950/60 px-3 pt-[10vh]" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
          <section role="dialog" aria-modal="true" aria-label={labels.title} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5 sm:gap-3">
              <h2 className="cso-a11y-heading flex min-w-0 flex-1 items-center gap-2.5 text-[15px] font-extrabold leading-[18px] sm:text-lg sm:leading-[1.2]">
                <span className="cso-a11y-heading-icon grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#078b9a]/10 sm:h-10 sm:w-10">
                  <ScanEye size={28} className="text-[#078b9a] sm:h-[26px] sm:w-[26px]" />
                </span>
                <span className="cso-a11y-heading-text min-w-0">{labels.title}</span>
              </h2>
              <button type="button" onClick={onClose} aria-label={labels.close} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 hover:bg-slate-200"><X size={20} /></button>
            </div>
            <p className="mb-2 text-sm font-bold">{labels.size}</p>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {[labels.normal, labels.large, labels.larger].map((label, index) => (
                <button key={index} type="button" aria-pressed={settings.size === index} onClick={() => setSettings(s => ({ ...s, size: index }))} className={`cso-a11y-size-button min-h-12 rounded-xl border px-2 text-xs font-bold ${settings.size === index ? "border-[#078b9a] bg-[#078b9a] text-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"}`}>{label}</button>
              ))}
            </div>
            <label className="mb-3 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold">
              {labels.contrast}
              <input type="checkbox" checked={settings.contrast} onChange={e => setSettings(s => ({ ...s, contrast: e.target.checked }))} className="h-5 w-5 accent-[#078b9a]" />
            </label>
            <label className="mb-5 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold">
              {labels.grayscale}
              <input type="checkbox" checked={settings.grayscale} onChange={e => setSettings(s => ({ ...s, grayscale: e.target.checked }))} className="h-5 w-5 accent-[#078b9a]" />
            </label>
            <button type="button" onClick={() => setSettings({ ...defaults })} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-900 hover:bg-slate-200"><RotateCcw size={17} />{labels.reset}</button>
          </section>
        </div>
      )}
    </>
  )
}





