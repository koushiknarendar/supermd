"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, FolderOpen, Plus, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import {
  generateProjectMd,
  colorsFromDesign,
  fontsFromDesign,
  type BrandColor,
  type BrandFont,
  type ExtractedDesign,
} from "@/lib/generators/project-md"

const EMPTY_COLORS: BrandColor[] = [
  { name: "Primary", hex: "", usage: "" },
  { name: "Text", hex: "", usage: "" },
  { name: "Background", hex: "", usage: "" },
]

const EMPTY_FONTS: BrandFont[] = [
  { role: "Headings", family: "", notes: "" },
  { role: "Body", family: "", notes: "" },
]

function isValidHex(h: string) { return /^#?[0-9a-fA-F]{3,8}$/.test(h.trim()) }
function normalizeHex(h: string) { const t = h.trim(); return t && !t.startsWith("#") ? `#${t}` : t }

type ExtractStatus = "idle" | "loading" | "done" | "error"

export default function ProjectMdPage() {
  // Brand fields
  const [name, setName] = useState("")
  const [tagline, setTagline] = useState("")
  const [mission, setMission] = useState("")
  const [vision, setVision] = useState("")
  const [values, setValues] = useState(["", ""])
  const [audience, setAudience] = useState("")
  const [colors, setColors] = useState<BrandColor[]>(EMPTY_COLORS)
  const [fonts, setFonts] = useState<BrandFont[]>(EMPTY_FONTS)
  const [personality, setPersonality] = useState("")
  const [tone, setTone] = useState("")
  const [useWords, setUseWords] = useState("")
  const [avoidWords, setAvoidWords] = useState("")

  // Style extraction
  const [siteUrl, setSiteUrl] = useState("")
  const [extractStatus, setExtractStatus] = useState<ExtractStatus>("idle")
  const [extractError, setExtractError] = useState("")
  const [design, setDesign] = useState<ExtractedDesign | null>(null)

  async function handleExtract() {
    let trimmed = siteUrl.trim()
    if (!trimmed) return
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) trimmed = "https://" + trimmed

    setExtractError("")
    setExtractStatus("loading")
    setDesign(null)

    try {
      const res = await fetch("/api/style-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`)
      setDesign(data)
      setExtractStatus("done")

      // Auto-populate colors/fonts if all still empty
      const colorsEmpty = colors.every((c) => !c.hex.trim() && !c.name.trim())
      if (colorsEmpty) {
        const extracted = colorsFromDesign(data)
        if (extracted.length) setColors(extracted)
      }
      const fontsEmpty = fonts.every((f) => !f.family.trim())
      if (fontsEmpty) {
        const extracted = fontsFromDesign(data)
        if (extracted.length) setFonts(extracted)
      }
    } catch (e) {
      setExtractError(e instanceof Error ? e.message : "Could not extract styles.")
      setExtractStatus("error")
    }
  }

  function clearExtraction() {
    setDesign(null)
    setExtractStatus("idle")
    setExtractError("")
    setSiteUrl("")
  }

  // Values
  function addValue() { setValues((v) => [...v, ""]) }
  function removeValue(i: number) { setValues((v) => v.filter((_, idx) => idx !== i)) }
  function updateValue(i: number, val: string) { setValues((v) => { const n = [...v]; n[i] = val; return n }) }

  // Colors
  function addColor() { setColors((c) => [...c, { name: "", hex: "", usage: "" }]) }
  function removeColor(i: number) { setColors((c) => c.filter((_, idx) => idx !== i)) }
  function updateColor(i: number, field: keyof BrandColor, val: string) {
    setColors((c) => { const n = [...c]; n[i] = { ...n[i], [field]: val }; return n })
  }

  // Fonts
  function addFont() { setFonts((f) => [...f, { role: "", family: "", notes: "" }]) }
  function removeFont(i: number) { setFonts((f) => f.filter((_, idx) => idx !== i)) }
  function updateFont(i: number, field: keyof BrandFont, val: string) {
    setFonts((f) => { const n = [...f]; n[i] = { ...n[i], [field]: val }; return n })
  }

  const hasContent = name.trim().length > 0
  const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "project"
  const filename = `${slug}.md`

  const output = useMemo(() => {
    if (!hasContent) return ""
    const normalizedColors = colors.map((c) => ({ ...c, hex: normalizeHex(c.hex) }))
    return generateProjectMd({
      name, tagline, mission, vision, values, audience,
      colors: normalizedColors, fonts,
      personality, tone, useWords, avoidWords,
      design,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, tagline, mission, vision, values, audience, colors, fonts, personality, tone, useWords, avoidWords, design, hasContent])

  const cssVarCount = design ? Object.keys(design.customProperties).filter((k) => !k.startsWith("--tw-")).length : 0

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
            <FolderOpen className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">project.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// project.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            One file. Brand + design + voice.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste a URL to extract design tokens, fill your brand details, and download a single <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">project.md</code> — complete brand guidelines, color palette, CSS tokens, typography, and voice all in one context file.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          {/* Left — form */}
          <div className="flex flex-col gap-6">

            {/* URL extraction */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col gap-3">
              <p className="label-mono text-slate-500">// pull design tokens from URL <span className="text-slate-300 normal-case font-sans font-normal">(optional)</span></p>
              {extractStatus === "done" && design ? (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-emerald-700 mb-1">Styles extracted from {(() => { try { return new URL(design.url).hostname.replace(/^www\./, "") } catch { return design.url } })()}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {cssVarCount > 0 && <span className="text-[11px] text-emerald-600 font-mono">{cssVarCount} CSS vars</span>}
                      {design.googleFonts.length > 0 && <span className="text-[11px] text-emerald-600 font-mono">{design.googleFonts.join(", ")}</span>}
                      {design.colors.length > 0 && <span className="text-[11px] text-emerald-600 font-mono">{design.colors.length} colors</span>}
                      {design.radii.length > 0 && <span className="text-[11px] text-emerald-600 font-mono">{design.radii.length} radii</span>}
                    </div>
                  </div>
                  <button onClick={clearExtraction} className="text-slate-400 hover:text-slate-600 shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="https://linear.app"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && extractStatus !== "loading" && handleExtract()}
                    className="font-mono text-sm flex-1"
                    disabled={extractStatus === "loading"}
                  />
                  <Button
                    onClick={handleExtract}
                    disabled={extractStatus === "loading" || !siteUrl.trim()}
                    style={{ background: "#2563eb", color: "#fff" }}
                    className="shrink-0 gap-1.5"
                  >
                    {extractStatus === "loading"
                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Extracting…</>
                      : "Extract"
                    }
                  </Button>
                </div>
              )}
              {extractStatus === "error" && extractError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-red-700">{extractError}</p>
                </div>
              )}
              {extractStatus === "idle" && (
                <p className="text-[11px] text-slate-400">Colors and fonts will auto-fill from the extracted CSS. You can edit them after.</p>
              )}
            </div>

            {/* Identity */}
            <div className="flex flex-col gap-4">
              <p className="label-mono text-slate-400">// identity</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Project / Brand name <span className="text-red-400">*</span></label>
                  <Input
                    placeholder="Acme Inc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {name.trim() && <p className="mt-1 text-[10px] text-slate-400 font-mono">→ {filename}</p>}
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <Input placeholder="Build something great." value={tagline} onChange={(e) => setTagline(e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Mission</label>
                <textarea className={taClass} rows={2} placeholder="We help developers ship faster by removing infrastructure friction." value={mission} onChange={(e) => setMission(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Vision</label>
                <textarea className={taClass} rows={2} placeholder="A world where every team ships without friction." value={vision} onChange={(e) => setVision(e.target.value)} />
              </div>
            </div>

            {/* Values + Audience */}
            <div className="flex flex-col gap-4">
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
                    <Input placeholder="Clarity — we communicate without jargon" value={v} onChange={(e) => updateValue(i, e.target.value)} className="flex-1 text-sm" />
                    {values.length > 1 && (
                      <button onClick={() => removeValue(i)} className="text-slate-300 hover:text-slate-500"><X className="h-3.5 w-3.5" /></button>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className={labelClass}>Target audience</label>
                <textarea className={taClass} rows={2} placeholder="Senior developers at B2B SaaS companies who care about developer experience." value={audience} onChange={(e) => setAudience(e.target.value)} />
              </div>
            </div>

            {/* Colors */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="label-mono text-slate-400">// colors {extractStatus === "done" && <span className="text-emerald-500 normal-case font-sans text-[10px]">(auto-filled from site)</span>}</p>
                <button onClick={addColor} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              {colors.map((c, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
                  <Input placeholder="Name" value={c.name} onChange={(e) => updateColor(i, "name", e.target.value)} className="text-sm" />
                  <div className="flex items-center gap-1.5">
                    <div className="h-7 w-7 rounded border border-slate-200 shrink-0 transition-colors" style={{ background: isValidHex(c.hex) ? normalizeHex(c.hex) : "#f8fafc" }} />
                    <Input placeholder="#2563eb" value={c.hex} onChange={(e) => updateColor(i, "hex", e.target.value)} className="text-sm font-mono w-[90px]" />
                  </div>
                  <Input placeholder="Usage" value={c.usage} onChange={(e) => updateColor(i, "usage", e.target.value)} className="text-sm" />
                  {colors.length > 1 && (
                    <button onClick={() => removeColor(i)} className="text-slate-300 hover:text-slate-500"><X className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              ))}
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="label-mono text-slate-400">// typography {extractStatus === "done" && <span className="text-emerald-500 normal-case font-sans text-[10px]">(auto-filled from site)</span>}</p>
                <button onClick={addFont} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              {fonts.map((f, i) => (
                <div key={i} className="grid grid-cols-[0.7fr_1fr_1fr_auto] gap-2 items-center">
                  <Input placeholder="Role" value={f.role} onChange={(e) => updateFont(i, "role", e.target.value)} className="text-sm" />
                  <Input placeholder="Font name" value={f.family} onChange={(e) => updateFont(i, "family", e.target.value)} className="text-sm" />
                  <Input placeholder="Notes" value={f.notes} onChange={(e) => updateFont(i, "notes", e.target.value)} className="text-sm" />
                  {fonts.length > 1 && (
                    <button onClick={() => removeFont(i)} className="text-slate-300 hover:text-slate-500"><X className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              ))}
            </div>

            {/* Voice & Tone */}
            <div className="flex flex-col gap-4">
              <p className="label-mono text-slate-400">// voice &amp; tone</p>
              <div>
                <label className={labelClass}>Personality traits</label>
                <Input placeholder="Confident, Clear, Approachable, Technical" value={personality} onChange={(e) => setPersonality(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Tone description</label>
                <textarea className={taClass} rows={2} placeholder="Direct and precise. We write like a smart colleague, not a marketing deck." value={tone} onChange={(e) => setTone(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Words to use</label>
                  <textarea className={taClass} rows={3} placeholder={"ship, build, fast,\nclear, simple"} value={useWords} onChange={(e) => setUseWords(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Words to avoid</label>
                  <textarea className={taClass} rows={3} placeholder={"leverage, synergy,\nseamless, robust"} value={avoidWords} onChange={(e) => setAvoidWords(e.target.value)} />
                </div>
              </div>
            </div>

            {!hasContent && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] text-blue-700 leading-relaxed">
                project.md combines brand.md + style.md into one file. Drop it into any LLM session — it has everything needed to write on-brand copy, build on-brand UI, and stay consistent across tools and sessions.
              </div>
            )}
          </div>

          {/* Right — sticky preview */}
          <div className="lg:sticky lg:top-20">
            {hasContent ? (
              <OutputCard content={output} filename={filename} label={`project: ${slug}`} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[380px] flex flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-[13px] text-slate-400 font-mono">Preview updates as you type</p>
                <p className="text-[11px] text-slate-300 max-w-[200px]">Add a brand name to see your combined project.md</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// what is project.md</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  Every context file your AI needs, in one.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  brand.md covers identity and voice. style.md covers visual tokens. But when you&apos;re building with AI, you want one file — not two. <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[12px]">project.md</code> combines both: paste a URL to pull the exact CSS variables, colors, and fonts, then fill your brand identity and voice to get a complete context file in one download.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Drop it into Claude, Cursor, or ChatGPT before any session. Writing copy, building components, designing layouts — everything starts from the same brief.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-500">acme.md</span>
                  <span className="text-[10px] font-mono text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">brand + style</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-600 leading-relaxed bg-white overflow-auto">{`# Acme — Project Context

> Build something great.

## Identity
**Mission**: Help developers ship faster.

## Visual Design

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Primary | \`#2563eb\` | CTAs |

### Design Tokens (linear.app)
\`\`\`css
--color-indigo: #5e6ad2;
--font-sans: 'Inter Variable';
\`\`\`

### Border Radius
\`4px\` · \`6px\` · \`8px\`

## Voice & Tone
**Personality**: Confident · Clear

### Avoid
- leverage, synergy`}</pre>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12 pb-4">
            <p className="label-mono mb-4">// faq</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              Frequently asked questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { q: "How is this different from brand.md and style.md?", a: "brand.md is identity and voice only. style.md is CSS token extraction only. project.md does both in one form and produces a single combined file — you don't need to manage two separate context files." },
                { q: "What gets auto-filled from the URL?", a: "When you extract a URL, the tool pulls CSS custom properties, Google Fonts, font families, colors, radii, and shadows. If your color and font rows are still empty, they're auto-populated with values from the extraction — you can edit them after." },
                { q: "Do I need to fill in every field?", a: "Only the project name is required. The URL extraction is optional. Fill in as much or as little as is relevant — each section only appears in the output if it has content." },
                { q: "Can I use this with a site I don't own?", a: "Yes — for inspiration and reference. Extract tokens from any public site, then combine with your own brand identity and voice. Useful when building a UI that needs to match an existing product's visual style." },
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
