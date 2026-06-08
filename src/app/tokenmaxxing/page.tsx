import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "What is Tokenmaxxing? The Complete Token Efficiency Guide — SuperMD",
  description:
    "Tokenmaxxing is the practice of maximizing AI token usage — but companies learned it doesn't equal ROI. Learn what tokenmaxxing means, why it failed at Meta, and how to actually reduce LLM costs by up to 90%.",
  keywords: [
    "tokenmaxxing",
    "what is tokenmaxxing",
    "token optimization",
    "token efficiency",
    "reduce LLM tokens",
    "LLM cost reduction",
    "prompt compression",
    "reduce AI API costs",
    "token usage LLM",
    "AI token optimization",
    "how to reduce tokens ChatGPT Claude",
    "tokenmaxxing meaning",
  ],
  alternates: { canonical: "https://supermd.dev/tokenmaxxing" },
  openGraph: {
    title: "What is Tokenmaxxing? The Complete Token Efficiency Guide",
    description:
      "Tokenmaxxing — the Silicon Valley trend of maximizing AI token usage — is officially over as a productivity metric. Here's what it means, why it failed, and how token efficiency actually works.",
    url: "https://supermd.dev/tokenmaxxing",
  },
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is tokenmaxxing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tokenmaxxing has two meanings. In a workplace context, it refers to the trend of companies measuring employee AI productivity by how many tokens they consume — popularized by Meta's internal 'Claudeonomics' leaderboard in early 2026. In a technical context, tokenmaxxing means aggressively optimizing LLM inputs to squeeze the most value from every token — reducing costs, fitting more context, and improving model performance.",
      },
    },
    {
      "@type": "Question",
      name: "Is tokenmaxxing a good productivity metric?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Token consumption does not equal productivity. Meta's internal data showed teams burning 60+ trillion tokens in 30 days without corresponding business outcomes. Fortune declared 'tokenmaxxing is dead' in May 2026. Token efficiency — getting the same or better results with fewer tokens — is the correct metric.",
      },
    },
    {
      "@type": "Question",
      name: "How much can markdown conversion reduce token usage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Converting files to clean markdown reduces token usage by 65–95% depending on the source format. HTML-to-markdown averages 87.5% reduction across representative page types. A 50-page PDF that consumes 75,000 tokens as raw text drops to around 21,000 tokens as clean markdown — a 72% reduction.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between tokenmaxxing and token efficiency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tokenmaxxing (the workplace metric) maximizes token consumption as a sign of AI adoption. Token efficiency minimizes token consumption while maximizing output quality. Token efficiency is the goal: fewer tokens per task means lower costs, faster responses, and more room in the context window for useful content.",
      },
    },
    {
      "@type": "Question",
      name: "What are the most effective techniques to reduce LLM token usage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The most effective token reduction techniques are: (1) converting source files to clean markdown (65–95% reduction), (2) prompt caching for repeated context (90% discount on cache reads), (3) dynamic toolsets instead of static ones (up to 160x reduction), (4) context pruning with tools like LLMLingua (up to 20x compression), and (5) semantic caching for repeated queries (up to 73% cost reduction).",
      },
    },
    {
      "@type": "Question",
      name: "How do dynamic toolsets reduce token usage by 160x?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Static toolsets pass all tool definitions to the LLM on every request, even if most tools are irrelevant. Dynamic toolsets route only the relevant tool definitions for each specific task. Research by Speakeasy found this reduces input tokens by 96.7% on simple tasks and 91.2% on complex tasks — a 160x reduction vs. static toolsets — while maintaining 100% task success rate.",
      },
    },
  ],
}

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What is Tokenmaxxing? The Complete Token Efficiency Guide",
  description:
    "Tokenmaxxing — the Silicon Valley trend of maximizing AI token usage — failed as a productivity metric. This guide explains what it means, why it failed, and how to actually reduce LLM costs.",
  author: { "@type": "Organization", name: "SuperMD" },
  publisher: { "@type": "Organization", name: "SuperMD", url: "https://supermd.dev" },
  mainEntityOfPage: "https://supermd.dev/tokenmaxxing",
  datePublished: "2026-06-01",
  dateModified: "2026-06-01",
}

