import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, BookOpen, Wrench, Globe, Brain, Pencil, Code2, FileDown, BookMarked, ScrollText, Zap, MessageSquare, Network, Table, Plug, Paintbrush, Palette, FolderOpen } from "lucide-react"
import { TokenTicker } from "@/components/home/TokenTicker"
import { Footer } from "@/components/layout/Footer"

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
    status: "live" as const,
    icon: BookOpen,
    name: "claude.md",
    tag: "Codebase context",
    description:
      "Paste a GitHub URL. Get a CLAUDE.md that gives Claude exactly what it needs — framework, scripts, conventions, structure.",
    href: "/claude-md",
  },
  {
    status: "live" as const,
    icon: Wrench,
    name: "skill.md",
    tag: "Claude Code",
    description:
      "Fill the form. Get a skill.md ready to drop into Claude Code — trigger, steps, and args defined in seconds.",
    href: "/skill-md",
  },
  {
    status: "live" as const,
    icon: Globe,
    name: "llms.txt",
    tag: "Website indexing",
    description:
      "Paste your URL. Get spec-compliant llms.txt so any LLM can navigate your site without hallucinating your content.",
    href: "/llms-txt",
  },
  {
    status: "live" as const,
    icon: Brain,
    name: "context.md",
    tag: "Knowledge layer",
    description:
      "Build a reusable context file for any topic, domain, or project. Brief any LLM instantly without repeating yourself every session.",
    href: "/context-md",
  },
  {
    status: "live" as const,
    icon: Pencil,
    name: "design.md",
    tag: "Feature design",
    description:
      "Fill the form. Get a structured design doc covering context, problem, solution, and data model — ready to paste before your LLM starts coding.",
    href: "/design-md",
  },
  {
    status: "live" as const,
    icon: Code2,
    name: "html-to-md",
    tag: "HTML → Markdown",
    description:
      "Paste HTML or drop a URL. Get clean LLM-ready markdown — nav, scripts, and noise stripped automatically.",
    href: "/html-to-md",
  },
  {
    status: "live" as const,
    icon: FileDown,
    name: "md-to-pdf",
    tag: "Markdown → PDF",
    description:
      "Paste markdown and download a styled PDF. Headings, code blocks, and tables rendered with clean print-ready typography.",
    href: "/md-to-pdf",
  },
  {
    status: "live" as const,
    icon: ScrollText,
    name: "rules.md",
    tag: "AI editor rules",
    description:
      "Fill one form. Get .cursorrules, copilot-instructions.md, and .windsurfrules — formatted correctly for Cursor, GitHub Copilot, and Windsurf.",
    href: "/rules-md",
  },
  {
    status: "live" as const,
    icon: Zap,
    name: "compress",
    tag: "Token reduction",
    description:
      "Paste any prompt or document. Filler phrases removed, redundancy stripped, whitespace cleaned — fewer tokens, same meaning. Runs in your browser.",
    href: "/compress",
  },
  {
    status: "live" as const,
    icon: MessageSquare,
    name: "prompt.md",
    tag: "System prompts",
    description:
      "Fill the form, get a structured system prompt. Role, task, constraints, output format, and few-shot examples — formatted for Claude, GPT-4o, or Gemini.",
    href: "/prompt-md",
  },
  {
    status: "live" as const,
    icon: Network,
    name: "agents.md",
    tag: "Multi-agent systems",
    description:
      "Define agent roles, tools, triggers, and handoff rules. Get a structured AGENTS.md any LLM or agent runtime can read to understand your system.",
    href: "/agents-md",
  },
  {
    status: "live" as const,
    icon: Table,
    name: "csv-to-md",
    tag: "CSV → Markdown",
    description:
      "Paste any CSV — comma, tab, or semicolon separated. Get a clean markdown table LLMs can read and reason over. Auto-detects delimiter, handles quoted fields.",
    href: "/csv-to-md",
  },
  {
    status: "live" as const,
    icon: Plug,
    name: "api.md",
    tag: "OpenAPI → Markdown",
    description:
      "Paste an OpenAPI or Swagger JSON spec. Get LLM-readable API docs — endpoints, parameters, and schemas without the JSON noise. 40–70% fewer tokens.",
    href: "/api-md",
  },
  {
    status: "live" as const,
    icon: Paintbrush,
    name: "style.md",
    tag: "Design extraction",
    description:
      "Paste any URL. Get a style.md with the exact colors, fonts, radii, and shadows extracted from the site's CSS — so your AI can match the design precisely.",
    href: "/style-md",
  },
  {
    status: "live" as const,
    icon: Palette,
    name: "brand.md",
    tag: "Brand guidelines",
    description:
      "Fill the form. Get a structured brand.md with colors, typography, voice, and values — so your AI stays on brand in every output, every session.",
    href: "/brand-md",
  },
  {
    status: "live" as const,
    icon: FolderOpen,
    name: "project.md",
    tag: "Brand + design",
    description:
      "Paste a URL to extract design tokens, fill your brand details, and download one project.md — identity, colors, CSS tokens, typography, and voice all combined.",
    href: "/project-md",
  },
]

