import type { BrandColor, BrandFont } from "./brand-md"
import type { ExtractedDesign } from "./style-md"

export type { BrandColor, BrandFont }
export type { ExtractedDesign }

export interface ProjectData {
  name: string
  tagline: string
  mission: string
  vision: string
  values: string[]
  audience: string
  colors: BrandColor[]
  fonts: BrandFont[]
  personality: string
  tone: string
  useWords: string
  avoidWords: string
  design: ExtractedDesign | null
}

function isColorValue(v: string): boolean {
  return /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\()/i.test(v)
}

function cssBlock(pairs: [string, string][]): string {
  return "```css\n" + pairs.map(([k, v]) => `${k}: ${v};`).join("\n") + "\n```"
}

export function colorsFromDesign(design: ExtractedDesign): BrandColor[] {
  const result: BrandColor[] = []

  // Prefer named CSS color variables
  for (const [key, value] of Object.entries(design.customProperties)) {
    if (key.startsWith("--tw-")) continue
    const k = key.toLowerCase()
    if ((k.includes("color") || k.includes("-bg") || k.includes("background")) && isColorValue(value)) {
      const name = key
        .replace(/^--(?:color-?|bg-?)?/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim() || key
      result.push({ name, hex: value, usage: "" })
      if (result.length >= 8) break
    }
  }

  // Fall back to raw hex palette
  if (result.length === 0) {
    design.colors.slice(0, 6).forEach((hex, i) => {
      result.push({ name: `Color ${i + 1}`, hex, usage: "" })
    })
  }

  return result
}

export function fontsFromDesign(design: ExtractedDesign): BrandFont[] {
  const result: BrandFont[] = []
  const seen = new Set<string>()

  // Google Fonts
  for (const font of design.googleFonts) {
    if (!seen.has(font)) {
      seen.add(font)
      result.push({ role: result.length === 0 ? "Primary" : "Secondary", family: font, notes: "Google Fonts" })
    }
    if (result.length >= 2) break
  }

  // CSS font variables
  for (const [key, value] of Object.entries(design.customProperties)) {
    if (key.startsWith("--tw-")) continue
    const k = key.toLowerCase()
    if (k.includes("font") && !k.includes("size") && !k.includes("weight") && !k.includes("style")) {
      const family = value.split(",")[0].replace(/['"]/g, "").trim()
      if (family && !seen.has(family) && family.length < 60) {
        seen.add(family)
        const role = key.replace(/^--font-?/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim() || "Custom"
        result.push({ role, family, notes: value.length < 80 ? value : "" })
      }
      if (result.length >= 4) break
    }
  }

  // Fallback to font families
  if (result.length === 0) {
    const roles = ["Primary", "Secondary", "Mono"]
    design.fontFamilies.slice(0, 3).forEach((family, i) => {
      if (!seen.has(family)) {
        seen.add(family)
        result.push({ role: roles[i] || `Font ${i + 1}`, family, notes: "" })
      }
    })
  }

  return result
}

export function generateProjectMd(data: ProjectData): string {
  const parts: string[] = []
  const { design } = data

  const name = data.name.trim()
  parts.push(`# ${name} — Project Context`)

  if (data.tagline.trim()) {
    parts.push(`> ${data.tagline.trim()}`)
  }

  // Identity
  const identityLines: string[] = []
  if (data.mission.trim()) identityLines.push(`**Mission**: ${data.mission.trim()}`)
  if (data.vision.trim()) identityLines.push(`**Vision**: ${data.vision.trim()}`)
  if (identityLines.length) {
    parts.push(`## Identity\n\n${identityLines.join("\n\n")}`)
  }

  // Values
  const values = data.values.map((v) => v.trim()).filter(Boolean)
  if (values.length) {
    const lines = values.map((v, i) => {
      const [title, ...rest] = v.split("—").map((s) => s.trim())
      return rest.length ? `${i + 1}. **${title}** — ${rest.join("—")}` : `${i + 1}. **${title}**`
    })
    parts.push(`## Brand Values\n\n${lines.join("\n")}`)
  }

  // Audience
  if (data.audience.trim()) {
    parts.push(`## Target Audience\n\n${data.audience.trim()}`)
  }

  // Visual design
  const visualParts: string[] = []

  // Manual colors
  const colors = data.colors.filter((c) => c.name.trim() || c.hex.trim())
  if (colors.length) {
    const rows = colors.map((c) => {
      const hex = c.hex.trim() || "—"
      const n = c.name.trim() || hex
      return `| ${n} | \`${hex}\` | ${c.usage.trim()} |`
    })
    visualParts.push(`### Color Palette\n\n| Name | Hex | Usage |\n|------|-----|-------|\n${rows.join("\n")}`)
  }

  // Manual fonts
  const fonts = data.fonts.filter((f) => f.family.trim())
  if (fonts.length) {
    const rows = fonts.map((f) => `| ${f.role.trim() || "—"} | ${f.family.trim()} | ${f.notes.trim()} |`)
    visualParts.push(`### Typography\n\n| Role | Font | Notes |\n|------|------|-------|\n${rows.join("\n")}`)
  }

  // Extracted design tokens
  if (design) {
    let hostname = design.url
    try { hostname = new URL(design.url).hostname.replace(/^www\./, "") } catch { /* ignore */ }

    // CSS custom properties (non-tw)
    const allNonTw = Object.entries(design.customProperties).filter(([k]) => !k.startsWith("--tw-"))
    if (allNonTw.length) {
      visualParts.push(`### Design Tokens (${hostname})\n\n${cssBlock(allNonTw as [string, string][])}`)
    }

    // Font size scale
    if (design.fontSizes.length) {
      visualParts.push(`### Font Size Scale\n\n${design.fontSizes.map((s) => `\`${s}\``).join(" · ")}`)
    }

    // Radii
    if (design.radii.length) {
      visualParts.push(`### Border Radius\n\n${design.radii.map((r) => `\`${r}\``).join(" · ")}`)
    }

    // Shadows
    if (design.shadows.length) {
      visualParts.push(`### Shadows\n\n${design.shadows.slice(0, 5).map((s) => `- \`${s}\``).join("\n")}`)
    }
  }

  if (visualParts.length) {
    parts.push(`## Visual Design\n\n${visualParts.join("\n\n")}`)
  }

  // Voice & tone
  const voiceParts: string[] = []
  const traits = data.personality.split(/[,;·•|]+/).map((t) => t.trim()).filter(Boolean)
  if (traits.length) voiceParts.push(`**Personality**: ${traits.join(" · ")}`)
  if (data.tone.trim()) voiceParts.push(`**Tone**: ${data.tone.trim()}`)

  const useWords = data.useWords.split(/[,;\n]+/).map((w) => w.trim()).filter(Boolean)
  if (useWords.length) voiceParts.push(`### Use\n${useWords.map((w) => `- ${w}`).join("\n")}`)

  const avoidWords = data.avoidWords.split(/[,;\n]+/).map((w) => w.trim()).filter(Boolean)
  if (avoidWords.length) voiceParts.push(`### Avoid\n${avoidWords.map((w) => `- ${w}`).join("\n")}`)

  if (voiceParts.length) {
    parts.push(`## Voice & Tone\n\n${voiceParts.join("\n\n")}`)
  }

  // Attribution
  if (design) {
    parts.push(`---\n*Design tokens extracted from ${design.url}*`)
  }

  return parts.join("\n\n")
}