const TECHNIQUES = [
  { rank: "01", name: "Markdown conversion", reduction: "65–95%", effort: "Low", notes: "Single highest-leverage technique. HTML, PDF, DOCX → clean MD." },
  { rank: "02", name: "Prompt caching", reduction: "90% on reads", effort: "Medium", notes: "Cache static context. 90% discount on every re-read." },
  { rank: "03", name: "Dynamic toolsets", reduction: "96.7%", effort: "High", notes: "Pass only relevant tool defs per request. 160x vs static." },
  { rank: "04", name: "Context pruning (LLMLingua)", reduction: "~20x", effort: "High", notes: "~1.5 point benchmark loss. Best for long retrieval chains." },
  { rank: "05", name: "Semantic caching", reduction: "~73%", effort: "Medium", notes: "Cache semantically-similar queries. Redis LangCache." },
  { rank: "06", name: "Output length constraints", reduction: "40–70%", effort: "Low", notes: "Output tokens cost 5–6× more than input. Specify length." },
  { rank: "07", name: "Whitespace minification", reduction: "5–15%", effort: "Low", notes: "Strip redundant whitespace, blank lines, HTML entities." },
  { rank: "08", name: "RAG with optimal chunking", reduction: "7–10×", effort: "High", notes: "Retrieve relevant chunks only. Optimal: 128–512 tokens." },
  { rank: "09", name: "Batch processing", reduction: "50%", effort: "Medium", notes: "50% discount on async batch API calls (24h turnaround)." },
  { rank: "10", name: "Babbling suppression", reduction: "62–65%", effort: "High", notes: "Terminate generation early for code tasks. Reduces energy." },
]

