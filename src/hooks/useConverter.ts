"use client"

import { useState, useCallback, useRef } from "react"
import type { ConversionResult, ConversionStatus, LLMProfile, ConversionMetadata } from "@/types"
import { applyProfile } from "@/lib/profiles"
import { estimateClaudeTokens, estimateGeminiTokens, estimateTokens } from "@/lib/tokenizers/estimate"

function detectFiletype(file: File): ConversionMetadata["filetype"] {
  const name = file.name.toLowerCase()
  if (name.endsWith(".docx") || name.endsWith(".doc")) return "docx"
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) return "xlsx"
  if (name.endsWith(".pdf")) return "pdf"
  if (name.endsWith(".html") || name.endsWith(".htm")) return "html"
  if (
    file.type.startsWith("image/") ||
    [".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff", ".bmp"].some((ext) =>
      name.endsWith(ext)
    )
  )
    return "image"
  return "unknown"
}

function countTokens(text: string, backend: LLMProfile["tokenizerBackend"]): number {
  switch (backend) {
    case "claude-estimate":
      return estimateClaudeTokens(text)
    case "gemini-estimate":
      return estimateGeminiTokens(text)
    default:
      return estimateTokens(text)
  }
}

// How many times more tokens a raw file costs vs clean extracted text.
// PDFs repeat headers/footers/page numbers every page.
// DOCX has XML markup wrapping every paragraph.
// XLSX has repeated column headers and cell metadata.
const NOISE_MULTIPLIER: Record<string, number> = {
  pdf: 2.4,   // headers + footers + page numbers on every page
  docx: 1.8,  // XML tag overhead stripped by mammoth
  xlsx: 2.1,  // repeated column labels + cell metadata
  image: 1.3, // OCR noise, artefacts, irregular whitespace
  html: 1.6,  // HTML tag overhead
  unknown: 1.8,
}

export type ConverterProgress =
  | { type: "pdf"; loaded: number; total: number }
  | { type: "ocr"; status: string; progress: number }
  | null

export function useConverter() {
  const [status, setStatus] = useState<ConversionStatus>("idle")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<ConverterProgress>(null)
  const rawMarkdownRef = useRef<string>("")

  const convert = useCallback(async (file: File, profile: LLMProfile) => {
    setStatus("converting")
    setError(null)
    setProgress(null)

    const startedAt = performance.now()
    const filetype = detectFiletype(file)
    const convertedAt = new Date().toISOString()

    try {
      let rawMarkdown = ""
      let pageCount: number | null = null

      if (filetype === "docx") {
        const { convertDocx } = await import("@/lib/converters/docx")
        rawMarkdown = await convertDocx(file)
      } else if (filetype === "xlsx") {
        const { convertXlsx } = await import("@/lib/converters/xlsx")
        rawMarkdown = await convertXlsx(file)
      } else if (filetype === "pdf") {
        const { convertPdfClient } = await import("@/lib/converters/pdf-client")
        rawMarkdown = await convertPdfClient(file, (p) => {
          setProgress({ type: "pdf", loaded: p.loaded, total: p.total })
          pageCount = p.total
        })
      } else if (filetype === "image") {
        const { convertImageClient } = await import("@/lib/converters/image-client")
        rawMarkdown = await convertImageClient(file, (p) => {
          setProgress({ type: "ocr", status: p.status, progress: p.progress })
        })
      } else {
        // Try to read as plain text
        rawMarkdown = await file.text()
      }

      rawMarkdownRef.current = rawMarkdown
      const processingDurationMs = Math.round(performance.now() - startedAt)

      const metadata: ConversionMetadata = {
        filename: file.name,
        filetype,
        filesize: file.size,
        convertedAt,
        processingTier: "client",
        processingDurationMs,
        pageCount,
      }

      setStatus("profiling")
      const formattedMarkdown = applyProfile(rawMarkdown, profile, metadata)

      const rawTokenEstimate = countTokens(rawMarkdown, profile.tokenizerBackend)
      // fileTokenEstimate = what you'd spend without SuperMD (raw file noise × multiplier)
      const fileTokenEstimate = Math.round(
        rawTokenEstimate * (NOISE_MULTIPLIER[filetype] ?? 1.8)
      )
      const tokenCount = countTokens(formattedMarkdown, profile.tokenizerBackend)
      const tokensSaved = Math.max(0, fileTokenEstimate - tokenCount)
      const contextWindowPercent = tokenCount / profile.contextWindow
      const wordCount = rawMarkdown.split(/\s+/).filter(Boolean).length

      setResult({
        rawMarkdown,
        formattedMarkdown,
        fileTokenEstimate,
        rawTokenEstimate,
        tokenCount,
        tokensSaved,
        contextWindowPercent,
        wordCount,
        chunks: null,
        metadata,
      })
      setStatus("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.")
      setStatus("error")
    } finally {
      setProgress(null)
    }
  }, [])

  const reformat = useCallback(
    (profile: LLMProfile, metadata: ConversionMetadata) => {
      if (!rawMarkdownRef.current || !result) return
      const formattedMarkdown = applyProfile(rawMarkdownRef.current, profile, metadata)
      const rawTokenEstimate = countTokens(rawMarkdownRef.current, profile.tokenizerBackend)
      const tokenCount = countTokens(formattedMarkdown, profile.tokenizerBackend)
      // Preserve the original file noise estimate — it doesn't change when switching profiles
      const fileTokenEstimate = result.fileTokenEstimate
      const tokensSaved = Math.max(0, fileTokenEstimate - tokenCount)
      const contextWindowPercent = tokenCount / profile.contextWindow

      setResult((prev) =>
        prev
          ? {
              ...prev,
              formattedMarkdown,
              rawTokenEstimate,
              fileTokenEstimate,
              tokenCount,
              tokensSaved,
              contextWindowPercent,
            }
          : prev
      )
    },
    [result]
  )

  const reset = useCallback(() => {
    setStatus("idle")
    setResult(null)
    setError(null)
    setProgress(null)
    rawMarkdownRef.current = ""
  }, [])

  return { status, result, error, progress, convert, reformat, reset }
}
