import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "How to Save Claude Credits: 9 Proven Techniques (2026) — SuperMD",
  description:
    "Hitting Claude usage limits? Learn exactly how Claude's 5-hour rolling window works, what burns credits fastest, and 9 techniques to reduce token usage by up to 90% — including the file format most users get wrong.",
  keywords: [
    "save Claude credits",
    "how to save Claude tokens",
    "Claude usage limits",
    "Claude Pro limits",
    "reduce Claude token usage",
    "Claude 5-hour rolling window",
    "Claude credits running out",
    "Claude Pro worth it",
    "Claude API cost reduction",
    "Claude prompt caching",
    "Claude token optimization",
    "hit Claude limit",
  ],
  alternates: { canonical: "https://supermd.dev/save-claude-credits" },
  openGraph: {
    title: "How to Save Claude Credits: 9 Proven Techniques (2026)",
    description:
      "Most users burning through Claude Pro limits are doing one thing wrong: uploading PDFs instead of markdown. Here's the complete guide to reducing Claude token usage.",
    url: "https://supermd.dev/save-claude-credits",
  },
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many credits does Claude Pro give me?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claude Pro ($20/month) gives approximately 44,000 tokens per 5-hour rolling window — not a monthly bucket. Claude Max 5x ($100/month) gives ~220,000 tokens per 5-hour window. There is no fixed monthly credit limit; instead, you have a rolling window that refreshes continuously based on when you last hit the limit.",
      },
    },
    {
      "@type": "Question",
      name: "When does my Claude usage reset?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claude uses a 5-hour rolling window, not a daily or monthly reset. If you hit the limit at 2pm, you can resume at 7pm. The window resets 5 hours after you first sent a message in that session — not at midnight or a fixed time each day.",
      },
    },
    {
      "@type": "Question",
      name: "What burns Claude credits the fastest?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The fastest credit-burners are: (1) Extended thinking — billed at output token rates which are 5x the input rate. (2) PDF uploads — a 50-page PDF can consume 75,000 tokens, the same content as markdown uses ~21,000. (3) Long conversations — Claude re-reads the entire thread on every message. (4) Tool use — each MCP server adds up to 18,000 tokens to the system prompt per turn.",
      },
    },
    {
      "@type": "Question",
      name: "Does Claude Pro include API credits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The $20/month Claude Pro subscription and the Anthropic API are billed completely separately. Pro gives you claude.ai chat access with a 5-hour rolling window. API access is pay-as-you-go at $3–$5 per million input tokens (model-dependent). Claude Code also requires separate 'extra usage' credits since early 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Can I buy more Claude credits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Claude.ai has an 'Extra Usage' feature in Settings > Usage that lets you purchase additional capacity billed at API rates. The daily limit is $2,000 per day. Alternatively, upgrading to Claude Max 5x ($100/month) or Max 20x ($200/month) gives 5x or 20x the standard Pro window.",
      },
    },
    {
      "@type": "Question",
      name: "How much do PDFs cost in Claude tokens vs markdown?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A 50-page PDF typically consumes 70,000–75,000 tokens in Claude. The same document converted to clean markdown uses approximately 21,000 tokens — a 72% reduction. The savings come from stripping repeated headers/footers, layout metadata, font references, and formatting overhead that PDFs carry on every page.",
      },
    },
  ],
}

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Save Claude Credits: 9 Proven Techniques (2026)",
  description: "Complete guide to reducing Claude token usage — how the 5-hour rolling window works, what burns credits fastest, and 9 techniques including markdown conversion, prompt caching, and context trimming.",
  author: { "@type": "Organization", name: "SuperMD" },
  publisher: { "@type": "Organization", name: "SuperMD", url: "https://supermd.dev" },
  mainEntityOfPage: "https://supermd.dev/save-claude-credits",
  datePublished: "2026-06-01",
  dateModified: "2026-06-01",
}