export default function Tokenmaxxing() {
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

          {/* Hero */}
          <div className="mb-12">
            <p className="label-mono mb-4">// guide</p>
            <h1 className="text-[44px] font-semibold tracking-[-0.045em] leading-[1.08] text-slate-900 mb-5">
              What is Tokenmaxxing?<br />
              <span style={{ color: "#2563eb" }}>And why token efficiency is what matters.</span>
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed font-medium max-w-2xl">
              Tokenmaxxing started as Silicon Valley&apos;s shorthand for heavy AI adoption. Then Meta built a leaderboard
              for it. Then Fortune declared it dead. Here&apos;s what it actually means — and how to use tokens efficiently.
            </p>
          </div>

          {/* Quick answer */}
          <section className="mb-12 rounded-xl border-l-4 border-blue-500 bg-blue-50 px-6 py-5">
            <p className="label-mono mb-2" style={{ color: "#2563eb" }}>// quick answer</p>
            <p className="text-[15px] text-slate-700 leading-relaxed">
              <strong>Tokenmaxxing</strong> means two things: (1) a workplace trend of measuring employee AI productivity
              by token consumption — widely criticised and now largely abandoned — and (2) a technical practice of
              aggressively optimising LLM inputs to extract maximum value per token. The second meaning is valuable.
              The first is productivity theater. This guide covers both.
            </p>
          </section>

          {/* The Meta Scandal */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Where tokenmaxxing came from</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-4">
              In early April 2026, reports emerged that Meta had built an internal leaderboard called
              <strong> &ldquo;Claudeonomics&rdquo;</strong> — ranking employees by how many AI tokens they consumed.
              Top users earned titles like &ldquo;Token Legend.&rdquo; The leaderboard tracked 85,000+ employees
              and documented <strong>60.2 trillion tokens consumed in 30 days</strong>. One individual burned
              <strong> 281 billion tokens in a single month</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { value: "60.2T", label: "Tokens in 30 days", sub: "Meta's total consumption" },
                { value: "281B", label: "Top individual", sub: "Tokens in one month" },
                { value: "85K+", label: "Employees tracked", sub: "On the leaderboard" },
              ].map((s, i) => (
                <div key={s.label} className={`p-5 ${i < 2 ? "border-r border-slate-200" : ""}`}>
                  <p className="text-[28px] font-bold tracking-[-0.03em] leading-none mb-1" style={{ color: "#2563eb" }}>{s.value}</p>
                  <p className="text-[13px] font-semibold text-slate-700 mb-0.5">{s.label}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{s.sub}</p>
                </div>
              ))}
            </div>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-4">
              The &ldquo;-maxxing&rdquo; suffix comes from Gen Z slang (looksmaxxing, sleepmaxxing) — meaning to optimise or
              maximise something. Applied to tokens, it described the trend of consuming as many AI tokens as possible
              as a proxy for productivity.
            </p>
            <p className="text-[15px] text-slate-500 leading-relaxed">
              By May 2026, Fortune ran the headline: <strong>&ldquo;Tokenmaxxing is dead.&rdquo;</strong> Companies
              including Uber couldn&apos;t connect token consumption growth to actual business outcomes. Investor Michael
              Burry called the trend &ldquo;crazy, rushed, temporary.&rdquo; Token consumption was measuring effort,
              not results.
            </p>
          </section>

          {/* Why the metric fails */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Why token consumption is the wrong metric</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Token consumption as a productivity metric fails for the same reason lines-of-code did in the 1980s.
              More isn&apos;t better. A developer who writes 10 clean lines outperforms one who writes 100 redundant ones.
            </p>
            <div className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {[
                { issue: "Formatting overhead", detail: "A PDF fed to an LLM contains repeated headers, footers, layout metadata, and font references. The model pays for all of it in tokens — none of it adds meaning." },
                { issue: "Conversation bloat", detail: "LLMs re-read the entire conversation history on every message. By message 10, you're paying for messages 1–9 every single turn." },
                { issue: "Verbosity loops", detail: "Models rewarded for output (or users who don't constrain output length) generate verbose answers that cost 5–6× more in output tokens." },
                { issue: "Tool noise", detail: "Loading all MCP tool definitions on every request adds thousands of tokens per call — whether the tools are needed or not." },
              ].map((u, i) => (
                <div key={u.issue} className={`px-5 py-4 ${i < 3 ? "border-b border-slate-200" : ""}`}>
                  <h3 className="text-[14px] font-semibold text-slate-800 mb-1">{u.issue}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{u.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Token efficiency */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Token efficiency: the correct approach</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-4">
              Token efficiency measures <em>how much useful output you get per token spent</em>. The goal is the same
              result (or better) with fewer tokens. This reduces API costs, speeds up responses, and frees up context
              window space for content that actually matters.
            </p>
            <div className="rounded-xl border border-slate-200 p-5 mb-6" style={{ background: "rgba(239,246,255,0.4)" }}>
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-[14px] font-semibold text-slate-800 mb-2">The token efficiency equation</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    <strong>Token efficiency = (Output quality × Output usefulness) ÷ Total tokens spent</strong><br />
                    The numerator should go up. The denominator should go down. Both at once is the goal.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Techniques table */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">10 techniques to reduce token usage (with benchmarks)</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Ranked by reduction magnitude. Start with the low-effort wins at the top; add complexity as needed.
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-[2rem_1fr_auto_auto] text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-4 py-2.5 border-b border-slate-200 gap-3">
                <span>#</span>
                <span>Technique</span>
                <span className="text-right">Reduction</span>
                <span className="text-right">Effort</span>
              </div>
              {TECHNIQUES.map((t, i) => (
                <div key={t.rank} className={`px-4 py-3 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"} border-b border-slate-100 last:border-0`}>
                  <div className="grid grid-cols-[2rem_1fr_auto_auto] gap-3 items-start mb-1">
                    <span className="font-mono text-[11px] text-slate-400 mt-0.5">{t.rank}</span>
                    <span className="text-[13px] font-semibold text-slate-800">{t.name}</span>
                    <span className="text-[12px] font-bold text-blue-600 text-right whitespace-nowrap">{t.reduction}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded text-right whitespace-nowrap ${t.effort === "Low" ? "text-green-700 bg-green-50" : t.effort === "Medium" ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50"}`}>{t.effort}</span>
                  </div>
                  <div className="pl-8">
                    <p className="text-[12px] text-slate-400">{t.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Markdown conversion deep dive */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">The highest-leverage technique: markdown conversion</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Converting source documents to clean markdown before sending them to an LLM is the single highest-leverage
              tokenmaxxing technique available. It requires no model changes, no infrastructure, and works immediately.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { format: "Raw PDF", tokens: "75,000", bar: 100, color: "bg-red-300", note: "50-page report" },
                { format: "DOCX / HTML", tokens: "32,000", bar: 43, color: "bg-amber-300", note: "Same content" },
                { format: "Clean Markdown", tokens: "21,000", bar: 28, color: "bg-blue-400", note: "72% fewer tokens" },
              ].map((r, i) => (
                <div key={r.format} className={`p-5 ${i < 2 ? "border-r border-slate-200" : ""}`}>
                  <p className="text-[12px] font-semibold text-slate-600 mb-1">{r.format}</p>
                  <p className="text-[11px] text-slate-400 mb-2">{r.note}</p>
                  <p className="text-[22px] font-bold tracking-[-0.03em] text-slate-800 leading-none mb-3">{r.tokens}</p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
              PDFs carry structural overhead that has nothing to do with content — repeated headers and footers on every
              page, embedded font metadata, layout coordinates, ligature artifacts. An LLM pays for every byte.
              Clean markdown carries just content: headings, paragraphs, tables, code — and nothing else.
            </p>
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
              <p className="text-[13px] text-blue-700">
                <strong>SuperMD markitdown</strong> converts PDFs, DOCX, XLSX, and images to LLM-optimised markdown
                in seconds — in-browser, no upload required on the free tier.{" "}
                <Link href="/markitdown" className="underline font-semibold">Convert a file free →</Link>
              </p>
            </div>
          </section>

          {/* Advanced techniques */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Advanced token efficiency techniques</h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  title: "Prompt caching",
                  body: "Anthropic&apos;s prompt caching API lets you mark static context (system prompts, reference docs, codebases) for caching. Cache reads cost 90% less than standard input tokens — $0.30/MTok vs $3.00/MTok on Sonnet. For workflows that repeatedly reference the same documents, this is often more impactful than format conversion.",
                  stat: "90% discount on cache reads",
                },
                {
                  title: "Dynamic toolsets",
                  body: "Static MCP or tool configurations pass every tool definition on every request — even tools irrelevant to the task. Dynamic toolsets route only the tools needed for each specific request. Speakeasy research found this reduces input tokens by 96.7% on simple tasks while maintaining 100% task success rate.",
                  stat: "160x reduction vs static",
                },
                {
                  title: "Context pruning (LLMLingua)",
                  body: "LLMLingua uses a smaller language model to identify and remove tokens that contribute least to the task. LLMLingua-2 achieves up to 20x compression with approximately 1.5-point loss on benchmarks. Best applied to retrieval chains where large amounts of potentially-relevant text are injected.",
                  stat: "Up to 20x compression",
                },
                {
                  title: "Semantic caching",
                  body: "Semantic caching stores LLM responses and returns cached results for semantically similar queries — even when the exact wording differs. Redis LangCache reports up to 73% cost reduction in high-repetition workloads. Most effective for customer-facing applications with similar repeated queries.",
                  stat: "~73% cost reduction",
                },
                {
                  title: "RAG with optimal chunking",
                  body: "Retrieval-Augmented Generation retrieves only relevant document chunks for each query rather than loading full documents. The optimal chunk size is 128–512 tokens with 0–15% overlap. Max-Min Semantic Chunking embeds text upfront and uses semantic similarity to determine chunk boundaries — reducing vectors created and improving retrieval precision.",
                  stat: "7–10× fewer tokens vs full docs",
                },
              ].map((t) => (
                <div key={t.title} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-[14px] font-semibold text-slate-800">{t.title}</h3>
                    <span className="shrink-0 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">{t.stat}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{t.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Model pricing comparison */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Token cost by model (2026)</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Reducing token count has multiplicative impact. The same reduction applied to a more expensive model
              saves proportionally more money.
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                <span>Model</span>
                <span>Input ($/MTok)</span>
                <span>Output ($/MTok)</span>
                <span>Output multiplier</span>
              </div>
              {[
                { model: "Claude Opus 4.7", input: "$5.00", output: "$25.00", mult: "5×" },
                { model: "Claude Sonnet 4.6", input: "$3.00", output: "$15.00", mult: "5×" },
                { model: "Claude Haiku 4.5", input: "$1.00", output: "$5.00", mult: "5×" },
                { model: "GPT-5.5", input: "$5.00", output: "$30.00", mult: "6×" },
                { model: "GPT-4o", input: "$2.50", output: "$10.00", mult: "4×" },
              ].map((m, i) => (
                <div key={m.model} className={`grid grid-cols-[1.2fr_1fr_1fr_1fr] px-4 py-2.5 text-[13px] ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"} border-b border-slate-100 last:border-0`}>
                  <span className="font-semibold text-slate-800">{m.model}</span>
                  <span className="text-slate-600">{m.input}</span>
                  <span className="text-slate-600">{m.output}</span>
                  <span className="text-blue-600 font-semibold">{m.mult}</span>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-slate-400 mt-3">
              Output tokens cost 4–6× more than input. Constraining output length has high ROI on all models.
            </p>
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
              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-900 mb-1">Start tokenmaxxing the right way</h2>
              <p className="text-[13px] text-slate-500">Convert your files to LLM-optimised markdown. Reduce token usage by up to 95%. Free, in-browser.</p>
            </div>
            <Link href="/markitdown" className="shrink-0">
              <Button style={{ background: "#2563eb", color: "#fff" }} className="gap-2 font-semibold">
                Try markitdown <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </section>

        </main>
        <Footer />
      </div>
    </>
  )
}
