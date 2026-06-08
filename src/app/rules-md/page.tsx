"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, ScrollText, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateRulesMd, getFilename, type RulesTarget, type RulesFormData } from "@/lib/generators/rules-md"

const TARGETS: { id: RulesTarget; label: string; file: string }[] = [
  { id: "cursor", label: "Cursor", file: ".cursorrules" },
  { id: "copilot", label: "Copilot", file: "copilot-instructions.md" },
  { id: "windsurf", label: "Windsurf", file: ".windsurfrules" },
]

export default function RulesMdPage() {
  const [language, setLanguage] = useState("")
  const [framework, setFramework] = useState("")
  const [description, setDescription] = useState("")
  const [conventions, setConventions] = useState("")
  const [dos, setDos] = useState(["", ""])
  const [donts, setDonts] = useState(["", ""])
  const [extra, setExtra] = useState("")
  const [activeTarget, setActiveTarget] = useState<RulesTarget>("cursor")

  const hasContent = !!(language || framework || description || conventions || dos.some((d) => d.trim()) || donts.some((d) => d.trim()))

  const formData: RulesFormData = { language, framework, description, conventions, dos, donts, extra }

  const outputs = useMemo(() => {
    if (!hasContent) return null
    return {
      cursor: generateRulesMd(formData, "cursor"),
      copilot: generateRulesMd(formData, "copilot"),
      windsurf: generateRulesMd(formData, "windsurf"),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, framework, description, conventions, dos, donts, extra, hasContent])

  function addDo() { setDos((s) => [...s, ""]) }
  function removeDo(i: number) { setDos((s) => s.filter((_, idx) => idx !== i)) }
  function updateDo(i: number, val: string) { setDos((s) => { const n = [...s]; n[i] = val; return n }) }

  function addDont() { setDonts((s) => [...s, ""]) }
  function removeDont(i: number) { setDonts((s) => s.filter((_, idx) => idx !== i)) }
  function updateDont(i: number, val: string) { setDonts((s) => { const n = [...s]; n[i] = val; return n }) }

  const labelClass = "label-mono mb-1.5 block"
  const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700 placeholder:text-slate-300"

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
            <ScrollText className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">rules.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// rules.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            AI coding rules for every editor.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Fill the form once. Get{" "}
            <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">.cursorrules</code>,{" "}
            <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">copilot-instructions.md</code>, and{" "}
            <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">.windsurfrules</code> — all formatted correctly for each tool.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8">
          {/* Left — form */}
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Language</label>
                <Input
                  placeholder="TypeScript"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Framework</label>
                <Input
                  placeholder="Next.js App Router"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Project description</label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="This is a B2B SaaS dashboard built with Next.js and Supabase. It handles billing, team management, and usage analytics for enterprise customers."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Code style & conventions <span className="text-slate-300 normal-case font-sans font-normal">(optional)</span></label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="Use kebab-case for filenames. Prefer named exports. Keep components under 150 lines. Use Tailwind utility classes only, no custom CSS."
                value={conventions}
                onChange={(e) => setConventions(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ marginBottom: 0 }}>Always</label>
                <button onClick={addDo} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add rule
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {dos.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-400 font-mono w-4 shrink-0">+</span>
                    <Input
                      placeholder={i === 0 ? "Use server components by default" : i === 1 ? "Add JSDoc for exported functions" : "Rule..."}
                      value={d}
                      onChange={(e) => updateDo(i, e.target.value)}
                      className="flex-1"
                    />
                    {dos.length > 1 && (
                      <button onClick={() => removeDo(i)} className="text-slate-300 hover:text-slate-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ marginBottom: 0 }}>Never</label>
                <button onClick={addDont} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add rule
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {donts.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] text-red-300 font-mono w-4 shrink-0">−</span>
                    <Input
                      placeholder={i === 0 ? "Use any or type casting" : i === 1 ? "Import from barrel files" : "Rule..."}
                      value={d}
                      onChange={(e) => updateDont(i, e.target.value)}
                      className="flex-1"
                    />
                    {donts.length > 1 && (
                      <button onClick={() => removeDont(i)} className="text-slate-300 hover:text-slate-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Extra instructions <span className="text-slate-300 normal-case font-sans font-normal">(optional)</span></label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="When writing database queries, always use parameterized statements. Prefer React Query for data fetching over useEffect."
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
              />
            </div>
          </div>

          {/* Right — output with target tabs */}
          <div className="flex flex-col gap-3">
            <Tabs value={activeTarget} onValueChange={(v) => setActiveTarget(v as RulesTarget)}>
              <TabsList className="w-full">
                {TARGETS.map((t) => (
                  <TabsTrigger key={t.id} value={t.id} className="flex-1 font-mono text-[12px]">
                    {t.label}
                    <span className="ml-1.5 text-slate-400 text-[10px]">{t.file}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {hasContent && outputs ? (
              <OutputCard
                content={outputs[activeTarget]}
                filename={getFilename(activeTarget)}
                label={`${activeTarget}: ${getFilename(activeTarget)}`}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[340px] flex flex-col items-center justify-center gap-2">
                <p className="text-[13px] text-slate-400 font-mono">Preview updates as you type</p>
                <p className="text-[11px] text-slate-300">Switch tabs above to see each format</p>
              </div>
            )}

            {hasContent && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] text-blue-700 leading-relaxed flex flex-col gap-1.5">
                <p><strong className="font-semibold">Cursor:</strong> Save as <code className="bg-blue-100 px-1 rounded font-mono">.cursorrules</code> in your project root.</p>
                <p><strong className="font-semibold">Copilot:</strong> Save as <code className="bg-blue-100 px-1 rounded font-mono">.github/copilot-instructions.md</code> in your project root.</p>
                <p><strong className="font-semibold">Windsurf:</strong> Save as <code className="bg-blue-100 px-1 rounded font-mono">.windsurfrules</code> in your project root.</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// what are ai coding rules</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  Tell your AI editor how to code — once.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  AI coding tools like Cursor, GitHub Copilot, and Windsurf read a rules file at the root of your project. Every suggestion they make is shaped by that file. Without one, the AI guesses your stack, your style, and your conventions — and it often guesses wrong.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  With a rules file, you define the persona once: the language, the framework, what to always do, what to never do. Every session starts with the AI already knowing your project — no more correcting the same mistakes over and over.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-500">.cursorrules</span>
                  <span className="text-[10px] text-slate-400">· project root</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-600 leading-relaxed bg-white">{`# Cursor Rules
# Generated by SuperMD · supermd.dev/rules-md

You are an expert TypeScript / Next.js App Router developer.

This is a B2B SaaS dashboard. Keep components focused,
server-first, and below 150 lines.

## Stack

- Language: TypeScript
- Framework: Next.js App Router

## Always

- Use server components by default
- Add JSDoc for exported functions

## Never

- Use \`any\` or type casting
- Import from barrel files`}</pre>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// which tool should I use</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              Cursor vs Copilot vs Windsurf — what&apos;s the difference?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  tool: "Cursor",
                  file: ".cursorrules",
                  location: "Project root",
                  desc: "A plain text/markdown file that acts as the system prompt for Cursor's AI. Cursor reads it automatically when you open the project. Can also use @Rules in Cursor's composer.",
                  badge: "Most popular",
                },
                {
                  tool: "GitHub Copilot",
                  file: "copilot-instructions.md",
                  location: ".github/ folder",
                  desc: "Placed in .github/copilot-instructions.md. Copilot reads this across JetBrains, VS Code, and GitHub.com. Structured markdown works best — headers help Copilot parse the sections.",
                  badge: "Works in VS Code",
                },
                {
                  tool: "Windsurf",
                  file: ".windsurfrules",
                  location: "Project root",
                  desc: "Windsurf by Codeium uses .windsurfrules at the project root. Format is identical to .cursorrules — if you use both editors, the same rules work in both files with a rename.",
                  badge: "Same format as Cursor",
                },
              ].map((t) => (
                <div key={t.tool} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-[14px] font-semibold text-slate-800 tracking-[-0.01em]">{t.tool}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{t.badge}</span>
                  </div>
                  <code className="text-[11px] font-mono text-blue-500 bg-blue-50 px-2.5 py-1.5 rounded-lg">{t.file}</code>
                  <p className="text-[12px] text-slate-400 font-mono">📁 {t.location}</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{t.desc}</p>
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
                { q: "Do these files affect AI performance?", a: "Yes — meaningfully. A well-written rules file reduces the number of corrections you need to make per session. AI tools use the file as a persistent system prompt, so every suggestion is pre-filtered through your conventions." },
                { q: "Should I commit rules files to git?", a: "Yes. Committing rules files means every developer on your team gets the same AI behavior. This is especially important for conventions like naming, import patterns, and testing frameworks that differ project-to-project." },
                { q: "How long should a rules file be?", a: "Aim for 200–600 tokens (roughly 150–450 words). Short enough that the AI reads and applies all of it; long enough to cover your stack, conventions, and the most common mistakes to avoid. Longer files get truncated or deprioritized." },
                { q: "Can I use multiple rules files?", a: "Cursor supports project-level .cursorrules and global rules in settings. Windsurf similarly allows both. Copilot only reads the single .github/copilot-instructions.md. For Cursor/Windsurf, use project-level files for project-specific conventions and global rules for personal style." },
                { q: "Do rules work for all languages?", a: "Yes. The rules files are plain text — they work regardless of programming language. The AI uses them as instructions, not as code. You can write rules for Python, Go, Rust, or any language your AI editor supports." },
                { q: "What makes a rules file effective?", a: "Be specific and opinionated. 'Write clean code' does nothing — 'use named exports, never default exports' does. Focus on the decisions the AI gets wrong most often in your codebase: naming, import style, state management approach, and error handling patterns." },
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