const TECHNIQUES = [
  {
    n: "01",
    title: "Convert files to markdown before uploading",
    saving: "60–90% reduction",
    body: "This is the single most impactful change most users can make. A 50-page PDF burns 75,000 tokens. Converted to clean markdown, it uses ~21,000. The PDF carries repeated headers, footers, layout metadata, and font references — the model pays for all of it. Markdown carries only content.",
    cta: { label: "Convert files free", href: "/markitdown" },
  },
  {
    n: "02",
    title: "Use prompt caching for repeated context",
    saving: "90% on cache reads",
    body: "If you regularly start sessions with the same system prompt, codebase snippet, or reference document, Claude API prompt caching stores it and recharges at just $0.30/MTok (vs $3.00/MTok standard). For claude.ai users, upload documents to a Project once — they persist across conversations without re-tokenising on every turn.",
    cta: null,
  },
  {
    n: "03",
    title: "Start new conversations instead of continuing long ones",
    saving: "~20% reduction",
    body: "Claude re-reads the entire conversation history on every single message. By message 15, you're paying for messages 1–14 on every turn. For a new task that doesn't need prior context, use /clear or start a fresh chat. Use /compact to create a compressed summary before switching topics within the same session.",
    cta: null,
  },
  {
    n: "04",
    title: "Turn off extended thinking for routine tasks",
    saving: "Up to 9× cheaper",
    body: "Extended thinking tokens are billed at output token rates — already 5× more expensive than input. For complex reasoning tasks, extended thinking is worth it. For summarising, formatting, or simple Q&A, disable it. The savings are immediate and significant.",
    cta: null,
  },
  {
    n: "05",
    title: "Use Claude Projects for document-heavy workflows",
    saving: "7–10× fewer tokens",
    body: "Claude Projects use retrieval-augmented generation (RAG) — they retrieve only the relevant parts of uploaded documents rather than loading the full document into context. Upload your reference material once to a Project, then ask questions against it. This avoids re-uploading and loading full docs on every turn.",
    cta: null,
  },
  {
    n: "06",
    title: "Constrain output length explicitly",
    saving: "40–70% on output cost",
    body: "Output tokens cost 5× more than input tokens on most Claude models. If you ask an open-ended question, Claude may generate 1,000 tokens when 200 would have answered it. Add length constraints: 'Reply in 3 bullet points', 'Max 150 words', 'JSON only'. Set stop sequences to terminate generation at a defined endpoint.",
    cta: null,
  },
  {
    n: "07",
    title: "Route to Haiku for simple tasks",
    saving: "60–80% cost reduction",
    body: "Claude Haiku 4.5 costs $1/MTok input and $5/MTok output. Claude Sonnet 4.6 costs $3/$15. Claude Opus 4.7 costs $5/$25. For summarisation, extraction, reformatting, or classification tasks, Haiku produces equivalent quality at one-fifth the cost. Reserve Sonnet and Opus for tasks that actually require advanced reasoning.",
    cta: null,
  },
  {
    n: "08",
    title: "Minimise tool and MCP server definitions",
    saving: "Up to 18K tokens/turn",
    body: "Each MCP server loaded into Claude Code adds up to 18,000 tokens to the system prompt per turn — even if that server is never used. Unload servers you don't need for the current task. In the API, use dynamic toolsets that only include the tools relevant to the current request.",
    cta: null,
  },
  {
    n: "09",
    title: "Crop and resize images before sending",
    saving: "Up to 96% on vision tokens",
    body: "Vision tokens are calculated as (width × height) / 750. A 1,000×1,000 pixel screenshot costs ~1,334 tokens. A 200×200 crop of the relevant area costs ~54 tokens. Crop, resize, and reduce image resolution before sending to Claude. Use a focused crop rather than a full-screen capture.",
    cta: null,
  },
]

