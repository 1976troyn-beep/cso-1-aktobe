export const isDocx = b => String(b.format || "").toLowerCase() === "docx" || /\.docx(?:$|[?#])/i.test(b.src || "") || /\.docx$/i.test(b.name || "")
export function documentTitle(b) {
  const value = b.title || b.name || "Документ"
  if (!/[ÐÑ]/.test(value)) return value
  try { return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(value, c => c.charCodeAt(0))) } catch { return value }
}