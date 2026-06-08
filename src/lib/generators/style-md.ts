export interface ExtractedDesign {
  url: string
  title: string
  googleFonts: string[]
  customProperties: Record<string, string>
  fontFamilies: string[]
  colors: string[]
  fontSizes: string[]
  radii: string[]
  shadows: string[]
  bodyBg?: string
  bodyColor?: string
}

function isColorValue(v: string): boolean {
  return /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\(|color\()/i.test(v)
}

function groupCustomProperties(props: Record<string, string>) {
  const colors: [string, string][] = []
  const fonts: [string, string][] = []
  const spacing: [string, string][] = []
  const radii: [string, string][] = []
  const shadows: [string, string][] = []
  const other: [string, string][] = []

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("--tw-")) continue
    const k = key.toLowerCase()
    if (k.includes("color") || k.includes("-bg") || k.includes("background") || k.includes("fill") || k.includes("stroke") || isColorValue(value)) {
      colors.push([key, value])
    } else if (k.includes("font") || k.includes("text-") || k.includes("heading") || k.includes("type")) {
      fonts.push([key, value])
    } else if (k.includes("radius") || k.includes("rounded")) {
      radii.push([key, value])
    } else if (k.includes("shadow")) {
      shadows.push([key, value])
    } else if (k.includes("space") || k.includes("gap") || k.includes("padding") || k.includes("margin") || /-(size|width|height|offset)/.test(k)) {
      spacing.push([key, value])
    } else {
      other.push([key, value])
    }
  }

  return { colors, fonts, spacing, radii, shadows, other }
}

function cssBlock(pairs: [string, string][]): string {
  return "```css\n" + pairs.map(([k, v]) => `${k}: ${v};`).join("\n") + "\n```"
}

export function generateStyleMd(data: ExtractedDesign): string {
  const parts: string[] = []

  let hostname = data.url
  try { hostname = new URL(data.url).hostname.replace(/^www\./, "") } catch { /* keep raw */ }
  const siteName = data.title ? `${data.title} (${hostname})` : hostname

  parts.push(`# Design System — ${siteName}`)
  parts.push(`> Source: ${data.url}`)

  const grouped = groupCustomProperties(data.customProperties)

  // Typography
  const fontLines: string[] = []
  if (data.googleFonts.length) {
    fontLines.push(`**Google Fonts**: ${data.googleFonts.join(", ")}`)
  }
  if (data.fontFamilies.length) {
    fontLines.push("**Font Families**")
    data.fontFamilies.slice(0, 6).forEach(f => fontLines.push(`- \`${f}\``))
  }
  if (grouped.fonts.length) {
    fontLines.push("**CSS Font Variables**")
    fontLines.push(cssBlock(grouped.fonts))
  }
  if (data.fontSizes.length) {
    fontLines.push(`**Size Scale**: ${data.fontSizes.map(s => `\`${s}\``).join(" · ")}`)
  }
  if (data.bodyColor) {
    fontLines.push(`**Body text**: \`${data.bodyColor}\``)
  }
  if (fontLines.length) {
    parts.push(`## Typography\n\n${fontLines.join("\n")}`)
  }

  // Colors
  const colorLines: string[] = []
  if (data.bodyBg) colorLines.push(`**Background**: \`${data.bodyBg}\``)
  if (data.bodyColor) colorLines.push(`**Text**: \`${data.bodyColor}\``)
  if (grouped.colors.length) {
    colorLines.push("**CSS Color Variables**")
    colorLines.push(cssBlock(grouped.colors))
  }
  if (data.colors.length) {
    colorLines.push(`**Palette** (by frequency)`)
    colorLines.push(data.colors.map(c => `\`${c}\``).join(" · "))
  }
  if (colorLines.length) {
    parts.push(`## Colors\n\n${colorLines.join("\n")}`)
  }

  // Spacing
  if (grouped.spacing.length) {
    parts.push(`## Spacing & Sizing\n\n${cssBlock(grouped.spacing)}`)
  }

  // Border Radius
  const radiusLines: string[] = []
  if (grouped.radii.length) {
    radiusLines.push(cssBlock(grouped.radii))
  }
  if (data.radii.length) {
    radiusLines.push(`**Values found**: ${data.radii.map(r => `\`${r}\``).join(" · ")}`)
  }
  if (radiusLines.length) {
    parts.push(`## Border Radius\n\n${radiusLines.join("\n")}`)
  }

  // Shadows
  const shadowLines: string[] = []
  if (grouped.shadows.length) {
    shadowLines.push(cssBlock(grouped.shadows))
  }
  if (data.shadows.length) {
    data.shadows.slice(0, 5).forEach(s => shadowLines.push(`- \`${s}\``))
  }
  if (shadowLines.length) {
    parts.push(`## Shadows\n\n${shadowLines.join("\n")}`)
  }

  // Other CSS vars
  if (grouped.other.length) {
    parts.push(`## Other Tokens\n\n${cssBlock(grouped.other)}`)
  }

  // Full dump of all non-tw custom properties
  const allNonTw = Object.entries(data.customProperties).filter(([k]) => !k.startsWith("--tw-"))
  if (allNonTw.length > 8) {
    parts.push(`## All CSS Custom Properties\n\n` + cssBlock(allNonTw as [string, string][]))
  }

  if (parts.length <= 2) {
    parts.push("## Notes\n\nNo CSS custom properties found. This site may use Tailwind utility classes or CSS-in-JS without design tokens. The palette and font information above was extracted from raw stylesheet values.")
  }

  return parts.join("\n\n")
}
