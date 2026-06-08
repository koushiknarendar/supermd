export type PromptTarget = "claude" | "gpt" | "universal"

export interface ExamplePair {
  input: string
  output: string
}

export interface PromptFormData {
  role: string
  task: string
  context: string
  constraints: string[]
  tone: string
  length: string
  format: string
  formatExtra: string
  examples: ExamplePair[]
}

const TONE_LINE: Record<string, string> = {
  professional: "Write in a professional, authoritative tone.",
  friendly: "Write in a warm, approachable, conversational tone.",
  technical: "Use precise technical language. Assume the reader has domain expertise.",
  concise: "Be maximally concise. Omit any unnecessary words.",
  empathetic: "Lead with empathy. Acknowledge the user's situation before responding.",
}

const LENGTH_LINE: Record<string, string> = {
  brief: "Keep responses under 150 words unless the question clearly demands more.",
  standard: "Match response length to the complexity of the question.",
  detailed: "Provide thorough, comprehensive responses. Explain your reasoning.",
  adaptive: "Adapt length to what the user asks for — terse for simple questions, detailed for complex ones.",
}

const FORMAT_LINE: Record<string, string> = {
  prose: "Write in flowing prose paragraphs.",
  bullets: "Use bullet points for all multi-item content.",
  numbered: "Use numbered lists for steps and sequences.",
  mixed: "Use the format that best fits the content — prose for explanation, bullets for lists, code blocks for code.",
}

function buildOutputFormatBlock(data: PromptFormData): string[] {
  const lines: string[] = []
  if (data.tone && TONE_LINE[data.tone]) lines.push(`- ${TONE_LINE[data.tone]}`)
  if (data.length && LENGTH_LINE[data.length]) lines.push(`- ${LENGTH_LINE[data.length]}`)
  if (data.format && FORMAT_LINE[data.format]) lines.push(`- ${FORMAT_LINE[data.format]}`)
  if (data.formatExtra.trim()) lines.push(`- ${data.formatExtra.trim()}`)
  return lines
}

function buildConstraintLines(constraints: string[]): string[] {
  return constraints.map((c) => c.trim()).filter(Boolean).map((c) => `- ${c}`)
}

function roleStatement(role: string): string {
  const clean = role.trim()
  if (!clean) return ""
  const lower = clean.toLowerCase()
  if (lower.startsWith("you are")) return clean
  return `You are ${clean}.`
}

// ── Claude: XML tag style ──────────────────────────────────────────────────
function buildClaude(data: PromptFormData): string {
  const parts: string[] = []
  const role = roleStatement(data.role)
  const constraints = buildConstraintLines(data.constraints)
  const formatLines = buildOutputFormatBlock(data)
  const examples = data.examples.filter((e) => e.input.trim() || e.output.trim())

  if (role) parts.push(`<role>\n${role}\n</role>`)
  if (data.context.trim()) parts.push(`<context>\n${data.context.trim()}\n</context>`)
  if (data.task.trim()) parts.push(`<task>\n${data.task.trim()}\n</task>`)
  if (constraints.length) parts.push(`<constraints>\n${constraints.join("\n")}\n</constraints>`)
  if (formatLines.length) parts.push(`<output_format>\n${formatLines.join("\n")}\n</output_format>`)

  if (examples.length) {
    const exBlock = examples.map((e) => {
      const lines = []
      if (e.input.trim()) lines.push(`  <user>${e.input.trim()}</user>`)
      if (e.output.trim()) lines.push(`  <assistant>${e.output.trim()}</assistant>`)
      return `<example>\n${lines.join("\n")}\n</example>`
    })
    parts.push(exBlock.join("\n\n"))
  }

  return parts.join("\n\n")
}

// ── GPT / Gemini: Markdown header style ───────────────────────────────────
function buildGpt(data: PromptFormData): string {
  const parts: string[] = []
  const role = roleStatement(data.role)
  const constraints = buildConstraintLines(data.constraints)
  const formatLines = buildOutputFormatBlock(data)
  const examples = data.examples.filter((e) => e.input.trim() || e.output.trim())

  if (role) parts.push(`# Role\n\n${role}`)
  if (data.context.trim()) parts.push(`## Context\n\n${data.context.trim()}`)
  if (data.task.trim()) parts.push(`## Task\n\n${data.task.trim()}`)
  if (constraints.length) parts.push(`## Constraints\n\n${constraints.join("\n")}`)
  if (formatLines.length) parts.push(`## Output Format\n\n${formatLines.join("\n")}`)

  if (examples.length) {
    const exBlock = examples.map((e, i) => {
      const lines = [`### Example ${i + 1}`]
      if (e.input.trim()) lines.push(`**User:** ${e.input.trim()}`)
      if (e.output.trim()) lines.push(`\n**Assistant:** ${e.output.trim()}`)
      return lines.join("\n\n")
    })
    parts.push(`## Examples\n\n${exBlock.join("\n\n---\n\n")}`)
  }

  return parts.join("\n\n")
}

// ── Universal: plain text ──────────────────────────────────────────────────
function buildUniversal(data: PromptFormData): string {
  const parts: string[] = []
  const role = roleStatement(data.role)
  const constraints = buildConstraintLines(data.constraints)
  const formatLines = buildOutputFormatBlock(data)
  const examples = data.examples.filter((e) => e.input.trim() || e.output.trim())

  if (role) parts.push(`ROLE\n${role}`)
  if (data.context.trim()) parts.push(`CONTEXT\n${data.context.trim()}`)
  if (data.task.trim()) parts.push(`TASK\n${data.task.trim()}`)
  if (constraints.length) parts.push(`CONSTRAINTS\n${constraints.join("\n")}`)
  if (formatLines.length) parts.push(`OUTPUT FORMAT\n${formatLines.join("\n")}`)

  if (examples.length) {
    const exBlock = examples.map((e, i) => {
      const lines = [`EXAMPLE ${i + 1}`]
      if (e.input.trim()) lines.push(`User: ${e.input.trim()}`)
      if (e.output.trim()) lines.push(`Assistant: ${e.output.trim()}`)
      return lines.join("\n")
    })
    parts.push(exBlock.join("\n\n"))
  }

  return parts.join("\n\n")
}

export function generatePromptMd(data: PromptFormData, target: PromptTarget): string {
  switch (target) {
    case "claude": return buildClaude(data)
    case "gpt": return buildGpt(data)
    case "universal": return buildUniversal(data)
  }
}
