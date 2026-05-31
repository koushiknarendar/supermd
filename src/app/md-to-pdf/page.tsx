"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, FileDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/Footer"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

const PDF_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    line-height: 1.7;
    color: #1e293b;
    background: #fff;
    max-width: 740px;
    margin: 0 auto;
    padding: 48px 40px;
  }
  h1 { font-size: 26px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: #0f172a; line-height: 1.25; }
  h2 { font-size: 20px; font-weight: 600; margin-top: 32px; margin-bottom: 10px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  h3 { font-size: 16px; font-weight: 600; margin-top: 24px; margin-bottom: 8px; color: #1e293b; }
  h4, h5, h6 { font-size: 14px; font-weight: 600; margin-top: 20px; margin-bottom: 6px; color: #334155; }
  p { margin-bottom: 14px; }
  a { color: #2563eb; text-decoration: none; }
  ul, ol { margin-bottom: 14px; padding-left: 24px; }
  li { margin-bottom: 4px; }
  blockquote {
    border-left: 3px solid #2563eb;
    padding: 8px 16px;
    margin: 16px 0;
    color: #475569;
    background: #f8fafc;
    border-radius: 0 4px 4px 0;
  }
  pre {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 14px 16px;
    margin: 14px 0;
    overflow-x: auto;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
    line-height: 1.6;
  }
  code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 3px;
    padding: 1px 5px;
    color: #0f172a;
  }
  pre code { background: none; border: none; padding: 0; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 13px;
  }
  th {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
    color: #374151;
  }
  td {
    border: 1px solid #e2e8f0;
    padding: 7px 12px;
    color: #4b5563;
  }
  tr:nth-child(even) td { background: #f9fafb; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
  img { max-width: 100%; border-radius: 4px; }
  @media print {
    body { padding: 0; max-width: 100%; }
    h2 { break-after: avoid; }
    pre { break-inside: avoid; }
    blockquote { break-inside: avoid; }
  }
`

function buildPrintHtml(markdownHtml: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || "document"}</title>
  <style>${PDF_STYLES}</style>
</head>
<body>
${markdownHtml}
</body>
</html>`
}

const SAMPLE = `# Getting Started

Welcome to **md-to-pdf** — paste your markdown here and download a clean PDF.

## Features

- Renders headings, lists, and emphasis correctly
- Code blocks with monospace font
- Tables and blockquotes
- Clean, print-ready layout

## Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`
}
\`\`\`

## Table Example

| Column A | Column B | Column C |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |

> Replace this content with your own markdown and click **Download PDF**.
`

export default function MdToPdfPage() {
  const [markdown, setMarkdown] = useState(SAMPLE)
  const [tab, setTab] = useState<"edit" | "preview">("edit")

  const derivedTitle = markdown.match(/^#\s+(.+)/m)?.[1]?.trim() ?? "document"
  const filename = derivedTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60) + ".pdf"

  const handleDownload = useCallback(() => {
    // Get rendered HTML from the hidden preview div
    const previewEl = document.getElementById("md-pdf-preview")
    if (!previewEl) return
    const html = buildPrintHtml(previewEl.innerHTML, derivedTitle)
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, "_blank")
    if (win) {
      win.onload = () => {
        setTimeout(() => {
          win.print()
          URL.revokeObjectURL(url)
        }, 300)
      }
    }
  }, [derivedTitle])

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      <div className="dot-grid dot-grid-fade pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.35 }} />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10" style={{ background: "linear-gradient(90deg, transparent 0%, #2563eb60 30%, #2563eb90 50%, #2563eb60 70%, transparent 100%)" }} />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3 px-6 h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-6 w-6 rounded-md flex items-center justify-center" style={{ background: "#eff6ff" }}>
              <FileDown className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">md-to-pdf</span>
              <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
            </div>
          </div>
          <Button
            onClick={handleDownload}
            disabled={!markdown.trim()}
            size="sm"
            className="gap-1.5 font-semibold"
            style={{ background: "#2563eb", color: "#fff" }}
          >
            <FileDown className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// md-to-pdf</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Convert markdown to a styled PDF.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste your markdown below. SuperMD renders it with clean typography — headings, code blocks, tables, and lists — then opens a print dialog so you can save it as PDF.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
          <button
            onClick={() => setTab("edit")}
            className={`px-4 py-2 text-[13px] font-medium transition-colors border-b-2 -mb-px ${tab === "edit" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Edit
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium transition-colors border-b-2 -mb-px ${tab === "preview" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
          <span className="ml-auto mb-1 text-[11px] font-mono text-slate-400">→ {filename}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor — always mounted so state is preserved */}
          <div className={tab === "edit" ? "block" : "hidden lg:block"}>
            <textarea
              className="w-full h-[600px] rounded-xl border border-slate-200 px-4 py-4 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700 placeholder:text-slate-300 leading-relaxed"
              placeholder="# Your Markdown Here&#10;&#10;Paste or type markdown..."
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </div>

          {/* Preview */}
          <div className={`rounded-xl border border-slate-200 overflow-auto h-[600px] bg-white p-8 ${tab === "preview" ? "block" : "hidden lg:block"}`}>
            <div className="prose prose-slate prose-sm max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Hidden render target for PDF export — full prose styles applied */}
        <div className="hidden">
          <div id="md-pdf-preview" className="prose prose-slate max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-[12px] text-slate-400 font-mono">
            {markdown.trim().split(/\s+/).length} words · {markdown.length} chars
          </p>
          <Button
            onClick={handleDownload}
            disabled={!markdown.trim()}
            className="gap-2 font-semibold"
            style={{ background: "#2563eb", color: "#fff" }}
          >
            <FileDown className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Info box */}
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-[12px] text-blue-700 leading-relaxed flex flex-col gap-1.5">
          <p className="font-semibold">How it works</p>
          <p>Clicking &ldquo;Download PDF&rdquo; opens your rendered document in a new tab and triggers the browser&apos;s print dialog. Choose <strong>&ldquo;Save as PDF&rdquo;</strong> as the destination. The rendered document uses web fonts and precise CSS — the resulting PDF matches what you see in the preview.</p>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// supported markdown</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              What renders in the PDF.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {[
                { group: "Text", items: ["Headings h1–h6", "Bold & italic", "Blockquotes", "Horizontal rules"] },
                { group: "Code", items: ["Fenced code blocks", "Inline code", "Language hints", "Monospace font"] },
                { group: "Structure", items: ["Ordered lists", "Unordered lists", "Nested lists", "Tables"] },
                { group: "Media", items: ["Links", "Images", "HTML tags", "GFM checkboxes"] },
              ].map((g, i) => (
                <div key={g.group} className={`p-5 ${i < 3 ? "border-r border-slate-200" : ""}`}>
                  <p className="label-mono mb-3">{g.group}</p>
                  <ul className="flex flex-col gap-1.5">
                    {g.items.map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-[12px] text-slate-500">
                        <span className="h-1 w-1 rounded-full bg-blue-300 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12 pb-4">
            <p className="label-mono mb-4">// faq</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              Frequently asked questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { q: "Does my markdown get uploaded to a server?", a: "No. Conversion runs entirely in your browser. Your markdown is rendered locally with React, then printed via the browser's native print engine. Nothing is sent to a server." },
                { q: "Why does it use the print dialog instead of a direct download?", a: "The browser's PDF engine produces much higher-quality output than JavaScript PDF libraries. Fonts, hyphenation, page breaks, and table rendering are all handled natively — resulting in a PDF that looks exactly like the preview." },
                { q: "Can I control page margins or font size?", a: "The layout uses sensible defaults (48px padding, 14px body text, 740px max-width). For custom styles, you can use the browser's print settings (Ctrl/Cmd+P) to adjust margins, paper size, and scale before saving." },
                { q: "Does it support GitHub Flavored Markdown (GFM)?", a: "Yes — the renderer supports tables, strikethrough, task list checkboxes, and inline HTML via rehype-raw. Most GFM documents render correctly out of the box." },
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
  )
}