const GUIDES = [
  {
    title: "What is Tokenmaxxing?",
    tag: "Token efficiency",
    description: "The Silicon Valley trend that failed — and what token efficiency actually means. Includes benchmarks for 10 reduction techniques.",
    href: "/tokenmaxxing",
  },
  {
    title: "How to Save Claude Credits",
    tag: "Claude",
    description: "How the 5-hour rolling window works, what burns credits fastest, and 9 techniques to reduce token usage by up to 90%.",
    href: "/save-claude-credits",
  },
  {
    title: "ChatGPT Message Limit",
    tag: "ChatGPT",
    description: "How the 160-message rolling cap works across GPT-5.5, o3, and o4-mini — and 8 ways to get 3× more without upgrading.",
    href: "/chatgpt-message-limit",
  },
  {
    title: "PDF to Markdown for AI",
    tag: "RAG · LLMs",
    description: "Why PDFs waste 60–70% of your token budget, how to convert accurately, and optimal chunking strategies for RAG pipelines.",
    href: "/pdf-to-markdown-for-ai",
  },
  {
    title: "What is llms.txt?",
    tag: "Web · AI indexing",
    description: "844K sites have implemented it. What llms.txt actually does, which AI tools read it, and how to write one in under 30 minutes.",
    href: "/what-is-llms-txt",
  },
  {
    title: "What is Markdown?",
    tag: "Fundamentals",
    description: "The complete guide to .md files — syntax, use cases, why LLMs prefer it, and how format differs per model.",
    href: "/what-is-markdown",
  },
]

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Dot grid texture — fades out toward bottom */}
      <div
        className="dot-grid dot-grid-fade pointer-events-none absolute inset-0 z-0"
        style={{ opacity: 0.35 }}
      />

      {/* Top accent line */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #2563eb60 30%, #2563eb90 50%, #2563eb60 70%, transparent 100%)",
        }}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
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
              href="#guides"
              className="text-[14px] font-medium tracking-[-0.01em] text-slate-500 hover:text-slate-900 transition-colors"
            >
              Guides
            </Link>
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

      <main className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* Hero */}
        <section className="relative pt-24 pb-20 flex flex-col items-center text-center gap-7">
          {/* Blue glow blob behind headline */}
          <div
            className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full"
            style={{
              background: "radial-gradient(ellipse at center, #dbeafe 0%, #eff6ff 40%, transparent 70%)",
              filter: "blur(40px)",
              opacity: 0.7,
              zIndex: -1,
            }}
          />
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-medium"
            style={{ borderColor: "#bfdbfe", background: "rgba(239,246,255,0.8)", color: "#2563eb", backdropFilter: "blur(8px)" }}
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
        <section className="border-t border-slate-200 bg-white/60 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <TokenTicker />
            <div className="stat-box">
              <span className="stat-number">63%</span>
              <span className="stat-label">max token reduction (XLSX)</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">8</span>
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

            <div className="grid grid-cols-2 gap-0 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
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

        {/* What is Markdown — guide teaser */}
        <section className="py-20 border-t border-slate-200">
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm" style={{ background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%, #f8faff 100%)" }}>
            <div className="p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-start">
              <div
                className="rounded-xl p-3 shrink-0"
                style={{ background: "#eff6ff", color: "#2563eb" }}
              >
                <BookMarked className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="label-mono mb-3">// guide</p>
                <h2
                  className="text-[26px] font-semibold tracking-[-0.04em] leading-[1.2] mb-3"
                  style={{ color: "#0a0f1e" }}
                >
                  What is Markdown?
                </h2>
                <p
                  className="text-[15px] font-medium leading-[1.65] tracking-[-0.012em] max-w-xl mb-2"
                  style={{ color: "#64748b" }}
                >
                  Markdown is a lightweight plain-text formatting syntax created in 2004. It uses simple symbols
                  like <code className="bg-blue-100 px-1 rounded font-mono text-[13px] text-blue-700">#</code> for
                  headings and <code className="bg-blue-100 px-1 rounded font-mono text-[13px] text-blue-700">**bold**</code> for
                  emphasis — and converts to HTML, PDF, or any output format.
                </p>
                <p
                  className="text-[15px] font-medium leading-[1.65] tracking-[-0.012em] max-w-xl"
                  style={{ color: "#64748b" }}
                >
                  It&apos;s the de-facto format for README files, documentation sites, AI context files,
                  and RAG pipelines — and it uses up to 58% fewer tokens than raw PDF or HTML.
                </p>
                <div className="mt-6">
                  <Link href="/what-is-markdown">
                    <button
                      className="flex items-center gap-1.5 text-[14px] font-semibold tracking-[-0.01em] transition-all group"
                      style={{ color: "#2563eb" }}
                    >
                      Read the full guide
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="shrink-0 flex sm:flex-col gap-4 sm:gap-6 sm:border-l sm:border-slate-200 sm:pl-8">
                {[
                  { value: "2004", label: "Created by" },
                  { value: ".md", label: "File extension" },
                  { value: "−58%", label: "Fewer tokens vs PDF" },
                ].map((s) => (
                  <div key={s.label} className="text-center sm:text-left">
                    <p className="text-[20px] font-semibold tracking-[-0.03em]" style={{ color: "#2563eb" }}>{s.value}</p>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
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
            <p className="text-[13px] font-mono text-slate-400">[{TOOLS.length} live]</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {TOOLS.map((tool, i) => {
              const Icon = tool.icon
              const isLive = tool.status === "live"
              const isRight = i % 2 !== 0
              const isBottom = i >= 2

              return (
                <div
                  key={tool.name}
                  className={`p-8 flex flex-col gap-5 transition-colors ${isRight ? "border-l border-slate-200" : ""} ${isBottom ? "border-t border-slate-200" : ""}`}
                  style={{ background: isLive ? "rgba(239,246,255,0.25)" : "rgba(255,255,255,0.6)" }}
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

        {/* Guides */}
        <section id="guides" className="py-20 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="label-mono mb-4">// guides</p>
              <h2
                className="text-[38px] font-semibold tracking-[-0.04em] leading-[1.15]"
                style={{ color: "#0a0f1e" }}
              >
                Learn how to use AI more efficiently.
              </h2>
            </div>
            <p className="text-[13px] font-mono text-slate-400">[{GUIDES.length} guides]</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDES.map((guide) => (
              <Link key={guide.href} href={guide.href} className="group">
                <div className="h-full rounded-xl border border-slate-200 p-6 flex flex-col gap-3 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full w-fit"
                    style={{ background: "#eff6ff", color: "#2563eb" }}
                  >
                    {guide.tag}
                  </span>
                  <h3
                    className="text-[15px] font-semibold tracking-[-0.02em] leading-snug"
                    style={{ color: "#0a0f1e" }}
                  >
                    {guide.title}
                  </h3>
                  <p className="text-[13px] font-medium leading-[1.6] text-slate-500 flex-1">
                    {guide.description}
                  </p>
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 mt-1">
                    Read guide <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="relative py-20 border-t border-slate-200 flex flex-col items-center text-center gap-6 rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f0f4ff 100%)" }}
        >
          {/* Decorative corner dots */}
          <div className="pointer-events-none absolute top-6 left-6 h-2 w-2 rounded-full" style={{ background: "#2563eb", opacity: 0.2 }} />
          <div className="pointer-events-none absolute top-6 right-6 h-2 w-2 rounded-full" style={{ background: "#2563eb", opacity: 0.2 }} />
          <div className="pointer-events-none absolute bottom-6 left-6 h-2 w-2 rounded-full" style={{ background: "#2563eb", opacity: 0.2 }} />
          <div className="pointer-events-none absolute bottom-6 right-6 h-2 w-2 rounded-full" style={{ background: "#2563eb", opacity: 0.2 }} />
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

      <Footer />
    </div>
  )
}
