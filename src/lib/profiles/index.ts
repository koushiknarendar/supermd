import type { LLMProfile, ConversionMetadata } from "@/types"
import { CLAUDE_PROFILE } from "./claude"
import { GPT4O_PROFILE } from "./gpt4o"
import { GEMINI_PROFILE } from "./gemini"
import { RAW_PROFILE } from "./raw"

export { CLAUDE_PROFILE, GPT4O_PROFILE, GEMINI_PROFILE, RAW_PROFILE }

export const ALL_PROFILES: LLMProfile[] = [
  CLAUDE_PROFILE,
  GPT4O_PROFILE,
  GEMINI_PROFILE,
  RAW_PROFILE,
]

export function getProfileById(id: string): LLMProfile {
  return ALL_PROFILES.find((p) => p.id === id) ?? CLAUDE_PROFILE
}

function buildYamlFrontmatter(
  profile: LLMProfile,
  metadata: ConversionMetadata
): string {
  const lines: string[] = ["---"]
  if (profile.metadataFields.includes("filename")) lines.push(`source: "${metadata.filename}"`)
  if (profile.metadataFields.includes("filetype")) lines.push(`filetype: ${metadata.filetype}`)
  if (profile.metadataFields.includes("pagecount") && metadata.pageCount !== null)
    lines.push(`pages: ${metadata.pageCount}`)
  if (profile.metadataFields.includes("convertedAt")) lines.push(`converted_at: "${metadata.convertedAt}"`)
  lines.push("---")
  return lines.join("\n")
}

function buildXmlMetadata(profile: LLMProfile, metadata: ConversionMetadata): string {
  const lines: string[] = ["<metadata>"]
  if (profile.metadataFields.includes("filename")) lines.push(`  <source>${metadata.filename}</source>`)
  if (profile.metadataFields.includes("filetype")) lines.push(`  <filetype>${metadata.filetype}</filetype>`)
  if (profile.metadataFields.includes("pagecount") && metadata.pageCount !== null)
    lines.push(`  <pages>${metadata.pageCount}</pages>`)
  if (profile.metadataFields.includes("convertedAt")) lines.push(`  <converted_at>${metadata.convertedAt}</converted_at>`)
  lines.push("</metadata>")
  return lines.join("\n")
}

function collapseNewlines(text: string, max: number): string {
  const pattern = new RegExp(`\n{${max + 1},}`, "g")
  return text.replace(pattern, "\n".repeat(max))
}

function stripExcessEmptyLines(text: string): string {
  return text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n")
}

export function applyProfile(
  rawMarkdown: string,
  profile: LLMProfile,
  metadata: ConversionMetadata
): string {
  if (profile.model === "raw") return rawMarkdown

  let content = rawMarkdown

  // Normalize newlines
  content = collapseNewlines(content, profile.maxConsecutiveNewlines)
  if (profile.stripEmptyLines) {
    content = stripExcessEmptyLines(content)
  }

  // Build metadata block
  let metaBlock = ""
  if (profile.injectSourceMetadata && profile.metadataFields.length > 0) {
    if (profile.frontmatterFormat === "yaml") {
      metaBlock = buildYamlFrontmatter(profile, metadata)
    } else if (profile.frontmatterFormat === "xml-tags") {
      metaBlock = buildXmlMetadata(profile, metadata)
    }
  }

  // Wrap in root/section tags for Claude
  if (profile.wrapperStyle === "xml" && profile.rootTag) {
    const inner = profile.sectionTag
      ? `<${profile.sectionTag}>\n${content}\n</${profile.sectionTag}>`
      : content
    content = `<${profile.rootTag}>\n${inner}\n</${profile.rootTag}>`
  }

  // Prepend system note if present
  const systemPart = profile.systemNote ? `${profile.systemNote}\n\n` : ""

  // Combine
  if (metaBlock) {
    return `${systemPart}${metaBlock}\n\n${content}`
  }
  return `${systemPart}${content}`
}
