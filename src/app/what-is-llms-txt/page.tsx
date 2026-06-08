import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "What is llms.txt? The Complete Guide (2026) — SuperMD",
  description:
    "llms.txt is a markdown file that tells AI models how to navigate your website. Over 844,000 sites have implemented it. Learn what it is, whether it actually works, how to write one, and how to generate it automatically.",
  keywords: [
    "what is llms.txt",
    "llms.txt guide",
    "llms.txt SEO",
    "llms.txt does it work",
    "should I implement llms.txt",
    "llms.txt standard",
    "llms.txt example",
    "llms txt file",
    "llms.txt ChatGPT",
    "llms.txt Claude",
    "llms.txt implementation",
    "AI web crawling standard",
  ],
  alternates: { canonical: "https://supermd.dev/what-is-llms-txt" },
  openGraph: {
    title: "What is llms.txt? The Complete Guide (2026)",
    description:
      "844,000 websites have implemented llms.txt. But does it actually work? Here's everything you need to know — what it is, who reads it, and how to write one.",
    url: "https://supermd.dev/what-is-llms-txt",
  },
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is llms.txt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "llms.txt is a markdown file placed at the root of a website (e.g. example.com/llms.txt) that provides AI models and LLM-powered crawlers with a structured summary of the site's content and purpose. It was proposed by Jeremy Howard (fast.ai) and is analogous to robots.txt — but instead of controlling crawler access, it gives AI models the context they need to accurately represent your site's content.",
      },
    },
    {
      "@type": "Question",
      name: "Does llms.txt actually work for SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on which AI model you're targeting. ChatGPT (OpenAI) has explicitly stated it does not use llms.txt. Claude and Gemini may use it during web browsing. Perplexity and other AI search tools likely index it. There is no confirmed ranking benefit from llms.txt alone — but it helps AI models accurately represent your site's content when they do crawl it, reducing hallucinations about your product or documentation.",
      },
    },
    {
      "@type": "Question",
      name: "What should be in a llms.txt file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A llms.txt file should contain: (1) An H1 heading with the site/product name. (2) A brief description of what the site does. (3) Structured sections linking to key pages — documentation, API reference, guides. (4) Optional: a note on how to interpret the content. The file should be plain markdown, under 4,000 tokens, and updated when major content changes. A companion llms-full.txt can contain more verbose documentation.",
      },
    },
    {
      "@type": "Question",
      name: "Who created the llms.txt standard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "llms.txt was proposed by Jeremy Howard, co-creator of fast.ai and the ULMFiT language model pre-training approach. He published the initial specification in 2024. The standard is informal — there is no governing body — but it has been widely adopted, with over 844,000 websites implementing it by October 2025, including Anthropic, Cloudflare, and Stripe.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between llms.txt and robots.txt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "robots.txt tells crawlers what they are and are not allowed to access. llms.txt tells AI models what your site is about and provides structured links to important content. robots.txt is machine-enforced and universally respected. llms.txt is informational and voluntary — AI models choose whether to read and use it. Both files live at the domain root.",
      },
    },
    {
      "@type": "Question",
      name: "Should I implement llms.txt on my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, especially if your site has documentation, an API, or content that AI models should reference accurately. Implementation takes under 30 minutes, carries zero downside risk, and provides genuine value for AI tools that do read it. For SaaS products, developer tools, and documentation sites, it directly reduces hallucinations about your product in AI-generated answers.",
      },
    },
  ],
}

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What is llms.txt? The Complete Guide (2026)",
  description: "Everything you need to know about llms.txt — what it is, who reads it, whether it works for SEO, how to write one, and real examples from major companies.",
  author: { "@type": "Organization", name: "SuperMD" },
  publisher: { "@type": "Organization", name: "SuperMD", url: "https://supermd.dev" },
  mainEntityOfPage: "https://supermd.dev/what-is-llms-txt",
  datePublished: "2026-06-01",
  dateModified: "2026-06-01",
}

const EXAMPLE_FILE = `# SuperMD

> LLM-optimised markdown generation for the AI era. Convert files, generate context files, and build AI-ready documentation.

## What SuperMD does

SuperMD generates every markdown file your AI consumes — optimised for fewer tokens, cleaner structure, and better model comprehension.

## Tools

- [markitdown](/markitdown): Convert PDF, DOCX, XLSX, and images to LLM-optimised markdown
- [claude.md](/claude-md): Generate CLAUDE.md from a GitHub URL
- [skill.md](/skill-md): Create Claude Code skill definitions
- [llms.txt](/llms-txt): Generate spec-compliant llms.txt for any website
- [context.md](/context-md): Build reusable context files for any topic
- [design.md](/design-md): Structured feature design documents

## Optional

- [Pricing](/pricing): Free tier and paid plans
- [What is Markdown](/what-is-markdown): Complete guide to .md files`

