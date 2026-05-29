import type { LLMProfile } from "@/types"

export const RAW_PROFILE: LLMProfile = {
  id: "raw",
  name: "Raw",
  model: "raw",
  frontmatterFormat: "none",
  headingStyle: "atx",
  wrapperStyle: "none",
  rootTag: null,
  sectionTag: null,
  preserveHTMLInMD: false,
  stripEmptyLines: false,
  maxConsecutiveNewlines: 3,
  contextWindow: 200000,
  warningThreshold: 0.9,
  tokenizerBackend: "none",
  chunkingDefaults: {
    strategy: "none",
    fixedTokenSize: 1024,
    overlapTokens: 0,
    respectHeadings: false,
    includeMetadata: false,
  },
  injectSourceMetadata: false,
  metadataFields: [],
  systemNote: null,
}
