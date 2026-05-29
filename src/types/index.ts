export type LLMModel = "claude" | "gpt4o" | "gemini" | "raw"

export type FrontmatterFormat = "yaml" | "xml-tags" | "none"
export type HeadingStyle = "atx" | "setext"
export type WrapperStyle = "xml" | "none"
export type TokenizerBackend =
  | "tiktoken-gpt4o"
  | "claude-estimate"
  | "gemini-estimate"
  | "none"

export interface ChunkingDefaults {
  strategy: "fixed" | "semantic" | "none"
  fixedTokenSize: 512 | 1024 | 2048 | 4096
  overlapTokens: number
  respectHeadings: boolean
  includeMetadata: boolean
}

export interface LLMProfile {
  id: string
  name: string
  model: LLMModel
  frontmatterFormat: FrontmatterFormat
  headingStyle: HeadingStyle
  wrapperStyle: WrapperStyle
  rootTag: string | null
  sectionTag: string | null
  preserveHTMLInMD: boolean
  stripEmptyLines: boolean
  maxConsecutiveNewlines: number
  contextWindow: number
  warningThreshold: number
  tokenizerBackend: TokenizerBackend
  chunkingDefaults: ChunkingDefaults
  injectSourceMetadata: boolean
  metadataFields: (
    | "filename"
    | "filetype"
    | "pagecount"
    | "convertedAt"
    | "chunkIndex"
    | "totalChunks"
  )[]
  systemNote: string | null
}

export interface MarkdownChunk {
  index: number
  content: string
  tokenCount: number
  startOffset: number
  endOffset: number
  heading: string | null
  metadata: Record<string, string>
}

export interface ConversionMetadata {
  filename: string
  filetype: "pdf" | "docx" | "xlsx" | "image" | "html" | "unknown"
  filesize: number
  convertedAt: string
  processingTier: "client" | "server"
  processingDurationMs: number
  pageCount: number | null
}

export interface ConversionResult {
  rawMarkdown: string
  formattedMarkdown: string
  /** Token estimate of the file before SuperMD noise removal — the "without us" baseline */
  fileTokenEstimate: number
  rawTokenEstimate: number
  tokenCount: number
  tokensSaved: number
  contextWindowPercent: number
  wordCount: number
  chunks: MarkdownChunk[] | null
  metadata: ConversionMetadata
}

export type ConversionStatus =
  | "idle"
  | "converting"
  | "profiling"
  | "done"
  | "error"

export interface ModelPricing {
  model: LLMModel
  label: string
  inputPricePerMillionTokens: number
}

export const MODEL_PRICING: ModelPricing[] = [
  { model: "claude", label: "Claude Sonnet 4.6", inputPricePerMillionTokens: 3.0 },
  { model: "gpt4o", label: "GPT-4o", inputPricePerMillionTokens: 2.5 },
  { model: "gemini", label: "Gemini 1.5 Pro", inputPricePerMillionTokens: 1.25 },
]
