import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "ChatGPT Message Limit: How to Stop Hitting the Cap (2026) — SuperMD",
  description:
    "ChatGPT Plus gives 160 messages per 3-hour rolling window — not a daily cap. Learn exactly how the limit works across GPT-5.5, o3, and o4-mini, and 8 techniques to get 3× more output without upgrading to Pro.",
  keywords: [
    "ChatGPT message limit",
    "ChatGPT Plus limits 2026",
    "how many messages ChatGPT Plus",
    "ChatGPT rolling window reset",
    "ChatGPT limit reset time",
    "extend ChatGPT message limit",
    "ChatGPT token limit",
    "reduce ChatGPT token usage",
    "ChatGPT usage limit",
    "ChatGPT Plus cap",
    "ChatGPT file upload tokens",
    "hit ChatGPT limit",
  ],
  alternates: { canonical: "https://supermd.dev/chatgpt-message-limit" },
  openGraph: {
    title: "ChatGPT Message Limit: How to Stop Hitting the Cap (2026)",
    description:
      "ChatGPT Plus's 160-message cap is a rolling window, not a daily reset. Here's how it works — and 8 ways to get 3× more out of it without upgrading to Pro.",
    url: "https://supermd.dev/chatgpt-message-limit",
  },
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many messages does ChatGPT Plus give?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ChatGPT Plus ($20/month) gives 160 messages per 3-hour rolling window for GPT-5.5. For reasoning models: o3 gets 50–100 messages per day, o4-mini gets 500 per day, and GPT-5.5 Thinking gets 3,000 per week. Once you hit the cap, conversations automatically downgrade to the mini model until the window resets.",
      },
    },
    {
      "@type": "Question",
      name: "What time does the ChatGPT Plus limit reset?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ChatGPT Plus does not have a single daily reset time. It uses a 3-hour rolling window: each individual message slot recovers exactly 3 hours after it was sent. If you sent 10 messages at 1pm, those 10 slots recover at 4pm — not all at once at midnight. Weekly limits (GPT-5.5 Thinking: 3,000/week) reset every Sunday at midnight UTC.",
      },
    },
    {
      "@type": "Question",
      name: "How many tokens does a PDF upload use in ChatGPT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PDFs are very token-expensive. A 50-page PDF can consume 40,000–75,000 tokens in ChatGPT, depending on formatting density. The same content converted to clean markdown uses approximately 6,000–21,000 tokens — a 60–87% reduction. ChatGPT has a 2 million token limit per uploaded file across all formats.",
      },
    },
    {
      "@type": "Question",
      name: "Does ChatGPT Pro remove message limits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ChatGPT Pro ($200/month) removes all message caps entirely — unlimited GPT-5.5, unlimited o3, unlimited GPT-5.5 Thinking. It also includes advanced voice and additional features. For heavy daily users or research teams, Pro may be justified. For most users, the techniques in this guide extend Plus limits significantly without the upgrade.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between ChatGPT subscription limits and API credits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "These are two separate billing systems. ChatGPT Plus/Pro subscription gives you access to chat.openai.com with message caps. OpenAI API credits are prepaid balance for developer API access — billed per token, do not expire. The two are completely independent: your $20/month Plus subscription does not include API credits, and API usage does not count against your chat message limits.",
      },
    },
    {
      "@type": "Question",
      name: "Which ChatGPT model uses the fewest messages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GPT-5.5 Thinking has the most generous cap at 3,000 messages per week when manually selected — that's over 400 per day. o4-mini gives 500 per day. GPT-5.5 (standard) gives 160 per 3-hour window. If you need volume, GPT-5.5 Thinking or o4-mini gives you far more messages than standard GPT-5.5.",
      },
    },
  ],
}

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "ChatGPT Message Limit: How to Stop Hitting the Cap (2026)",
  description: "Complete guide to ChatGPT message limits in 2026 — how the rolling window works, per-model caps, and 8 techniques to get more output per message including file format conversion.",
  author: { "@type": "Organization", name: "SuperMD" },
  publisher: { "@type": "Organization", name: "SuperMD", url: "https://supermd.dev" },
  mainEntityOfPage: "https://supermd.dev/chatgpt-message-limit",
  datePublished: "2026-06-01",
  dateModified: "2026-06-01",
}

