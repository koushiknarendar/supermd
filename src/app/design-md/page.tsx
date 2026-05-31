"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Pencil, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateDesignMd } from "@/lib/generators/design-md"

export default function DesignMdPage() {
  const [name, setName] = useState("")
  const [summary, setSummary] = useState("")
  const [context, setContext] = useState("")
  const [problem, setProblem] = useState("")
  const [solution, setSolution] = useState("")
  const [decisions, setDecisions] = useState(["", ""])
  const [dataModel, setDataModel] = useState("")
  const [apiDesign, setApiDesign] = useState("")
  const [uiChanges, setUiChanges] = useState("")
  const [risks, setRisks] = useState("")
  const [successMetrics, setSuccessMetrics] = useState("")

  const hasContent = name.trim().length > 0 && (problem.trim() || solution.trim())

  const output = useMemo(() => {
    if (!hasContent) return ""
    return generateDesignMd({ name, summary, context, problem, solution, decisions, dataModel, apiDesign, uiChanges, risks, successMetrics })
  }, [name, summary, context, problem, solution, decisions, dataModel, apiDesign, uiChanges, risks, successMetrics, hasContent])

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "design"
  const filename = `${slug}.md`

  function addDecision() { setDecisions((d) => [...d, ""]) }
  function removeDecision(i: number) { setDecisions((d) => d.filter((_, idx) => idx !== i)) }
  function updateDecision(i: number, val: string) {
    setDecisions((d) => { const n = [...d]; n[i] = val; return n })
  }

  const labelClass = "label-mono mb-1.5 block"
  const textareaClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700 placeholder:text-slate-300"

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
            <Pencil className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">design.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// design.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Generate technical design docs for your AI.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Fill the form. Get a structured <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">design.md</code> covering context, problem, solution, decisions, and data model — ready to paste into your LLM before it starts coding.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8">
          {/* Left — form */}
          <div className="flex flex-col gap-5">
            {/* Name + summary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Feature name <span className="text-red-400">*</span></label>
                <Input
                  placeholder="user-auth-v2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-mono"
                />
                {name.trim() && (
                  <p className="mt-1 text-[10px] text-slate-400 font-mono">→ {filename}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>One-line summary</label>
                <Input
                  placeholder="Replace password auth with magic link"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Context & background</label>
              <textarea
                className={textareaClass}
                rows={2}
                placeholder="Why does this feature exist? What came before it?"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Problem <span className="text-red-400">*</span></label>
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="What problem is this solving? What breaks without this?"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Proposed solution</label>
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="High-level description of the approach..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />
            </div>

            {/* Design decisions */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ marginBottom: 0 }}>Key design decisions</label>
                <button onClick={addDecision} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {decisions.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono w-4 shrink-0">{i + 1}.</span>
                    <Input
                      placeholder={`Decision ${i + 1}`}
                      value={d}
                      onChange={(e) => updateDecision(i, e.target.value)}
                      className="flex-1"
                    />
                    {decisions.length > 1 && (
                      <button onClick={() => removeDecision(i)} className="text-slate-300 hover:text-slate-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Optional sections */}
            <details className="group">
              <summary className="cursor-pointer label-mono text-slate-400 hover:text-slate-600 list-none flex items-center gap-1.5">
                <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                Optional sections (data model, API, UI, risks, metrics)
              </summary>
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Data model <span className="text-slate-300 normal-case font-sans font-normal">(schema, types, fields)</span></label>
                  <textarea
                    className={`${textareaClass} font-mono`}
                    rows={4}
                    placeholder={"User {\n  id: string\n  email: string\n  magicToken: string | null\n}"}
                    value={dataModel}
                    onChange={(e) => setDataModel(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>API design <span className="text-slate-300 normal-case font-sans font-normal">(endpoints, contracts)</span></label>
                  <textarea
                    className={`${textareaClass} font-mono`}
                    rows={4}
                    placeholder={"POST /auth/magic-link\n  body: { email: string }\n  returns: { message: string }"}
                    value={apiDesign}
                    onChange={(e) => setApiDesign(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>UI changes</label>
                  <textarea
                    className={textareaClass}
                    rows={2}
                    placeholder="Login page removes password field, adds email-only form..."
                    value={uiChanges}
                    onChange={(e) => setUiChanges(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Risks & tradeoffs</label>
                  <textarea
                    className={textareaClass}
                    rows={2}
                    placeholder="Magic links expire — users on slow email can be locked out..."
                    value={risks}
                    onChange={(e) => setRisks(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Success metrics</label>
                  <textarea
                    className={textareaClass}
                    rows={2}
                    placeholder="Login success rate > 95%, auth errors < 1%..."
                    value={successMetrics}
                    onChange={(e) => setSuccessMetrics(e.target.value)}
                  />
                </div>
              </div>
            </details>

            {!hasContent && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] text-blue-700 leading-relaxed">
                Give your LLM a design.md before it writes a single line of code — it eliminates wrong-framework guesses, missed edge cases, and architecture surprises mid-implementation.
              </div>
            )}
          </div>

          {/* Right — live preview */}
          <div>
            {hasContent ? (
              <OutputCard content={output} filename={filename} label={`design: ${slug}`} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center">
                <p className="text-[13px] text-slate-400 font-mono">Preview updates as you type</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// what is design.md</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  Brief your LLM before it starts coding.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  A <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[12px]">design.md</code> is a structured design document you drop into your repo before asking an LLM to implement a feature. It answers the questions the model would otherwise guess at — what problem this solves, what decisions were already made, what the data model looks like.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Without a design doc, your LLM invents the architecture. With one, it implements the architecture you chose. That gap is the difference between a PR that needs a full rewrite and one that ships.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                  <span className="font-mono text-[11px] text-slate-500">user-auth-v2.md</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-600 leading-relaxed bg-white">{`# user-auth-v2 — Design Doc

> Replace password auth with magic link

## Problem

Password resets account for 34% of support tickets.
Users forget passwords and churn rather than reset.

## Proposed Solution

Replace the password field with email-only login.
Send a time-limited magic link to the email address.

## Key Design Decisions

1. Tokens expire after 15 minutes (security)
2. One active token per user (invalidate on new request)
3. Email via Resend, not SMTP directly

## Data Model

\`\`\`
User {
  magicToken: string | null
  magicTokenExpiry: Date | null
}
\`\`\``}</pre>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// use cases</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              When do you need a design.md?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Before implementing a new feature", desc: "Drop design.md in your repo and reference it in your first prompt. Claude implements the architecture you chose — not one it invented from the function signature.", tag: "New features" },
                { title: "Explaining non-obvious decisions", desc: "LLMs optimise for common patterns. When your design deviates from the default (for good reasons), a design.md explains the constraint before the model 'fixes' your intentional choice.", tag: "Constraints" },
                { title: "Multi-session work", desc: "Context windows reset. A design.md persists your decisions across every session — the model always knows what was decided without re-explaining it in every prompt.", tag: "Long projects" },
                { title: "Team collaboration with AI", desc: "When multiple engineers use the same LLM on the same feature, design.md makes sure all sessions start from the same design intent. No diverging implementations.", tag: "Teams" },
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

          <section className="border-t border-slate-100 pt-12 pb-4">
            <p className="label-mono mb-4">// faq</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              Frequently asked questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { q: "How is design.md different from CLAUDE.md?", a: "CLAUDE.md gives Claude context about your entire codebase — framework, commands, conventions. design.md is feature-specific: it documents the intent, decisions, and constraints for a single feature or implementation task." },
                { q: "How long should a design.md be?", a: "Short enough to fit comfortably in context. 200–400 tokens is ideal. A design.md that fills the context window crowds out the actual code you're asking about. The generator intentionally keeps sections concise." },
                { q: "Where should I put the file?", a: "Either in your repo root alongside CLAUDE.md, or in the relevant feature directory. Reference it in your first prompt: 'See user-auth-v2.md for the design context before implementing this.'" },
                { q: "Do I need to fill in every section?", a: "No. Name and Problem are the most important. The optional sections (data model, API design, risks) are only worth filling in when they capture a non-obvious decision the LLM would otherwise guess at incorrectly." },
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
