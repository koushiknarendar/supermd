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

          {/* SEO content — always rendered */}
          <div className="mt-20 flex flex-col gap-16">

            {/* Use cases */}
            <section className="border-t border-slate-100 pt-12">
              <p className="label-mono mb-4">// use cases</p>
              <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8 max-w-xl">
                Who uses markitdown?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Building RAG pipelines",
                    desc: "Convert PDFs, DOCX, and spreadsheets into clean, chunked markdown ready to embed into Pinecone, Weaviate, or any vector database. The token-optimized output reduces embedding costs by up to 60%.",
                    tags: ["LangChain", "LlamaIndex", "Pinecone"],
                  },
                  {
                    title: "Feeding context to Claude or ChatGPT",
                    desc: "Instead of uploading raw files and hoping the model extracts what it needs, paste clean markdown directly. Less noise means the model focuses on your actual content, not structural artefacts.",
                    tags: ["Claude", "GPT-4o", "Gemini"],
                  },
                  {
                    title: "Processing research papers and reports",
                    desc: "Academic PDFs repeat headers, footers, and citations across every page. markitdown strips the repetition and gives you a clean linear text — ready to summarise, analyse, or query.",
                    tags: ["PDF", "Research", "Summarisation"],
                  },
                  {
                    title: "Preparing data for fine-tuning",
                    desc: "Training datasets need clean, consistent text. Convert a folder of DOCX or PDF documents to uniform markdown, then feed them into your fine-tuning pipeline without manual cleanup.",
                    tags: ["DOCX", "CSV", "Training data"],
                  },
                ].map((u) => (
                  <div key={u.title} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-5">
                    <h3 className="text-[14px] font-semibold text-slate-800 tracking-[-0.01em]">{u.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{u.desc}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {u.tags.map((t) => (
                        <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-500">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Supported formats */}
            <section className="border-t border-slate-100 pt-12">
              <p className="label-mono mb-4">// supported formats</p>
              <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
                Every major file type, one tool.
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-slate-200 rounded-xl overflow-hidden">
                {[
                  { fmt: "PDF", detail: "Text extraction from any PDF. Strips page numbers, headers, footers that repeat every page.", save: "Up to 58% fewer tokens" },
                  { fmt: "DOCX", detail: "Full Microsoft Word support. Preserves headings, bold, tables, and lists. Strips XML markup.", save: "Up to 41% fewer tokens" },
                  { fmt: "XLSX / CSV", detail: "Spreadsheets become clean markdown tables. Multi-sheet XLSX files get one section per sheet.", save: "Up to 63% fewer tokens" },
                  { fmt: "Images", detail: "OCR extracts text from JPG, PNG, WebP, and TIFF. Runs entirely in your browser via WebAssembly.", save: "Up to 34% fewer tokens" },
                ].map((f, i) => (
                  <div key={f.fmt} className={`p-5 flex flex-col gap-2 ${i < 3 ? "border-r border-slate-200" : ""}`}>
                    <span className="font-mono text-[13px] font-semibold text-blue-600">{f.fmt}</span>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{f.detail}</p>
                    <span className="text-[10px] font-mono text-emerald-600 font-medium">{f.save}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* LLM profiles explained */}
            <section className="border-t border-slate-100 pt-12">
              <p className="label-mono mb-4">// model profiles</p>
              <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-2">
                Why does formatting matter per model?
              </h2>
              <p className="text-[14px] text-slate-500 mb-8 max-w-2xl leading-relaxed">
                Each LLM was trained on different data and has different preferences for how context is structured. Using the wrong format doesn&apos;t cause failure — it just wastes tokens on structure the model has to mentally discard.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { model: "🟣 Claude", context: "200K tokens", style: "XML tags like <document> and <section> match how Claude was trained to parse long-context documents. Anthropic recommends this structure in their own prompt engineering guide.", best: "Long documents, RAG, structured analysis" },
                  { model: "🟢 GPT-4o", context: "128K tokens", style: "YAML frontmatter and standard ATX headings (## H2) match GPT-4o's markdown training. XML tags add noise. Aggressive empty-line stripping saves tokens without losing structure.", best: "Chat completion, code tasks, summarisation" },
                  { model: "🔵 Gemini", context: "1M tokens", style: "With a 1M token context window, chunking is rarely needed. Clean prose with consistent heading hierarchy is sufficient — Gemini handles long continuous documents better than most models.", best: "Very long documents, whole-codebase analysis" },
                ].map((m) => (
                  <div key={m.model} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-slate-800">{m.model}</span>
                      <span className="font-mono text-[10px] text-slate-400">{m.context}</span>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{m.style}</p>
                    <p className="text-[11px] font-mono text-blue-500">Best for: {m.best}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="border-t border-slate-100 pt-12 pb-4">
              <p className="label-mono mb-4">// faq</p>
              <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
                Frequently asked questions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  { q: "Does my file get uploaded to a server?", a: "No. The free tier runs entirely in your browser using WebAssembly. Your files are never sent to our servers. This is especially important for confidential documents like financial reports or legal contracts." },
                  { q: "How much can I realistically save in tokens?", a: "It depends on the file type and content. PDFs with repeated headers and footers across many pages typically save 40–60%. Spreadsheets with redundant column labels save 40–65%. Plain DOCX documents save 20–40%." },
                  { q: "What file size is supported?", a: "The free tier supports files up to 5 MB, which covers most documents. A typical 50-page PDF is under 2 MB. Images and scanned documents may be larger — a Pro tier with 50 MB support is coming soon." },
                  { q: "Can I use the markdown output in any LLM tool?", a: "Yes. The output is plain markdown that works everywhere — Claude, ChatGPT, Gemini, Perplexity, Cursor, Copilot, and any RAG framework like LangChain or LlamaIndex." },
                  { q: "What is RAG-ready chunking?", a: "RAG (Retrieval-Augmented Generation) splits long documents into smaller overlapping chunks for vector search. markitdown can split your output at semantic boundaries (headings, paragraphs) and export JSON with per-chunk metadata for direct Pinecone or Weaviate ingestion." },
                  { q: "Is this the same as Microsoft's markitdown?", a: "No. Microsoft released a Python library also called markitdown. SuperMD's markitdown is a browser-based tool with LLM-specific profiles, token savings display, and RAG-ready output — features the Python library doesn't have." },
                ].map((item) => (
                  <div key={item.q}>
                    <h3 className="text-[14px] font-semibold text-slate-800 mb-2 tracking-[-0.01em]">{item.q}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
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
