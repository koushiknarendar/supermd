export interface BrandColor {
  name: string
  hex: string
  usage: string
}

export interface BrandFont {
  role: string
  family: string
  notes: string
}

export interface BrandData {
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
  logoNotes: string
  imageryNotes: string
}

export function generateBrandMd(data: BrandData): string {
  const parts: string[] = []

  const name = data.name.trim()
  parts.push(`# ${name} Brand Guidelines`)

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
      return rest.length
        ? `${i + 1}. **${title}** — ${rest.join("—")}`
        : `${i + 1}. **${title}**`
    })
    parts.push(`## Brand Values\n\n${lines.join("\n")}`)
  }

  // Target audience
  if (data.audience.trim()) {
    parts.push(`## Target Audience\n\n${data.audience.trim()}`)
  }

  // Visual identity
  const visualParts: string[] = []

  const colors = data.colors.filter((c) => c.name.trim() || c.hex.trim())
  if (colors.length) {
    const rows = colors.map((c) => {
      const hex = c.hex.trim() || "—"
      const name = c.name.trim() || hex
      const usage = c.usage.trim() || ""
      return `| ${name} | \`${hex}\` | ${usage} |`
    })
    visualParts.push(
      `### Color Palette\n\n| Name | Hex | Usage |\n|------|-----|-------|\n${rows.join("\n")}`
    )
  }

  const fonts = data.fonts.filter((f) => f.family.trim())
  if (fonts.length) {
    const rows = fonts.map((f) => {
      const role = f.role.trim() || "—"
      const family = f.family.trim()
      const notes = f.notes.trim() || ""
      return `| ${role} | ${family} | ${notes} |`
    })
    visualParts.push(
      `### Typography\n\n| Role | Font | Notes |\n|------|------|-------|\n${rows.join("\n")}`
    )
  }

  if (data.logoNotes.trim()) {
    visualParts.push(`### Logo Usage\n\n${data.logoNotes.trim()}`)
  }

  if (data.imageryNotes.trim()) {
    visualParts.push(`### Imagery\n\n${data.imageryNotes.trim()}`)
  }

  if (visualParts.length) {
    parts.push(`## Visual Identity\n\n${visualParts.join("\n\n")}`)
  }

  // Voice & tone
  const voiceParts: string[] = []

  const traits = data.personality.split(/[,;·•|]+/).map((t) => t.trim()).filter(Boolean)
  if (traits.length) {
    voiceParts.push(`**Personality**: ${traits.join(" · ")}`)
  }

  if (data.tone.trim()) {
    voiceParts.push(`**Tone**: ${data.tone.trim()}`)
  }

  const useWords = data.useWords.split(/[,;\n]+/).map((w) => w.trim()).filter(Boolean)
  if (useWords.length) {
    voiceParts.push(`### Use\n${useWords.map((w) => `- ${w}`).join("\n")}`)
  }

  const avoidWords = data.avoidWords.split(/[,;\n]+/).map((w) => w.trim()).filter(Boolean)
  if (avoidWords.length) {
    voiceParts.push(`### Avoid\n${avoidWords.map((w) => `- ${w}`).join("\n")}`)
  }

  if (voiceParts.length) {
    parts.push(`## Voice & Tone\n\n${voiceParts.join("\n\n")}`)
  }

  return parts.join("\n\n")
}
