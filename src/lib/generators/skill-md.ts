export interface SkillFormData {
  name: string
  description: string
  trigger: string
  steps: string[]
  example: string
  args: string
}

function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export function generateSkillMd(data: SkillFormData): string {
  const slug = toSlug(data.name) || "my-skill"

  const stepsBlock = data.steps
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s, i) => `${i + 1}. ${s}`)
    .join("\n")

  const argsSection = data.args.trim()
    ? `\n## Arguments\n\n${data.args.trim()}\n\nAccess the user's input via \`$ARGUMENTS\`.`
    : ""

  const exampleSection = data.example.trim()
    ? `\n## Example\n\n\`\`\`\n${data.example.trim()}\n\`\`\``
    : ""

  const triggerBlock = data.trigger.trim() || "When the user asks to run this skill."

  return `---
name: ${slug}
description: ${data.description.trim() || data.name}
---

## When to use

${triggerBlock}

## Steps

${stepsBlock || "1. Perform the task"}
${argsSection}${exampleSection}
`.trimEnd()
}

export { toSlug }
