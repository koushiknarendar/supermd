"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Brain, Plus, X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateContextMd } from "@/lib/generators/context-md"

type FetchStatus = "idle" | "fetching" | "done" | "error"

export default function ContextMdPage() {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [details, setDetails] = useState("")
  const [concepts, setConcepts] = useState([
    { term: "", definition: "" },
    { term: "", definition: "" },
  ])
  const [instructions, setInstructions] = useState("")
  const [references, setReferences] = useState([{ label: "", url: "" }])

  // URL scraping
  const [urlInput, setUrlInput] = useState("")
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle")
  const [fetchError, setFetchError] = useState("")

  const hasContent = title.trim().length > 0

  const output = useMemo(() => {
    if (!hasContent) return ""
    return generateContextMd({ title, summary, concepts, details, instructions, references })
  }, [title, summary, concepts, details, instructions, references, hasContent])

  async function handleScrapeUrl() {
    const url = urlInput.trim()
    if (!url) return
    const normalized = url.startsWith("http") ? url : `https://${url}`
    setFetchStatus("fetching")
    setFetchError("")
    try {
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? "Failed to fetch")
      const page = data.pages?.[0]
      if (page) {
        if (page.title && !title) setTitle(page.title)
        if (page.description && !summary) setSummary(page.description)
        if (page.text && !details) setDetails(page.text.slice(0, 1000))
        if (!references[0].label) setReferences([{ label: page.title || url, url: normalized }])
      }
      setFetchStatus("done")
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Could not fetch URL")
      setFetchStatus("error")
    }
  }

  const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700 placeholder:text-slate-300"
  const labelClass = "label-mono mb-1.5 block"

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
            <Brain className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">context.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// context.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Build a context layer for any topic.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Define what your LLM needs to know before every session on a topic — concepts, key details, references. Paste a URL to pre-fill from any webpage, or write freely. Preview updates live.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8">
          {/* Left — form */}
          <div className="flex flex-col gap-5">

            {/* URL pre-fill */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3">
              <p className="label-mono">// pre-fill from a URL (optional)</p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://docs.example.com/getting-started"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchStatus !== "fetching" && handleScrapeUrl()}
                  className="font-mono text-sm flex-1"
                />
                <Button
                  onClick={handleScrapeUrl}
                  disabled={fetchStatus === "fetching" || !urlInput.trim()}
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5"
                >
                  {fetchStatus === "fetching" ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching</> : "Fetch"}
                </Button>
              </div>
              {fetchStatus === "error" && (
                <div className="flex items-center gap-2 text-[12px] text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fetchError}
                </div>
              )}
              {fetchStatus === "done" && (
                <p className="text-[11px] text-emerald-600 font-mono">✓ Pre-filled from URL — edit any field below</p>
              )}
            </div>

            {/* Core fields */}
            <div>
              <label className={labelClass}>Topic title <span className="text-red-400">*</span></label>
              <Input
                placeholder="REST APIs / React Server Components / My SaaS pricing model"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>One-line summary</label>
              <Input
                placeholder="What is this context about, in one sentence?"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Overview / key details</label>
              <textarea
                className={inputClass}
                rows={5}
                placeholder="Paste notes, explain the topic, or describe what's important to remember..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            {/* Concepts */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ marginBottom: 0 }}>Key concepts</label>
                <button
                  onClick={() => setConcepts((c) => [...c, { term: "", definition: "" }])}
                  className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {concepts.map((c, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Input
                      placeholder="Term"
                      value={c.term}
                      onChange={(e) => setConcepts((cs) => cs.map((x, j) => j === i ? { ...x, term: e.target.value } : x))}
                      className="w-[35%] shrink-0"
                    />
                    <Input
                      placeholder="Definition or explanation"
                      value={c.definition}
                      onChange={(e) => setConcepts((cs) => cs.map((x, j) => j === i ? { ...x, definition: e.target.value } : x))}
                      className="flex-1"
                    />
                    {concepts.length > 1 && (
                      <button onClick={() => setConcepts((cs) => cs.filter((_, j) => j !== i))} className="text-slate-300 hover:text-slate-500 mt-2.5">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className={labelClass}>Instructions for the LLM <span className="text-slate-300 normal-case font-sans font-normal">(optional)</span></label>
              <textarea
                className={inputClass}
                rows={2}
                placeholder="When using this context, always consider X. Assume the reader already knows Y..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            {/* References */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ marginBottom: 0 }}>References <span className="text-slate-300 normal-case font-sans font-normal">(optional)</span></label>
                <button
                  onClick={() => setReferences((r) => [...r, { label: "", url: "" }])}
                  className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {references.map((r, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input placeholder="Label" value={r.label} onChange={(e) => setReferences((rs) => rs.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className="w-[35%] shrink-0" />
                    <Input placeholder="URL (optional)" value={r.url} onChange={(e) => setReferences((rs) => rs.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} className="flex-1 font-mono text-sm" />
                    {references.length > 1 && (
                      <button onClick={() => setReferences((rs) => rs.filter((_, j) => j !== i))} className="text-slate-300 hover:text-slate-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — live preview */}
          <div>
            {hasContent ? (
              <OutputCard content={output} filename="context.md" label="context.md — live preview" />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center">
                <p className="text-[13px] text-slate-400 font-mono">Preview updates as you type</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-14">
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// use cases</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">When do you need context.md?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Briefing Claude on an unfamiliar domain", desc: "Starting a legal, medical, or financial project? Build a context.md with the key terms and rules so Claude doesn't need to be corrected repeatedly.", tag: "Domain knowledge" },
                { title: "Capturing your learnings from an article", desc: "You read something important. Paste the URL, extract the key concepts, and save a context.md you can drop into any future session on that topic.", tag: "Learning" },
                { title: "Persistent project context across sessions", desc: "LLMs forget. A context.md for your project — business model, target audience, constraints — means every new session starts with full context.", tag: "Projects" },
                { title: "Team knowledge standardisation", desc: "Define what 'our stack' or 'our customer' means once, in a context.md. Share it with the team so every LLM session starts from the same baseline.", tag: "Teams" },
              ].map((u) => (
                <div key={u.title} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[14px] font-semibold text-slate-800 tracking-[-0.01em]">{u.title}</h3>
                    <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-mono text-blue-500">{u.tag}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{u.desc}</p>
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
