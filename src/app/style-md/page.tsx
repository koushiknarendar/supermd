"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Paintbrush, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateStyleMd, type ExtractedDesign } from "@/lib/generators/style-md"

type Status = "idle" | "loading" | "done" | "error"

export default function StyleMdPage() {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [result, setResult] = useState<ExtractedDesign | null>(null)

  async function handleExtract() {
    let trimmed = url.trim()
    if (!trimmed) { setError("Enter a URL first."); setStatus("error"); return }
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      trimmed = "https://" + trimmed
    }
    setError("")
    setStatus("loading")
    setResult(null)
    try {
      const res = await fetch("/api/style-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`)
      setResult(data)
      setStatus("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not extract styles.")
      setStatus("error")
    }
  }

  function handleReset() {
    setStatus("idle")
    setError("")
    setResult(null)
    setUrl("")
  }

  const loading = status === "loading"
  const output = result ? generateStyleMd(result) : ""

  const hostname = (() => {
    try { return new URL(url).hostname.replace(/^www\./, "") } catch { return "design" }
  })()
  const filename = `${hostname}-style.md`

  const cssVarCount = result ? Object.keys(result.customProperties).filter(k => !k.startsWith("--tw-")).length : 0

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
            <Paintbrush className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">style.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// style.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Copy any website&apos;s design system.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste a URL. Get a <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">style.md</code> with the exact colors, fonts, spacing, radii, and shadows — extracted directly from the site&apos;s CSS. Drop it into your AI to recreate the design precisely.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
          {/* Left — input */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="label-mono mb-2 block">Website URL</label>
              <Input
                placeholder="https://linear.app"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (status !== "idle") { setStatus("idle"); setError(""); setResult(null) }
                }}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleExtract()}
                className="font-mono text-sm"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                Publicly accessible URLs only. Fetches linked CSS stylesheets and inline styles server-side.
              </p>
            </div>

            <Button
              onClick={handleExtract}
              disabled={loading || !url.trim()}
              className="w-fit gap-2"
              style={{ background: "#2563eb", color: "#fff" }}
            >
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Extracting…</>
                : "Extract Design System"
              }
            </Button>

            {status === "error" && error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-700">{error}</p>
              </div>
            )}

            {status === "done" && result && (
              <>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex flex-col gap-1.5">
                  <p className="text-[12px] font-semibold text-emerald-700">Design system extracted</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {cssVarCount > 0 && (
                      <span className="text-[11px] text-emerald-600 font-mono">{cssVarCount} CSS variables</span>
                    )}
                    {result.googleFonts.length > 0 && (
                      <span className="text-[11px] text-emerald-600 font-mono">{result.googleFonts.join(", ")}</span>
                    )}
                    {result.colors.length > 0 && (
                      <span className="text-[11px] text-emerald-600 font-mono">{result.colors.length} colors</span>
                    )}
                    {result.radii.length > 0 && (
                      <span className="text-[11px] text-emerald-600 font-mono">{result.radii.length} radius values</span>
                    )}
                    {result.shadows.length > 0 && (
                      <span className="text-[11px] text-emerald-600 font-mono">{result.shadows.length} shadows</span>
                    )}
                  </div>
                </div>
                <button onClick={handleReset} className="w-fit text-[12px] text-slate-400 hover:text-slate-600 font-mono">
                  ← Extract another
                </button>
              </>
            )}

            {status === "idle" && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 flex flex-col gap-3">
                <p className="label-mono">// what gets extracted</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "CSS custom properties",
                    "Google Fonts",
                    "Color palette",
                    "Font families",
                    "Border radius scale",
                    "Box shadows",
                    "Font size scale",
                    "Body base styles",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-slate-500">
                      <span className="h-1 w-1 rounded-full bg-blue-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — output */}
          <div>
            {status === "done" && output ? (
              <OutputCard content={output} filename={filename} label={`style: ${hostname}`} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center">
                <p className="text-[13px] text-slate-400 font-mono">
                  {loading ? "Fetching stylesheets…" : "style.md output appears here"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// what is style.md</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  Give your AI the real design tokens.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  Telling an LLM &ldquo;match the Linear design&rdquo; means nothing — it will guess. A{" "}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[12px]">style.md</code>{" "}
                  gives it the actual hex values, the exact font stack, the specific border radius scale, and
                  the real shadow definitions extracted directly from the site&apos;s CSS.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Drop it into your context before asking your AI to build UI components and it will match the
                  design precisely — no guessing, no approximation.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                  <span className="font-mono text-[11px] text-slate-500">linear-style.md</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-600 leading-relaxed bg-white overflow-auto">{`# Design System — Linear (linear.app)

> Source: https://linear.app

## Typography
**Google Fonts**: Inter

## Colors
**CSS Color Variables**
\`\`\`css
--color-background: #ffffff;
--color-text: #1a1a1a;
--color-primary: #5E6AD2;
--color-gray-100: #F5F5F5;
\`\`\`

## Border Radius
**Values Found**: \`4px\` · \`6px\` · \`8px\` · \`12px\`

## Shadows
- \`0 1px 2px rgba(0,0,0,0.06)\`
- \`0 4px 8px rgba(0,0,0,0.08)\``}</pre>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// use cases</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              When do you use style.md?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Clone a reference design", desc: "Found a site with design you love? Extract its style.md and drop it into your AI. It will replicate the exact colors, fonts, and spacing — not a rough approximation.", tag: "Design copy" },
                { title: "Reverse-engineer a design system", desc: "Use style.md to document what a site actually uses — CSS variables, font stacks, color palettes. Useful for audit, migration, or rebuilding a design system from scratch.", tag: "Audit" },
                { title: "Brief an AI on a brand", desc: "Working on a project that needs to match a client's existing site? Extract style.md once and reference it in every prompt — consistent design, zero guessing.", tag: "Branding" },
                { title: "Build component libraries", desc: "Starting a UI library that matches a specific design? Feed style.md to your AI before it writes a single component — the tokens are already correct from line one.", tag: "UI library" },
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
                { q: "Does this work on any website?", a: "It works on any publicly accessible website that uses external CSS stylesheets or inline styles. Sites using CSS-in-JS or Tailwind utility classes may yield fewer CSS variables but still expose font families, Google Fonts, and raw color values." },
                { q: "What about sites behind authentication?", a: "style.md fetches the page server-side without any session cookies, so authenticated pages won't return full styles. For private sites, use browser DevTools to inspect computed styles or copy the CSS source manually." },
                { q: "How exact is the extraction?", a: "CSS custom properties (design tokens like --color-primary, --font-sans, --radius-md) are extracted verbatim — these are exact values. Raw color extraction uses frequency analysis on the full CSS, which is accurate for design systems but may include noise on Tailwind-heavy sites." },
                { q: "What's the difference between style.md and design.md?", a: "design.md is a feature design document for briefing an LLM before implementation — it captures problem, solution, decisions. style.md is a visual design token file extracted from a live site — it captures colors, fonts, spacing, and shadows for UI replication." },
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
