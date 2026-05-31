export interface DesignData {
  name: string
  summary: string
  context: string
  problem: string
  solution: string
  decisions: string[]
  dataModel: string
  apiDesign: string
  uiChanges: string
  risks: string
  successMetrics: string
}

export function generateDesignMd(data: DesignData): string {
  const parts: string[] = []

  const title = data.name.trim() || "Feature"
  parts.push(`# ${title} — Design Doc`)

  if (data.summary.trim()) {
    parts.push(`> ${data.summary.trim()}`)
  }

  if (data.context.trim()) {
    parts.push(`## Context\n\n${data.context.trim()}`)
  }

  if (data.problem.trim()) {
    parts.push(`## Problem\n\n${data.problem.trim()}`)
  }

  if (data.solution.trim()) {
    parts.push(`## Proposed Solution\n\n${data.solution.trim()}`)
  }

  const decisions = data.decisions.map((d) => d.trim()).filter(Boolean)
  if (decisions.length) {
    parts.push(
      `## Key Design Decisions\n\n${decisions.map((d, i) => `${i + 1}. ${d}`).join("\n")}`
    )
  }

  if (data.dataModel.trim()) {
    parts.push(`## Data Model\n\n\`\`\`\n${data.dataModel.trim()}\n\`\`\``)
  }

  if (data.apiDesign.trim()) {
    parts.push(`## API Design\n\n\`\`\`\n${data.apiDesign.trim()}\n\`\`\``)
  }

  if (data.uiChanges.trim()) {
    parts.push(`## UI Changes\n\n${data.uiChanges.trim()}`)
  }

  if (data.risks.trim()) {
    parts.push(`## Risks & Tradeoffs\n\n${data.risks.trim()}`)
  }

  if (data.successMetrics.trim()) {
    parts.push(`## Success Metrics\n\n${data.successMetrics.trim()}`)
  }

  parts.push(`## Open Questions\n\n- [ ] `)

  return parts.join("\n\n")
}