export default function SaveClaudeCredits() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }} />

      <div className="relative min-h-screen bg-white overflow-x-hidden">
        <div className="dot-grid dot-grid-fade pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.35 }} />
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10" style={{ background: "linear-gradient(90deg, transparent 0%, #2563eb60 30%, #2563eb90 50%, #2563eb60 70%, transparent 100%)" }} />

        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-14">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link href="/" className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">SuperMD</Link>
            </div>
            <Link href="/markitdown">
              <Button size="sm" style={{ background: "#2563eb", color: "#fff" }} className="gap-1.5 font-semibold text-[13px]">
                Convert a file <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="relative z-10 max-w-[860px] mx-auto px-6 py-14">

          <div className="mb-12">
            <p className="label-mono mb-4">// guide</p>
            <h1 className="text-[44px] font-semibold tracking-[-0.045em] leading-[1.08] text-slate-900 mb-5">
              How to save Claude credits.<br />
              <span style={{ color: "#2563eb" }}>9 techniques that actually work.</span>
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed font-medium max-w-2xl">
              One user wasted 1 million tokens uploading PDFs to Claude — then discovered the same documents
              as markdown used 90% fewer tokens. Here&apos;s how Claude&apos;s limits actually work and how to
              make them go much further.
            </p>
          </div>

          {/* Quick answer */}
          <section className="mb-12 rounded-xl border-l-4 border-blue-500 bg-blue-50 px-6 py-5">
            <p className="label-mono mb-2" style={{ color: "#2563eb" }}>// quick answer</p>
            <p className="text-[15px] text-slate-700 leading-relaxed">
              Claude Pro uses a <strong>5-hour rolling window</strong> — not a monthly bucket. The fastest way to save credits
              is to <strong>convert PDFs and DOCX files to markdown</strong> before uploading (60–90% fewer tokens), turn off
              extended thinking for routine tasks, and start fresh conversations instead of continuing long threads.
            </p>
          </section>

          {/* How credits work */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">How Claude&apos;s credits actually work</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              &ldquo;Credits&rdquo; in Claude.ai aren&apos;t a prepaid balance. They&apos;re a <strong>rolling usage window</strong> that refreshes
              continuously. Understanding the mechanics is the first step to using them efficiently.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { plan: "Claude Pro", price: "$20/mo", tokens: "~44K tokens", window: "per 5-hour window" },
                { plan: "Claude Max 5x", price: "$100/mo", tokens: "~220K tokens", window: "per 5-hour window" },
                { plan: "Claude Max 20x", price: "$200/mo", tokens: "~880K tokens", window: "per 5-hour window" },
              ].map((p, i) => (
                <div key={p.plan} className={`p-5 ${i < 2 ? "border-r border-slate-200" : ""}`}>
                  <p className="text-[12px] font-semibold text-slate-500 mb-1">{p.plan}</p>
                  <p className="text-[22px] font-bold tracking-[-0.03em] text-slate-800 leading-none mb-1">{p.tokens}</p>
                  <p className="text-[11px] text-slate-400">{p.window}</p>
                  <p className="text-[11px] font-mono text-blue-600 mt-2">{p.price}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {[
                { label: "Input tokens", detail: "Your prompts, conversation history, file contents, system prompts, tool definitions. Charged at the base rate." },
                { label: "Output tokens", detail: "All text Claude generates. Costs 5× more than input — the most important cost driver to control." },
                { label: "Extended thinking tokens", detail: "Claude's internal reasoning. Billed at output token rates. Can cost 9× more than a standard response for the same task." },
                { label: "Cache reads", detail: "Reused context from prompt caching. 90% discount — $0.30/MTok instead of $3.00/MTok on Sonnet." },
                { label: "Vision tokens", detail: "(width × height) / 750. A 1,000×1,000px image = ~1,334 tokens. Crop aggressively." },
              ].map((t, i) => (
                <div key={t.label} className={`px-5 py-4 ${i < 4 ? "border-b border-slate-200" : ""}`}>
                  <h3 className="text-[13px] font-semibold text-slate-800 mb-0.5">{t.label}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{t.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What burns credits fastest */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">What burns Claude credits the fastest</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { culprit: "PDF uploads", why: "Repeated headers/footers, font metadata, layout coordinates. A 50-page PDF = 75,000 tokens. Same content as markdown = 21,000." },
                { culprit: "Extended thinking (always on)", why: "Billed at output rates — 5× more expensive than input. Disable for summarising, formatting, and simple Q&A." },
                { culprit: "Long conversations", why: "Claude re-reads every message on every turn. Message 20 pays for messages 1–19 each time." },
                { culprit: "Tool/MCP overload", why: "Each MCP server loaded adds up to 18,000 tokens to the system prompt per turn, used or not." },
              ].map((c) => (
                <div key={c.culprit} className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <p className="text-[13px] font-semibold text-red-700 mb-1">{c.culprit}</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{c.why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 9 techniques */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">9 techniques to save Claude credits</h2>
            <div className="flex flex-col gap-4">
              {TECHNIQUES.map((t) => (
                <div key={t.n} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-[11px] text-slate-400 mt-1 shrink-0">{t.n}</span>
                      <h3 className="text-[14px] font-semibold text-slate-800">{t.title}</h3>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">{t.saving}</span>
                  </div>
                  <div className="pl-6">
                    <p className="text-[13px] text-slate-500 leading-relaxed mb-3">{t.body}</p>
                    {t.cta && (
                      <Link href={t.cta.href}>
                        <button className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 group">
                          {t.cta.label} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Token cost table */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Claude API pricing reference (2026)</h2>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                <span>Model</span>
                <span>Input</span>
                <span>Output</span>
                <span>Cache read</span>
              </div>
              {[
                { model: "Opus 4.7", input: "$5.00", output: "$25.00", cache: "$0.50" },
                { model: "Sonnet 4.6", input: "$3.00", output: "$15.00", cache: "$0.30" },
                { model: "Haiku 4.5", input: "$1.00", output: "$5.00", cache: "$0.10" },
              ].map((m, i) => (
                <div key={m.model} className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] px-4 py-3 text-[13px] ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"} border-b border-slate-100 last:border-0`}>
                  <span className="font-semibold text-slate-800">Claude {m.model}</span>
                  <span className="text-slate-600">{m.input}/MTok</span>
                  <span className="text-slate-600">{m.output}/MTok</span>
                  <span className="text-green-700 font-semibold">{m.cache}/MTok</span>
                </div>
              ))}
            </div>
            <p className="text-[12px] text-slate-400 mt-2">Batch API: 50% discount on all rates. Cache write: 1.25× input rate, one-time cost.</p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">Frequently asked questions</h2>
            <div className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {FAQ_SCHEMA.mainEntity.map((item, i) => (
                <div key={i} className={`px-5 py-5 ${i < FAQ_SCHEMA.mainEntity.length - 1 ? "border-b border-slate-200" : ""}`}>
                  <h3 className="text-[14px] font-semibold text-slate-800 mb-2">{item.name}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-slate-200 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5" style={{ background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%)" }}>
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-900 mb-1">Stop wasting tokens on PDFs</h2>
              <p className="text-[13px] text-slate-500">Convert your files to LLM-optimised markdown and reduce Claude token usage by up to 90%. Free, in-browser.</p>
            </div>
            <Link href="/markitdown" className="shrink-0">
              <Button style={{ background: "#2563eb", color: "#fff" }} className="gap-2 font-semibold">
                Convert a file free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </section>

        </main>
        <Footer />
      </div>
    </>
  )
}
