import type { LLMProfile } from "@/types"

export const GEMINI_PROFILE: LLMProfile = {
  id: "gemini-default",
  name: "Gemini",
  model: "gemini",
  frontmatterFormat: "yaml",
  headingStyle: "atx",
  wrapperStyle: "none",
  rootTag: null,
  sectionTag: null,
  preserveHTMLInMD: false,
  stripEmptyLines: false,
  maxConsecutiveNewlines: 2,
  contextWindow: 1000000,
  warningThreshold: 0.9,
  tokenizerBackend: "gemini-estimate",
  chunkingDefaults: {
    strategy: "none",
    fixedTokenSize: 4096,
    overlapTokens: 256,
    respectHeadings: true,
    includeMetadata: false,
  },
  injectSourceMetadata: true,
  metadataFields: ["filename", "filetype"],
  systemNote: null,
}
