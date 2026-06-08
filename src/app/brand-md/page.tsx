"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Palette, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateBrandMd, type BrandColor, type BrandFont } from "@/lib/generators/brand-md"

const DEFAULT_COLORS: BrandColor[] = [
  { name: "Primary", hex: "", usage: "" },
  { name: "Text", hex: "", usage: "" },
  { name: "Background", hex: "", usage: "" },
]

const DEFAULT_FONTS: BrandFont[] = [
  { role: "Headings", family: "", notes: "" },
  { role: "Body", family: "", notes: "" },
]

function isValidHex(h: string) {
  return /^#?[0-9a-fA-F]{3,8}$/.test(h.trim())
}

function normalizeHex(h: string) {
  const t = h.trim()
  if (!t) return ""
  return t.startsWith("#") ? t : `#${t}`
}

export default function BrandMdPage() {
  const [name, setName] = useState("")
  const [tagline, setTagline] = useState("")
  const [mission, setMission] = useState("")
  const [vision, setVision] = useState("")
  const [values, setValues] = useState(["", "", ""])
  const [audience, setAudience] = useState("")
  const [colors, setColors] = useState<BrandColor[]>(DEFAULT_COLORS)
  const [fonts, setFonts] = useState<BrandFont[]>(DEFAULT_FONTS)
  const [personality, setPersonality] = useState("")
  const [tone, setTone] = useState("")
  const [useWords, setUseWords] = useState("")
  const [avoidWords, setAvoidWords] = useState("")
  const [logoNotes, setLogoNotes] = useState("")
  const [imageryNotes, setImageryNotes] = useState("")

  const hasContent = name.trim().length > 0

  const output = useMemo(() => {
    if (!hasContent) return ""
    const normalizedColors = colors.map((c) => ({ ...c, hex: normalizeHex(c.hex) }))
    return generateBrandMd({ name, tagline, mission, vision, values, audience, colors: normalizedColors, fonts, personality, tone, useWords, avoidWords, logoNotes, imageryNotes })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, tagline, mission, vision, values, audience, colors, fonts, personality, tone, useWords, avoidWords, logoNotes, imageryNotes, hasContent])

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "brand"
  const filename = `${slug}.md`

  // Values helpers
  function addValue() { setValues((v) => [...v, ""]) }
  function removeValue(i: number) { setValues((v) => v.filter((_, idx) => idx !== i)) }
  function updateValue(i: number, val: string) { setValues((v) => { const n = [...v]; n[i] = val; return n }) }

  // Color helpers
  function addColor() { setColors((c) => [...c, { name: "", hex: "", usage: "" }]) }
  function removeColor(i: number) { setColors((c) => c.filter((_, idx) => idx !== i)) }
  function updateColor(i: number, field: keyof BrandColor, val: string) {
    setColors((c) => { const n = [...c]; n[i] = { ...n[i], [field]: val }; return n })
  }

  // Font helpers
  function addFont() { setFonts((f) => [...f, { role: "", family: "", notes: "" }]) }
  function removeFont(i: number) { setFonts((f) => f.filter((_, idx) => idx !== i)) }
  function updateFont(i: number, field: keyof BrandFont, val: string) {
    setFonts((f) => { const n = [...f]; n[i] = { ...n[i], [field]: val }; return n })
  }

  const labelClass = "label-mono mb-1.5 block"
  const taClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700 placeholder:text-slate-300"

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
            <Palette className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">brand.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// brand.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Generate brand guidelines for your AI.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Fill the form. Get a structured <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">brand.md</code> with your colors, fonts, voice, and values — so any LLM stays on brand in every output, every session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8">
          {/* Left — form */}
          <div className="flex flex-col gap-6">

            {/* Identity */}
            <div className="flex flex-col gap-4">
              <p className="label-mono text-slate-400">// identity</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Brand name <span className="text-red-400">*</span></label>
                  <Input
                    placeholder="Acme Inc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {name.trim() && (
                    <p className="mt-1 text-[10px] text-slate-400 font-mono">→ {filename}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <Input
                    placeholder="Build something great."
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Mission</label>
                <textarea
                  className={taClass}
                  rows={2}
                  placeholder="We help developers ship faster by..."
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Vision</label>
                <textarea
                  className={taClass}
                  rows={2}
                  placeholder="A world where every team ships without friction."
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                />
              </div>
            </div>

            {/* Values */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="label-mono text-slate-400">// brand values</p>
                <button onClick={addValue} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              {values.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono w-4 shrink-0">{i + 1}.</span>
                  <Input
                    placeholder={`e.g. Clarity — we communicate without jargon`}
                    value={v}
                    onChange={(e) => updateValue(i, e.target.value)}
                    className="flex-1 text-sm"
                  />
                  {values.length > 1 && (
                    <button onClick={() => removeValue(i)} className="text-slate-300 hover:text-slate-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-[11px] text-slate-400">Tip: use "Value — description" format for richer output.</p>
            </div>

            {/* Audience */}
            <div>
              <p className="label-mono text-slate-400 mb-3">// audience</p>
              <textarea
                className={taClass}
                rows={2}
                placeholder="Senior developers and engineering leaders at B2B SaaS companies (50–500 employees) who care about developer experience."
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            {/* Colors */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="label-mono text-slate-400">// colors</p>
                <button onClick={addColor} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              {colors.map((c, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
                  <Input
                    placeholder="Name (e.g. Primary)"
                    value={c.name}
                    onChange={(e) => updateColor(i, "name", e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-7 w-7 rounded border border-slate-200 shrink-0 transition-colors"
                      style={{ background: isValidHex(c.hex) ? normalizeHex(c.hex) : "#f8fafc" }}
                    />
                    <Input
                      placeholder="#2563eb"
                      value={c.hex}
                      onChange={(e) => updateColor(i, "hex", e.target.value)}
                      className="text-sm font-mono w-[90px]"
                    />
                  </div>
                  <Input
                    placeholder="Usage (CTAs, links…)"
                    value={c.usage}
                    onChange={(e) => updateColor(i, "usage", e.target.value)}
                    className="text-sm"
                  />
                  {colors.length > 1 && (
                    <button onClick={() => removeColor(i)} className="text-slate-300 hover:text-slate-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="label-mono text-slate-400">// typography</p>
                <button onClick={addFont} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              {fonts.map((f, i) => (
                <div key={i} className="grid grid-cols-[0.7fr_1fr_1fr_auto] gap-2 items-center">
                  <Input
                    placeholder="Role (Headings)"
                    value={f.role}
                    onChange={(e) => updateFont(i, "role", e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Font name"
                    value={f.family}
                    onChange={(e) => updateFont(i, "family", e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Notes (600 weight…)"
                    value={f.notes}
                    onChange={(e) => updateFont(i, "notes", e.target.value)}
                    className="text-sm"
                  />
                  {fonts.length > 1 && (
                    <button onClick={() => removeFont(i)} className="text-slate-300 hover:text-slate-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Voice & Tone */}
            <div className="flex flex-col gap-4">
              <p className="label-mono text-slate-400">// voice &amp; tone</p>
              <div>
                <label className={labelClass}>Personality traits</label>
                <Input
                  placeholder="Confident, Clear, Approachable, Technical"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-400">Comma-separated adjectives that describe your brand voice.</p>
              </div>
              <div>
                <label className={labelClass}>Tone description</label>
                <textarea
                  className={taClass}
                  rows={2}
                  placeholder="Direct and precise. We write like a smart colleague, not a marketing deck. No fluff, no jargon."
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Words to use</label>
                  <textarea
                    className={taClass}
                    rows={3}
                    placeholder={"ship, build, fast,\nclear, simple"}
                    value={useWords}
                    onChange={(e) => setUseWords(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Words to avoid</label>
                  <textarea
                    className={taClass}
                    rows={3}
                    placeholder={"leverage, synergy,\nseamless, robust"}
                    value={avoidWords}
                    onChange={(e) => setAvoidWords(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Optional */}
            <details className="group">
              <summary className="cursor-pointer label-mono text-slate-400 hover:text-slate-600 list-none flex items-center gap-1.5">
                <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                Optional (logo usage, imagery)
              </summary>
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Logo usage guidelines</label>
                  <textarea
                    className={taClass}
                    rows={3}
                    placeholder={"Always use on white or light backgrounds.\nMinimum size: 24px height.\nDo not stretch, recolor, or add drop shadow."}
                    value={logoNotes}
                    onChange={(e) => setLogoNotes(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Imagery style</label>
                  <textarea
                    className={taClass}
                    rows={3}
                    placeholder="Real people in real work environments. No stock-photo smiles. Dark/moody for hero shots, light and minimal for product screenshots."
                    value={imageryNotes}
                    onChange={(e) => setImageryNotes(e.target.value)}
                  />
                </div>
              </div>
            </details>

            {!hasContent && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] text-blue-700 leading-relaxed">
                Drop brand.md into any LLM session before writing copy, building UI, or generating assets — it locks in your colors, fonts, and voice so every output is on-brand from line one.
              </div>
            )}
          </div>

          {/* Right — live preview */}
          <div>
            {hasContent ? (
              <OutputCard content={output} filename={filename} label={`brand: ${slug}`} />
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
            <p className="label-mono mb-4">// what is brand.md</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  Give your LLM a brand brief it can actually use.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  Without a brand.md, every LLM session starts from zero. The model picks generic colors, guesses your tone, and writes copy that sounds like every other company. A <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[12px]">brand.md</code> is a single file you drop into context that covers everything: colors, fonts, voice, values, and what to avoid.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  It works in Claude, ChatGPT, Cursor, Copilot — anywhere you have a context window. One file, every session, every output stays on brand.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                  <span className="font-mono text-[11px] text-slate-500">acme.md</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-600 leading-relaxed bg-white overflow-auto">{`# Acme Inc. Brand Guidelines

> Build something great.

## Identity

**Mission**: Help developers ship faster
by removing infrastructure friction.

## Visual Identity

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Primary | \`#2563eb\` | CTAs, links |
| Text | \`#0f172a\` | Headings |

### Typography
| Role | Font | Notes |
|------|------|-------|
| Headings | Inter | 600 weight |
| Body | Inter | 400 weight |

## Voice & Tone

**Personality**: Confident · Clear · Direct

### Avoid
- leverage
- synergy
- seamless`}</pre>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// use cases</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              When does brand.md matter?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Writing brand copy", desc: "Drop brand.md before asking an LLM to write landing page copy, email sequences, or social posts. The tone, vocabulary, and personality are locked in — not guessed.", tag: "Copywriting" },
                { title: "Building UI components", desc: "Pair with style.md for the full picture: brand.md gives the values and voice, style.md gives the exact design tokens. Together they give your AI a complete brand brief.", tag: "UI building" },
                { title: "Consistent multi-session projects", desc: "Context windows reset between sessions. brand.md persists your brand identity so every session — whether writing, designing, or coding — starts from the same foundation.", tag: "Long projects" },
                { title: "Team-wide AI workflows", desc: "When multiple people in your team use AI, brand.md standardizes the output. Everyone references the same file — no more off-brand copy or inconsistent design decisions.", tag: "Teams" },
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
                { q: "What's the difference between brand.md and style.md?", a: "style.md extracts visual design tokens (exact hex values, font names, radii) from a live website's CSS. brand.md is a hand-crafted document covering your brand identity, values, voice, and messaging guidelines — the strategic layer style.md can't extract automatically." },
                { q: "How is brand.md different from a traditional brand guide?", a: "Traditional brand guides are long PDF documents designed for humans. brand.md is optimized for LLMs — concise, structured, and short enough to fit comfortably in a context window. Every section is written so a model can parse and apply it, not just read it." },
                { q: "Where should I put the file?", a: "In your repo root alongside CLAUDE.md or AGENTS.md, or in a /brand directory. Reference it in your first prompt: 'See acme.md for brand context before writing any copy or building any UI.'" },
                { q: "Can I combine brand.md with style.md?", a: "Yes — that's the ideal setup. Use style.md to capture the exact visual tokens (colors, fonts, radii) from your site and brand.md for the identity, values, and voice. Pass both files as context for any UI or copy task." },
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
