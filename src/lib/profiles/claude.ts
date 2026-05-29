import type { LLMProfile } from "@/types"

export const CLAUDE_PROFILE: LLMProfile = {
  id: "claude-default",
  name: "Claude",
  model: "claude",
  frontmatterFormat: "xml-tags",
  headingStyle: "atx",
  wrapperStyle: "xml",
  rootTag: "document",
  sectionTag: "section",
  preserveHTMLInMD: true,
  stripEmptyLines: false,
  maxConsecutiveNewlines: 2,
  contextWindow: 200000,
  warningThreshold: 0.85,
  tokenizerBackend: "claude-estimate",
  chunkingDefaults: {
    strategy: "semantic",
    fixedTokenSize: 2048,
    overlapTokens: 100,
    respectHeadings: true,
    includeMetadata: true,
  },
  injectSourceMetadata: true,
  metadataFields: ["filename", "filetype", "pagecount", "convertedAt"],
  systemNote: null,
}
