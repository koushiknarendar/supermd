import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, BookOpen, Wrench, Globe } from "lucide-react"
import { TokenTicker } from "@/components/home/TokenTicker"

export const metadata: Metadata = {
  alternates: { canonical: "https://supermd.dev" },
}

const FILE_SAVINGS = [
  { type: "PDF", detail: "headers · footers · page numbers", saving: "58%" },
  { type: "DOCX", detail: "XML overhead · empty styles · boilerplate", saving: "41%" },
  { type: "XLSX", detail: "repeated labels · merged cell noise", saving: "63%" },
  { type: "Images", detail: "OCR noise · whitespace · artefacts", saving: "34%" },
]

const TOOLS = [
  {
    status: "live" as const,
    icon: FileText,
    name: "markitdown",
    tag: "File → MD",
    description:
      "Drop any file. Get LLM-optimized markdown with per-model profiles, token savings display, and RAG-ready chunking.",
    href: "/markitdown",
  },
  {
    status: "soon" as const,
    icon: BookOpen,
    name: "claude.md",
    tag: "Codebase context",
    description:
      "Scan your repo. Get a CLAUDE.md that gives the model exactly what it needs — structured, minimal, no fluff.",
    href: null,
  },
  {
    status: "soon" as const,
    icon: Wrench,
    name: "skill.md",
    tag: "Claude Code",
    description:
      "Turn your runbooks and internal docs into Claude Code skill files that slot directly into your workflow.",
    href: null,
  },
  {
    status: "soon" as const,
    icon: Globe,
    name: "llms.txt",
    tag: "Website indexing",
    description:
      "Generate spec-compliant llms.txt so any LLM can navigate your site without hallucinating your content.",
    href: null,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em]" style={{ color: "#0a0f1e" }}>
              SuperMD
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{ background: "#eff6ff", color: "#2563eb" }}
            >
              Beta
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-[14px] font-medium tracking-[-0.01em] text-slate-500 hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <Link href="/markitdown">
            <Button
              size="sm"
              className="gap-1.5 font-semibold text-[13px]"
              style={{ background: "#2563eb", color: "#fff" }}
            >
              Try markitdown <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6">
        {/* Hero */}
        <section className="pt-24 pb-20 flex flex-col items-center text-center gap-7">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-medium"
            style={{ borderColor: "#bfdbfe", background: "#eff6ff", color: "#2563eb" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: "#2563eb" }}
            />
            The MD generator for the AI era
          </div>

          <h1
            className="text-[64px] sm:text-[72px] font-semibold tracking-[-0.055em] leading-[1.04] max-w-[820px]"
            style={{ color: "#0a0f1e" }}
          >
            Generate the markdown{" "}
            <span style={{ color: "#2563eb" }}>your AI actually needs.</span>
          </h1>

          <p
            className="text-[16px] tracking-[-0.012em] leading-[1.65] max-w-[480px] font-medium"
            style={{ color: "#64748b" }}
          >
            If you&apos;re building with LLMs, your context is where it starts. SuperMD generates
            every MD file your AI consumes — optimized, clean, fewer tokens.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/markitdown">
              <Button
                size="lg"
                className="gap-2 font-semibold tracking-[-0.01em]"
                style={{ background: "#2563eb", color: "#fff" }}
              >
                Start with markitdown <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="font-medium tracking-[-0.01em]"
                style={{ borderColor: "#e2e8f0", color: "#374151" }}
              >
                See pricing
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats row */}
        <section className="border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <TokenTicker />
            <div className="stat-box">
              <span className="stat-number">63%</span>
              <span className="stat-label">max token reduction (XLSX)</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">4</span>
              <span className="stat-label">MD generators in the suite</span>
            </div>
          </div>
        </section>

        {/* Token savings breakdown */}
        <section className="py-20 border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="label-mono mb-4">// token reduction</p>
              <h2
                className="text-[38px] font-semibold tracking-[-0.04em] leading-[1.15] mb-5"
                style={{ color: "#0a0f1e" }}
              >
                Every file type.{" "}
                <span style={{ color: "#64748b" }}>Measurable savings.</span>
              </h2>
              <p
                className="text-[15px] font-medium leading-[1.65] tracking-[-0.012em] max-w-sm"
                style={{ color: "#64748b" }}
              >
                PDFs repeat headers on every page. DOCX files carry XML bloat.
                Spreadsheets re-label every column. SuperMD removes all of it before your
                model sees the file — and shows you exactly how many tokens you saved.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-0 border border-slate-200">
              {FILE_SAVINGS.map((s, i) => (
                <div
                  key={s.type}
                  className={`p-6 flex flex-col gap-2 ${
                    i % 2 === 0 ? "border-r border-slate-200" : ""
                  } ${i < 2 ? "border-b border-slate-200" : ""}`}
                >
                  <span
                    className="text-[32px] font-semibold tracking-[-0.03em] leading-none"
                    style={{ color: "#2563eb" }}
                  >
                    -{s.saving}
                  </span>
                  <span
                    className="text-[13px] font-semibold tracking-[-0.01em]"
                    style={{ color: "#0a0f1e" }}
                  >
                    {s.type}
                  </span>
                  <span className="stat-label" style={{ letterSpacing: "0.06em" }}>
                    {s.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="py-20 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="label-mono mb-4">// toolkit</p>
              <h2
                className="text-[38px] font-semibold tracking-[-0.04em] leading-[1.15]"
                style={{ color: "#0a0f1e" }}
              >
                Every MD file your AI will ever need.
              </h2>
            </div>
            <p className="text-[13px] font-mono text-slate-400">[1 live · 3 coming]</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-slate-200">
            {TOOLS.map((tool, i) => {
              const Icon = tool.icon
              const isLive = tool.status === "live"
              const isRight = i % 2 !== 0
              const isBottom = i >= 2

              return (
                <div
                  key={tool.name}
                  className={`p-8 flex flex-col gap-5 ${isRight ? "border-l border-slate-200" : ""} ${isBottom ? "border-t border-slate-200" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="rounded-lg p-2"
                      style={{
                        background: isLive ? "#eff6ff" : "#f8fafc",
                        color: isLive ? "#2563eb" : "#cbd5e1",
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={
                        isLive
                          ? { background: "#eff6ff", color: "#2563eb" }
                          : { background: "#f1f5f9", color: "#94a3b8" }
                      }
                    >
                      {isLive ? "Live" : "Soon"}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span
                        className="font-mono font-semibold text-[15px] tracking-[-0.01em]"
                        style={{ color: isLive ? "#0a0f1e" : "#94a3b8" }}
                      >
                        {tool.name}
                      </span>
                      <span className="stat-label">{tool.tag}</span>
                    </div>
                    <p
                      className="text-[14px] font-medium leading-[1.6] tracking-[-0.01em]"
                      style={{ color: isLive ? "#64748b" : "#94a3b8" }}
                    >
                      {tool.description}
                    </p>
                  </div>

                  {tool.href ? (
                    <Link href={tool.href} className="mt-auto w-fit">
                      <button
                        className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[-0.01em] transition-all group"
                        style={{ color: "#2563eb" }}
                      >
                        Try free
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </Link>
                  ) : (
                    <span className="mt-auto text-[12px] font-mono text-slate-300">
                      coming soon
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-slate-200 flex flex-col items-center text-center gap-6">
          <p className="label-mono">// start here</p>
          <h2
            className="text-[48px] font-semibold tracking-[-0.05em] leading-[1.08] max-w-[560px]"
            style={{ color: "#0a0f1e" }}
          >
            If you&apos;re starting with LLMs,{" "}
            <span style={{ color: "#2563eb" }}>start here.</span>
          </h2>
          <p
            className="text-[15px] font-medium leading-[1.65] tracking-[-0.01em] max-w-sm"
            style={{ color: "#64748b" }}
          >
            No sign-up. No file upload on the free tier. Every conversion runs in your browser.
          </p>
          <Link href="/markitdown">
            <Button
              size="lg"
              className="gap-2 font-semibold tracking-[-0.01em] mt-2"
              style={{ background: "#2563eb", color: "#fff" }}
            >
              Open markitdown <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[13px] font-medium tracking-[-0.01em]" style={{ color: "#94a3b8" }}>
            © {new Date().getFullYear()} SuperMD
          </span>
          <span className="label-mono">generate the markdown your ai actually needs</span>
        </div>
      </footer>
    </div>
  )
}