export default function WhatIsLlmsTxt() {
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
            <Link href="/llms-txt">
              <Button size="sm" style={{ background: "#2563eb", color: "#fff" }} className="gap-1.5 font-semibold text-[13px]">
                Generate llms.txt <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="relative z-10 max-w-[860px] mx-auto px-6 py-14">

          <div className="mb-12">
            <p className="label-mono mb-4">// guide</p>
            <h1 className="text-[44px] font-semibold tracking-[-0.045em] leading-[1.08] text-slate-900 mb-5">
              What is llms.txt?<br />
              <span style={{ color: "#2563eb" }}>844K sites have it. Here&apos;s what it actually does.</span>
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed font-medium max-w-2xl">
              llms.txt is a markdown file that tells AI models how to understand and navigate your website. Anthropic,
              Cloudflare, and Stripe all have one. ChatGPT doesn&apos;t read it. Here&apos;s the complete, honest guide.
            </p>
          </div>

          {/* Quick answer */}
          <section className="mb-12 rounded-xl border-l-4 border-blue-500 bg-blue-50 px-6 py-5">
            <p className="label-mono mb-2" style={{ color: "#2563eb" }}>// quick answer</p>
            <p className="text-[15px] text-slate-700 leading-relaxed">
              <strong>llms.txt</strong> is a plain markdown file at <code className="bg-blue-100 px-1 rounded font-mono text-[13px]">yourdomain.com/llms.txt</code> that
              provides AI models with a structured summary of your site — what it does, what pages exist, and how to
              navigate them. It&apos;s like a README for your website, written for LLMs. Implementation takes under 30 minutes
              and costs nothing to maintain.
            </p>
          </section>

          {/* What it is */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">What llms.txt actually is</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-4">
              llms.txt was proposed by Jeremy Howard (co-creator of fast.ai) in 2024. The idea is simple: as AI models
              increasingly browse the web to answer questions, HTML pages are noisy and token-expensive. A clean markdown
              summary at a known location gives models exactly what they need.
            </p>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              It sits alongside <code className="bg-slate-100 px-1.5 rounded font-mono text-[13px]">robots.txt</code> and <code className="bg-slate-100 px-1.5 rounded font-mono text-[13px]">sitemap.xml</code> in
              your domain root. Unlike those files, it&apos;s written for AI comprehension — not crawler control or search indexing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {[
                { file: "robots.txt", purpose: "Controls what crawlers can access", readers: "All crawlers" },
                { file: "sitemap.xml", purpose: "Lists all pages for search indexing", readers: "Search engines" },
                { file: "llms.txt", purpose: "Summarises site content for AI models", readers: "LLM-powered tools" },
              ].map((f, i) => (
                <div key={f.file} className={`p-5 ${i < 2 ? "border-r border-slate-200" : ""}`}>
                  <code className="font-mono text-[13px] font-bold text-blue-600">{f.file}</code>
                  <p className="text-[13px] text-slate-600 mt-2 mb-1">{f.purpose}</p>
                  <p className="text-[11px] font-mono text-slate-400">{f.readers}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Who reads it */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Which AI tools actually read llms.txt?</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              This is the most important question — and the answer is nuanced. Support is uneven across AI tools.
            </p>
            <div className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { tool: "Claude (Anthropic)", status: "Likely yes", detail: "Anthropic publishes its own llms.txt. Claude's web browsing feature may use it when exploring sites. Anthropic has not publicly confirmed the mechanism." },
                { tool: "ChatGPT (OpenAI)", status: "No", detail: "OpenAI has explicitly stated that ChatGPT's browsing does not use llms.txt. The file is ignored." },
                { tool: "Gemini (Google)", status: "Possibly", detail: "No official confirmation. Google has extensive web crawling infrastructure. Gemini's web grounding may use llms.txt." },
                { tool: "Perplexity", status: "Likely yes", detail: "Perplexity's AI search indexes structured web content. llms.txt aligns with its content consumption model." },
                { tool: "Cursor / Claude Code", status: "Yes", detail: "AI coding assistants that browse documentation use llms.txt to understand project structure without parsing full HTML." },
              ].map((t, i) => (
                <div key={t.tool} className={`px-5 py-4 flex items-start gap-4 ${i < 4 ? "border-b border-slate-200" : ""}`}>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-semibold text-slate-800 mb-0.5">{t.tool}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{t.detail}</p>
                  </div>
                  <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${t.status === "Likely yes" || t.status === "Yes" ? "bg-green-50 text-green-700" : t.status === "No" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{t.status}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
              <p className="text-[13px] text-amber-800">
                <strong>Bottom line:</strong> llms.txt does not guarantee any AI will find or use your content. It is a best-effort
                standard with no enforcement mechanism. Its value is in improving accuracy when AI tools do read it — not in
                guaranteeing discovery.
              </p>
            </div>
          </section>

          {/* Adoption */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Adoption: who has implemented llms.txt</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { value: "844K+", label: "Websites", sub: "By October 2025" },
                { value: "2024", label: "Proposed by", sub: "Jeremy Howard" },
                { value: "3", label: "Major adopters", sub: "Anthropic, Cloudflare, Stripe" },
              ].map((s, i) => (
                <div key={s.label} className={`p-5 ${i < 2 ? "border-r border-slate-200" : ""}`}>
                  <p className="text-[28px] font-bold tracking-[-0.03em] leading-none mb-1" style={{ color: "#2563eb" }}>{s.value}</p>
                  <p className="text-[13px] font-semibold text-slate-700 mb-0.5">{s.label}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{s.sub}</p>
                </div>
              ))}
            </div>
            <p className="text-[15px] text-slate-500 leading-relaxed">
              Notable adopters include Anthropic (anthropic.com/llms.txt), Cloudflare (cloudflare.com/llms.txt), Stripe,
              and thousands of developer-tool and SaaS companies. The rapid adoption suggests the community views it as
              a low-cost, future-proof investment regardless of current AI support levels.
            </p>
          </section>

          {/* How to write one */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">How to write a llms.txt file</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              The spec is intentionally minimal. A valid llms.txt needs five elements:
            </p>
            <div className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { el: "H1 heading", required: true, detail: "Your site or product name. One H1 only." },
                { el: "Blockquote description", required: true, detail: "A one-sentence description of what the site does, in a > blockquote." },
                { el: "Section headings (H2)", required: false, detail: "Organise links by section: Documentation, API, Guides, etc." },
                { el: "Markdown links", required: true, detail: "Links to your most important pages. Use relative URLs where possible." },
                { el: "Optional section", required: false, detail: "An ## Optional section for supplementary links the AI may use if relevant." },
              ].map((e, i) => (
                <div key={e.el} className={`px-5 py-3.5 flex items-start gap-4 ${i < 4 ? "border-b border-slate-200" : ""}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <code className="font-mono text-[12px] font-bold text-blue-600">{e.el}</code>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${e.required ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{e.required ? "Required" : "Optional"}</span>
                    </div>
                    <p className="text-[13px] text-slate-500">{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[14px] font-semibold text-slate-700 mb-3">Example llms.txt (supermd.dev)</p>
            <pre className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-[12px] font-mono text-slate-600 overflow-x-auto leading-relaxed">
              {EXAMPLE_FILE}
            </pre>
          </section>

          {/* Best practices */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Best practices for llms.txt</h2>
            <div className="flex flex-col gap-3">
              {[
                { tip: "Keep it under 4,000 tokens", detail: "AI models have context limits. A concise llms.txt is more reliably consumed than a verbose one. For exhaustive documentation, use a companion llms-full.txt." },
                { tip: "Use a companion llms-full.txt", detail: "Some tools support llms-full.txt for full documentation content. Keep llms.txt as the compact index; llms-full.txt as the complete reference." },
                { tip: "Link to machine-readable content", detail: "Link to markdown or plain-text versions of your docs where available, not HTML pages. AI models process markdown with fewer tokens and less noise." },
                { tip: "Update it when content changes", detail: "Stale llms.txt files cause AI models to reference outdated information. Automate updates when major pages are added or renamed." },
                { tip: "Serve with correct Content-Type", detail: "Serve llms.txt as text/plain or text/markdown. Some AI crawlers check Content-Type before processing." },
              ].map((t, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-blue-500 font-bold mt-0.5 shrink-0">→</span>
                  <div>
                    <p className="text-[14px] font-semibold text-slate-800 mb-0.5">{t.tip}</p>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{t.detail}</p>
                  </div>
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
              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-900 mb-1">Generate your llms.txt in seconds</h2>
              <p className="text-[13px] text-slate-500">Paste your URL. Get a spec-compliant llms.txt so any LLM can navigate your site without hallucinating your content.</p>
            </div>
            <Link href="/llms-txt" className="shrink-0">
              <Button style={{ background: "#2563eb", color: "#fff" }} className="gap-2 font-semibold">
                Generate llms.txt <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </section>

        </main>
        <Footer />
      </div>
    </>
  )
}
