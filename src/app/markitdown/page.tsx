"use client"

import { useState } from "react"
import { useConverter } from "@/hooks/useConverter"
import { DropZone } from "@/components/converter/DropZone"
import { ProcessingStatus } from "@/components/converter/ProcessingStatus"
import { HowItWorks } from "@/components/converter/HowItWorks"
import { ProfileSelector } from "@/components/profiles/ProfileSelector"
import { TokenSavingsVisual } from "@/components/tokens/TokenSavingsVisual"
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview"
import { ExportBar } from "@/components/markdown/ExportBar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, RotateCcw, FileWarning, Lock, Zap } from "lucide-react"
import Link from "next/link"
import { CLAUDE_PROFILE } from "@/lib/profiles"
import type { LLMProfile } from "@/types"

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "markitdown by SuperMD",
  url: "https://supermd.dev/markitdown",
  description:
    "Convert any file to LLM-optimized markdown. Supports PDF, DOCX, XLSX, and images. Choose a Claude, GPT-4o, or Gemini profile and see exactly how many tokens you save.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Convert PDF to markdown for LLM",
    "Convert DOCX to markdown",
    "Convert XLSX to markdown",
    "Image OCR to markdown",
    "Claude-optimized markdown output",
    "GPT-4o-optimized markdown output",
    "Gemini-optimized markdown output",
    "Token savings calculator",
    "Files never leave your browser",
  ],
}

export default function MarkitdownPage() {
  const [profile, setProfile] = useState<LLMProfile>(CLAUDE_PROFILE)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const { status, result, error, progress, convert, reformat, reset } = useConverter()

  function handleFile(file: File) {
    setCurrentFile(file)
    convert(file, profile)
  }

  function handleProfileChange(newProfile: LLMProfile) {
    setProfile(newProfile)
    if (result) reformat(newProfile, result.metadata)
  }

  function handleReset() {
    setCurrentFile(null)
    reset()
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      <div className="relative min-h-screen bg-white overflow-x-hidden">
        {/* Dot grid — matches homepage */}
        <div
          className="dot-grid dot-grid-fade pointer-events-none absolute inset-0 z-0"
          style={{ opacity: 0.35 }}
        />

        {/* Top accent line */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #2563eb60 30%, #2563eb90 50%, #2563eb60 70%, transparent 100%)",
          }}
        />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-14">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded-md flex items-center justify-center"
                  style={{ background: "#eff6ff" }}
                >
                  <Zap className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">
                    markitdown
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
                </div>
              </div>
            </div>
            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                New file
              </Button>
            )}
          </div>
        </header>

        <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
          {/* Page heading — idle state */}
          {status === "idle" && (
            <div className="mb-8">
              <p className="label-mono mb-3">// markitdown</p>
              <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
                Convert any file to LLM-optimized markdown.
              </h1>
              <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
                Drop a PDF, DOCX, XLSX, or image. SuperMD strips the noise, applies your chosen
                model&apos;s format, and shows you exactly how many tokens you saved — all in your browser.
              </p>
            </div>
          )}

          {/* Steps */}
          {status !== "done" && (
            <div className="mb-7">
              <HowItWorks status={status} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Left */}
            <div className="flex flex-col gap-6">
              {status !== "done" && (
                <>
                  <DropZone
                    onFile={handleFile}
                    disabled={status === "converting" || status === "profiling"}
                  />
                  <ProcessingStatus progress={progress} status={status} />
                </>
              )}

              {status === "error" && error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <FileWarning className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Conversion failed</p>
                    <p className="text-sm text-red-600 mt-0.5">{error}</p>
                    <button onClick={handleReset} className="mt-2 text-xs text-red-500 underline">
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {result && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[13px] font-medium text-slate-700 truncate max-w-xs">
                      {result.metadata.filename}
                    </h2>
                    <ExportBar result={result} />
                  </div>
                  <Separator />
                  <MarkdownPreview markdown={result.formattedMarkdown} />
                </div>
              )}
            </div>

            {/* Right */}
            <div className="flex flex-col gap-4">
              <ProfileSelector activeProfile={profile} onChange={handleProfileChange} />

              {result && (
                <>
                  <TokenSavingsVisual result={result} profile={profile} />

                  <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-4 flex flex-col gap-2">
                    <p className="label-mono">file info</p>
                    <div className="flex flex-col gap-1.5 mt-1">
                      <Row label="Words" value={result.wordCount.toLocaleString()} />
                      <Row label="Size" value={`${(result.metadata.filesize / 1024).toFixed(1)} KB`} />
                      {result.metadata.pageCount && (
                        <Row label="Pages" value={String(result.metadata.pageCount)} />
                      )}
                      <Row label="Processed in" value={`${result.metadata.processingDurationMs}ms`} />
                      <Row label="Tier" value="Client-side (free)" />
                    </div>
                  </div>
                </>
              )}

              {status !== "done" && (
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white/60 backdrop-blur-sm p-4">
                  <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-slate-400 leading-relaxed">
                    Your file never leaves your browser. Conversion runs locally — no upload, no server.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SEO content section */}
          {status === "idle" && (
            <section className="mt-16 pt-10 border-t border-slate-100">
              <p className="label-mono mb-6">// frequently asked</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-slate-800 mb-2">
                    Why convert files to markdown for LLMs?
                  </h2>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    LLMs consume tokens, not files. A raw PDF carries page numbers, repeated headers,
                    and structural noise — all of which burn context window before the model reaches your content.
                  </p>
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-slate-800 mb-2">
                    What makes Claude, GPT-4o, and Gemini profiles different?
                  </h2>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    Each model reads structure differently. Claude works best with{" "}
                    <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">&lt;document&gt;</code>{" "}
                    XML tags. GPT-4o prefers YAML frontmatter. Gemini handles long prose without chunking.
                  </p>
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-slate-800 mb-2">
                    Is markitdown free to use?
                  </h2>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    Yes. The free tier processes files in your browser — no upload, no account. Files up
                    to 5 MB are supported. Pro tier with larger files and server-side quality is coming soon.
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}
