"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Globe, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateLlmsTxt, type CrawledPage } from "@/lib/generators/llms-txt"

type Status = "idle" | "crawling" | "done" | "error"

function normalizeUrl(raw: string): string {
  let u = raw.trim()
  if (!u.startsWith("http://") && !u.startsWith("https://")) u = "https://" + u
  return u
}

export default function LlmsTxtPage() {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [output, setOutput] = useState("")
  const [crawledPages, setCrawledPages] = useState<CrawledPage[]>([])

  async function handleGenerate() {
    const normalized = normalizeUrl(url)
    setStatus("crawling")
    setError("")
    setOutput("")
    setCrawledPages([])

    try {
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Failed to crawl the URL.")
      }

      const pages: CrawledPage[] = data.pages ?? []
      setCrawledPages(pages)
      setOutput(generateLlmsTxt(pages, normalized))
      setStatus("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
      setStatus("error")
    }
  }

  const loading = status === "crawling"

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      <div className="dot-grid dot-grid-fade pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.35 }} />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10" style={{ background: "linear-gradient(90deg, transparent 0%, #2563eb60 30%, #2563eb90 50%, #2563eb60 70%, transparent 100%)" }} />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto flex items-center gap-3 px-6 h-14">
          <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-6 w-6 rounded-md flex items-center justify-center" style={{ background: "#eff6ff" }}>
            <Globe className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">llms.txt</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// llms.txt</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Generate llms.txt for any website.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste your URL. SuperMD crawls your homepage and up to 5 linked pages, then generates a spec-compliant <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">llms.txt</code> so any LLM can understand your site.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* Left — input + crawl status */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="label-mono mb-2 block">Website URL</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://yourdomain.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && url.trim() && handleGenerate()}
                  className="font-mono flex-1"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !url.trim()}
                  style={{ background: "#2563eb", color: "#fff" }}
                  className="gap-2 shrink-0"
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Crawling…</> : "Generate"}
                </Button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Crawls homepage + up to 5 linked pages. Public URLs only.
              </p>
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-700">{error}</p>
              </div>
            )}

            {/* Pages crawled */}
            {crawledPages.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white/80 p-4 flex flex-col gap-3">
                <p className="label-mono">// pages crawled</p>
                <div className="flex flex-col gap-2">
                  {crawledPages.map((page, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-medium text-slate-700 truncate">{page.title || "Untitled"}</span>
                          <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-slate-500 shrink-0">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate font-mono">{page.url}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What is llms.txt */}
            {status === "idle" && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 flex flex-col gap-3">
                <p className="label-mono">// what is llms.txt?</p>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  <code className="bg-slate-100 px-1 rounded font-mono text-[11px]">llms.txt</code> is an emerging standard (llmstxt.org) that tells AI models what your site is about and where to find key content — reducing hallucinations when an LLM references your site.
                </p>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  Once generated, host it at <code className="bg-slate-100 px-1 rounded font-mono text-[11px]">yourdomain.com/llms.txt</code>.
                </p>
              </div>
            )}
          </div>

          {/* Right — output */}
          <div>
            {status === "done" && output ? (
              <OutputCard content={output} filename="llms.txt" label="Generated llms.txt" mimeType="text/plain" />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center">
                <p className="text-[13px] text-slate-400 font-mono">Your llms.txt will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
