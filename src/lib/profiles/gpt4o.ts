import type { LLMProfile } from "@/types"

export const GPT4O_PROFILE: LLMProfile = {
  id: "gpt4o-default",
  name: "GPT-4o",
  model: "gpt4o",
  frontmatterFormat: "yaml",
  headingStyle: "atx",
  wrapperStyle: "none",
  rootTag: null,
  sectionTag: null,
  preserveHTMLInMD: false,
  stripEmptyLines: true,
  maxConsecutiveNewlines: 1,
  contextWindow: 128000,
  warningThreshold: 0.8,
  tokenizerBackend: "tiktoken-gpt4o",
  chunkingDefaults: {
    strategy: "semantic",
    fixedTokenSize: 1024,
    overlapTokens: 128,
    respectHeadings: true,
    includeMetadata: true,
  },
  injectSourceMetadata: true,
  metadataFields: ["filename", "filetype", "convertedAt"],
  systemNote: null,
}
