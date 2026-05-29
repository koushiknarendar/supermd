export interface ContextMdInput {
  title: string
  summary: string
  concepts: { term: string; definition: string }[]
  details: string
  instructions: string
  references: { label: string; url: string }[]
}

export function generateContextMd(input: ContextMdInput): string {
  const { title, summary, concepts, details, instructions, references } = input

  const conceptsBlock = concepts
    .filter((c) => c.term.trim())
    .map((c) => `- **${c.term.trim()}**: ${c.definition.trim()}`)
    .join("\n")

  const refsBlock = references
    .filter((r) => r.label.trim())
    .map((r) => (r.url.trim() ? `- [${r.label.trim()}](${r.url.trim()})` : `- ${r.label.trim()}`))
    .join("\n")

  const sections: string[] = []

  sections.push(`# Context: ${title}`)
  sections.push(``)

  if (summary.trim()) {
    sections.push(`> ${summary.trim()}`)
    sections.push(``)
  }

  if (details.trim()) {
    sections.push(`## Overview`)
    sections.push(``)
    sections.push(details.trim())
    sections.push(``)
  }

  if (conceptsBlock) {
    sections.push(`## Key Concepts`)
    sections.push(``)
    sections.push(conceptsBlock)
    sections.push(``)
  }

  if (instructions.trim()) {
    sections.push(`## How to Use This Context`)
    sections.push(``)
    sections.push(instructions.trim())
    sections.push(``)
  }

  if (refsBlock) {
    sections.push(`## References`)
    sections.push(``)
    sections.push(refsBlock)
  }

  return sections.join("\n").trimEnd()
}

// Scrape a URL and extract key info for pre-filling the form
export interface ScrapedContext {
  title: string
  description: string
  body: string
}

export function extractContextFromScraped(scraped: ScrapedContext): Partial<ContextMdInput> {
  return {
    title: scraped.title,
    summary: scraped.description,
    details: scraped.body.slice(0, 1200).trim(),
  }
}