export default function ChatGPTMessageLimit() {
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
              ChatGPT message limit explained.<br />
              <span style={{ color: "#2563eb" }}>How to stop hitting the cap.</span>
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed font-medium max-w-2xl">
              ChatGPT Plus gives you 160 messages per 3-hour rolling window — not a daily reset. Most users burning
              through that cap are doing it with the wrong file formats. Here&apos;s how the limit works and how to get 3× more out of it.
            </p>
          </div>

          {/* Quick answer */}
          <section className="mb-12 rounded-xl border-l-4 border-blue-500 bg-blue-50 px-6 py-5">
            <p className="label-mono mb-2" style={{ color: "#2563eb" }}>// quick answer</p>
            <p className="text-[15px] text-slate-700 leading-relaxed">
              ChatGPT Plus limits use a <strong>3-hour rolling window</strong>, not a daily reset. The fastest way to preserve
              messages is to <strong>convert PDFs and documents to markdown</strong> before uploading (60–87% fewer tokens per message),
              use one topic per chat, and switch to <strong>GPT-5.5 Thinking</strong> for high-volume work (3,000 messages/week vs 160/3h on standard).
            </p>
          </section>

          {/* How limits work */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">How ChatGPT message limits actually work</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              ChatGPT doesn&apos;t use a single daily reset. It uses a <strong>rolling window</strong>: each message you send uses a slot,
              and that slot recovers exactly 3 hours later. Send 10 messages at 1pm, and those 10 slots come back at 4pm —
              not midnight. This means strategic timing extends your effective capacity.
            </p>

            <div className="rounded-xl border border-slate-200 overflow-hidden mb-6">
              <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                <span>Model</span>
                <span>Cap</span>
                <span>Reset</span>
                <span>Best for</span>
              </div>
              {[
                { model: "GPT-5.5 (standard)", cap: "160 msgs", reset: "3-hour rolling", use: "General chat" },
                { model: "GPT-5.5 Thinking", cap: "3,000 msgs", reset: "Weekly (Sun UTC)", use: "High-volume work" },
                { model: "o3", cap: "50–100 msgs", reset: "Daily", use: "Complex reasoning" },
                { model: "o4-mini", cap: "500 msgs", reset: "Daily", use: "Lightweight reasoning" },
              ].map((m, i) => (
                <div key={m.model} className={`grid grid-cols-[1.2fr_1fr_1fr_1fr] px-4 py-2.5 text-[13px] ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"} border-b border-slate-100 last:border-0`}>
                  <span className="font-semibold text-slate-800">{m.model}</span>
                  <span className="text-blue-600 font-semibold">{m.cap}</span>
                  <span className="text-slate-500">{m.reset}</span>
                  <span className="text-slate-400 text-[12px]">{m.use}</span>
                </div>
              ))}
            </div>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              <strong>Key insight:</strong> GPT-5.5 Thinking gives 3,000 messages per week — that&apos;s ~428 per day,
              nearly 3× the daily equivalent of the standard 160/3h cap. For high-volume users who don&apos;t specifically
              need real-time mode, switching to GPT-5.5 Thinking is the simplest way to triple effective message volume.
            </p>
          </section>

          {/* File format impact */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">How file uploads drain your message limit</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Every file you upload to ChatGPT counts as tokens against your message limit. The format you use
              determines how many tokens — and the difference is dramatic.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { format: "Raw PDF (50 pages)", tokens: "~75,000", bar: 100, color: "bg-red-300", saving: "Worst" },
                { format: "DOCX (50 pages)", tokens: "~32,000", bar: 43, color: "bg-amber-300", saving: "Better" },
                { format: "Plain text", tokens: "~12,000", bar: 16, color: "bg-yellow-300", saving: "Good" },
                { format: "Clean Markdown", tokens: "~9,000", bar: 12, color: "bg-blue-400", saving: "Best" },
              ].map((r) => (
                <div key={r.format} className="p-5 border-b border-r border-slate-200 last:border-r-0 [&:nth-child(even)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[13px] font-semibold text-slate-700">{r.format}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${r.saving === "Best" ? "bg-blue-50 text-blue-700" : r.saving === "Good" ? "bg-green-50 text-green-700" : r.saving === "Better" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{r.saving}</span>
                  </div>
                  <p className="text-[20px] font-bold text-slate-800 mb-2">{r.tokens} tokens</p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              Users uploading PDFs are burning <strong>8× more of their message capacity</strong> than users uploading
              the same content as markdown. Over a work day, this could be the difference between hitting your limit once
              or not hitting it at all.
            </p>
          </section>

          {/* 8 techniques */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">8 ways to get more out of your ChatGPT limit</h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  n: "01",
                  title: "Convert files to markdown before uploading",
                  saving: "60–87% fewer tokens",
                  body: "Convert PDFs, DOCX, and HTML documents to clean markdown before uploading to ChatGPT. The token reduction is immediate — a 50-page PDF at 75,000 tokens becomes ~9,000 tokens as clean markdown. Every upload you make goes further against your message cap.",
                  cta: { label: "Convert files with markitdown", href: "/markitdown" },
                },
                {
                  n: "02",
                  title: "Switch to GPT-5.5 Thinking for volume work",
                  saving: "3× more messages/day",
                  body: "GPT-5.5 Thinking has a weekly cap of 3,000 messages vs 160 per 3-hour window for standard GPT-5.5. For high-volume days — document analysis, code review, research — manually selecting GPT-5.5 Thinking gives you far more capacity. Quality is equivalent or better for reasoning tasks.",
                  cta: null,
                },
                {
                  n: "03",
                  title: "One topic per conversation",
                  saving: "20–40% reduction",
                  body: "ChatGPT reads the entire conversation history on every message. A 200-message marketing thread you then ask one HR question in means the model processes all 200 irrelevant messages first. Start a new chat for each distinct topic to zero out the history cost.",
                  cta: null,
                },
                {
                  n: "04",
                  title: "Specify output length and format upfront",
                  saving: "40–60% on output tokens",
                  body: "Output tokens cost 4–6× more than input tokens in the API. The same principle applies to chat — longer outputs consume more of your effective token budget per message. Tell ChatGPT exactly what you want: '3 bullet points, one line each', 'Respond in JSON only', 'Max 200 words'. It follows constraints reliably.",
                  cta: null,
                },
                {
                  n: "05",
                  title: "Use summaries, not full conversations",
                  saving: "~80% on context reuse",
                  body: "Instead of continuing an old conversation across sessions, save a 3–5 bullet summary of the key decisions and context, then paste it at the start of a new chat. 500 tokens to brief the model vs 5,000+ tokens re-reading the full prior thread — and you reset the rolling window.",
                  cta: null,
                },
                {
                  n: "06",
                  title: "Use o4-mini for high-volume reasoning",
                  saving: "500 msgs/day",
                  body: "o4-mini gives 500 messages per day — 3× more than standard GPT-5.5's rolling equivalent. For tasks that need structured reasoning (data analysis, code debugging, step-by-step planning) but don&apos;t need the full power of o3, o4-mini gives dramatically more capacity.",
                  cta: null,
                },
                {
                  n: "07",
                  title: "Provide pre-summarised content, not raw documents",
                  saving: "50–70% reduction",
                  body: "Before asking ChatGPT to summarise or analyse a document, summarise it yourself first (or use a lightweight tool to extract the key sections). ChatGPT doesn&apos;t need to see a 40-page report to answer a specific question about it — it needs the 5 relevant paragraphs.",
                  cta: null,
                },
                {
                  n: "08",
                  title: "Use the API with prompt caching for batch work",
                  saving: "50–90% for repeated context",
                  body: "For developers or power users running batch workflows, the OpenAI API with prompt caching reduces costs by up to 90% on cached context. The Batch API adds a further 50% discount on async jobs. Output tokens are cached at the same 50% rate. For repeated document analysis against the same content, this stacks to massive savings.",
                  cta: null,
                },
              ].map((t) => (
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

          {/* Plan comparison */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">ChatGPT plan comparison</h2>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                <span>Plan</span>
                <span>Price</span>
                <span>GPT-5.5 cap</span>
                <span>Limits removed</span>
              </div>
              {[
                { plan: "Free", price: "—", cap: "10 msgs/5h", removed: "No" },
                { plan: "Plus", price: "$20/mo", cap: "160 msgs/3h", removed: "No" },
                { plan: "Pro", price: "$200/mo", cap: "Unlimited", removed: "Yes" },
                { plan: "Business", price: "$25/user/mo", cap: "Effectively unlimited", removed: "Mostly" },
              ].map((p, i) => (
                <div key={p.plan} className={`grid grid-cols-[1.2fr_1fr_1fr_1.2fr] px-4 py-2.5 text-[13px] ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"} border-b border-slate-100 last:border-0`}>
                  <span className="font-semibold text-slate-800">{p.plan}</span>
                  <span className="text-slate-600">{p.price}</span>
                  <span className="text-blue-600 font-semibold">{p.cap}</span>
                  <span className={p.removed === "Yes" ? "text-green-600 font-semibold" : "text-slate-400"}>{p.removed}</span>
                </div>
              ))}
            </div>
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
              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-900 mb-1">Get more from every ChatGPT message</h2>
              <p className="text-[13px] text-slate-500">Convert files to LLM-optimised markdown. Reduce token usage by up to 87%. Free, in-browser, no sign-up.</p>
            </div>
            <Link href="/markitdown" className="shrink-0">
              <Button style={{ background: "#2563eb", color: "#fff" }} className="gap-2 font-semibold">
                Try markitdown free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </section>

        </main>
        <Footer />
      </div>
    </>
  )
}
