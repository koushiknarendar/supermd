"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Zap, TrendingDown } from "lucide-react"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { compressText, estimateTokens, type CompressionLevel } from "@/lib/compressors/token-compress"

const LEVELS: { id: CompressionLevel; label: string; desc: string }[] = [
  { id: "light", label: "Light", desc: "Obvious filler phrases only — zero semantic change" },
  { id: "balanced", label: "Balanced", desc: "Full filler removal + whitespace cleanup" },
  { id: "aggressive", label: "Aggressive", desc: "All above + discourse markers + nominalisation reversal" },
]

const SAMPLE = `Due to the fact that we are at this point in time experiencing a large number of challenges in relation to our current status, it is important to note that our team has been able to make a number of adjustments.

As previously mentioned, the end result of these efforts is that we are now going to provide assistance to each and every stakeholder in order to ensure that, in the event that further issues arise, we will be able to conduct an investigation.

First and foremost, it should be noted that this is a new innovation in the field. Needless to say, the general consensus is that close proximity to the problem is absolutely essential for a final outcome that provides an added bonus to stakeholders.`

export default function CompressPage() {
  const [input, setInput] = useState("")
  const [level, setLevel] = useState<CompressionLevel>("balanced")

  const hasInput = input.trim().length > 0

  const result = useMemo(() => {
    if (!hasInput) return null
    return compressText(input, level)
  }, [input, level, hasInput])

  const inputTokens = useMemo(() => estimateTokens(input), [input])
  const outputTokens = useMemo(() => (result ? estimateTokens(result.compressed) : 0), [result])
  const saved = inputTokens - outputTokens
  const savingsPct = inputTokens > 0 ? Math.round((saved / inputTokens) * 100) : 0

  function loadSample() {
    setInput(SAMPLE)
  }

  const textareaClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-mono text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none leading-relaxed"

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
            <Zap className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">compress</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// compress</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Cut your token count without losing meaning.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste any prompt or document. Filler phrases are removed, redundancy stripped, whitespace cleaned — fewer tokens, same meaning. Runs entirely in your browser.
          </p>
        </div>

        {/* Level picker */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="label-mono shrink-0">Level:</span>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1 bg-white">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                  level === l.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <span className="text-[12px] text-slate-400 font-mono hidden sm:block">
            — {LEVELS.find((l) => l.id === level)?.desc}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-mono">Input</span>
              <div className="flex items-center gap-3">
                {hasInput && (
                  <span className="text-[11px] font-mono text-slate-400">
                    ~{inputTokens.toLocaleString()} tokens
                  </span>
                )}
                {!hasInput && (
                  <button
                    onClick={loadSample}
                    className="text-[11px] font-mono text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    try sample text →
                  </button>
                )}
              </div>
            </div>
            <textarea
              className={textareaClass}
              rows={18}
              placeholder="Paste any text — a prompt, a document, an email, a system message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {hasInput && (
              <button
                onClick={() => setInput("")}
                className="self-start text-[11px] font-mono text-slate-300 hover:text-slate-500 transition-colors"
              >
                clear
              </button>
            )}
          </div>

          {/* Right — output */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-mono">Output</span>
              {result && saved > 0 && (
                <div className="flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: "#f0fdf4", color: "#15803d" }}>
                  <TrendingDown className="h-3 w-3" />
                  −{saved.toLocaleString()} tokens · {savingsPct}% smaller
                </div>
              )}
              {result && saved === 0 && (
                <span className="text-[11px] font-mono text-slate-400">No filler found at this level</span>
              )}
            </div>

            {result ? (
              <>
                <OutputCard
                  content={result.compressed}
                  filename="compressed.txt"
                  label={`~${outputTokens.toLocaleString()} tokens · ${result.changesApplied} change${result.changesApplied !== 1 ? "s" : ""} applied`}
                />
                {result.changesApplied > 0 && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-[12px] text-slate-500 leading-relaxed">
                    <strong className="text-slate-700 font-semibold">{result.changesApplied} substitution{result.changesApplied !== 1 ? "s" : ""} applied</strong> — filler phrases replaced and whitespace cleaned.
                    Review before use: the meaning is preserved but phrasing may differ slightly.
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[340px] flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "#eff6ff" }}>
                  <Zap className="h-5 w-5" style={{ color: "#2563eb" }} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] text-slate-500 font-medium">Compressed output appears here</p>
                  <p className="text-[11px] text-slate-400 mt-1">Paste text on the left to start</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// how it works</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  Fewer tokens. Same meaning.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  English is full of filler — phrases that add words without adding meaning. &ldquo;In order to&rdquo; means &ldquo;to.&rdquo; &ldquo;Due to the fact that&rdquo; means &ldquo;because.&rdquo; &ldquo;At this point in time&rdquo; means &ldquo;now.&rdquo; When you send text to an LLM, every one of those extra words costs you tokens.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  The compressor applies a library of pattern replacements — longest-to-shortest, case-preserving — then cleans up whitespace and redundant structure. It runs entirely in your browser: no API calls, no data sent anywhere.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Typical savings range from <strong className="text-slate-700 font-medium">8–25%</strong> on real-world documents. Formal writing, legal text, and corporate prose tend to compress the most.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                  <span className="font-mono text-[11px] text-slate-500">Example — Balanced level</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { before: "in order to achieve the goal", after: "to achieve the goal", saved: 4 },
                    { before: "due to the fact that it failed", after: "because it failed", saved: 4 },
                    { before: "at this point in time", after: "now", saved: 5 },
                    { before: "a large number of users", after: "many users", saved: 4 },
                    { before: "is able to process", after: "can process", saved: 2 },
                  ].map((ex) => (
                    <div key={ex.before} className="px-4 py-3 flex flex-col gap-1">
                      <p className="text-[12px] font-mono text-slate-400 line-through">{ex.before}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] font-mono text-slate-700">{ex.after}</p>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">−{ex.saved} tok</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// compression levels</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              Choose your compression level.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  label: "Light",
                  range: "5–10% reduction",
                  desc: "Only the most obvious filler phrases — \"in order to\" → \"to\", \"due to the fact that\" → \"because\". Safe for any context. Output reads identically to the input.",
                  when: "Legal docs, formal reports, academic text where you need to preserve tone exactly.",
                },
                {
                  label: "Balanced",
                  range: "10–20% reduction",
                  desc: "Full filler library + discourse markers + pleonasms (\"end result\" → \"result\"). Also cleans trailing whitespace and excess blank lines. Recommended for most use cases.",
                  when: "Prompts, system messages, documentation, any text you paste into an LLM chat window.",
                },
                {
                  label: "Aggressive",
                  range: "15–30% reduction",
                  desc: "All above + nominalisation reversal (\"make a decision\" → \"decide\") + discourse markers removed (\"in conclusion\", \"to summarize\"). May slightly change tone but not meaning.",
                  when: "Large context windows, RAG chunks, batch embeddings where token cost matters most.",
                },
              ].map((l) => (
                <div key={l.label} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-[14px] font-semibold text-slate-800 tracking-[-0.01em]">{l.label}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{l.range}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{l.desc}</p>
                  <p className="text-[12px] text-slate-400 leading-relaxed"><strong className="text-slate-500 font-medium">Best for:</strong> {l.when}</p>
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
                { q: "Does compression change the meaning?", a: "At Light and Balanced levels, no — the replacements are semantically equivalent. 'In order to' and 'to' are identical in meaning. At Aggressive, some phrasing changes (nominalisation reversal) that may slightly alter tone but not content." },
                { q: "How much does it actually save?", a: "Typically 8–25% on real-world text, depending on how formal the writing is. Corporate prose, legal text, and academic writing compress the most. Conversational or already-tight text may show 3–8%." },
                { q: "Is my text sent anywhere?", a: "No. Everything runs in your browser using plain JavaScript pattern matching. No API calls are made. Your text never leaves your device." },
                { q: "What kind of text compresses best?", a: "Formal written English — corporate memos, legal documents, academic papers, product specs, email threads. Conversational writing and already-concise prose compress less because the filler is already absent." },
                { q: "How is this different from summarization?", a: "Summarization removes content. This removes only the words that don't carry content — filler phrases, pleonasms, discourse markers. The compressed version contains all the same facts and logic as the original." },
                { q: "Should I review the output before using it?", a: "Yes, always. The tool shows how many substitutions were applied. Read through the output — especially with Aggressive level — to confirm the phrasing still reads naturally in your context." },
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
