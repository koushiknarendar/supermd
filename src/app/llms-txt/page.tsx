"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Globe, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateLlmsTxt, type CrawledPage } from "@/lib/generators/llms-txt"

type Status = "idle" | "crawling" | "done" | "error"

function normalizeUrl(raw: string): string {
  let u = raw.trim()
  if (!u.startsWith("http://") && !u.startsWith("https://")) u = "https://" + u
  return u
}

export default function LlmsTxtPage() {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [output, setOutput] = useState("")
  const [crawledPages, setCrawledPages] = useState<CrawledPage[]>([])

  async function handleGenerate() {
    const normalized = normalizeUrl(url)
    setStatus("crawling")
    setError("")
    setOutput("")
    setCrawledPages([])

    try {
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Failed to crawl the URL.")
      }

      const pages: CrawledPage[] = data.pages ?? []
      setCrawledPages(pages)
      setOutput(generateLlmsTxt(pages, normalized))
      setStatus("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
      setStatus("error")
    }
  }

  const loading = status === "crawling"

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
            <Globe className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">llms.txt</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// llms.txt</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Generate llms.txt for any website.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste your URL. SuperMD crawls your homepage and up to 5 linked pages, then generates a spec-compliant <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">llms.txt</code> so any LLM can understand your site.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* Left — input + crawl status */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="label-mono mb-2 block">Website URL</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://yourdomain.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && url.trim() && handleGenerate()}
                  className="font-mono flex-1"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !url.trim()}
                  style={{ background: "#2563eb", color: "#fff" }}
                  className="gap-2 shrink-0"
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Crawling…</> : "Generate"}
                </Button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Crawls homepage + up to 5 linked pages. Public URLs only.
              </p>
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-700">{error}</p>
              </div>
            )}

            {/* Pages crawled */}
            {crawledPages.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white/80 p-4 flex flex-col gap-3">
                <p className="label-mono">// pages crawled</p>
                <div className="flex flex-col gap-2">
                  {crawledPages.map((page, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-medium text-slate-700 truncate">{page.title || "Untitled"}</span>
                          <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-slate-500 shrink-0">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate font-mono">{page.url}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 flex flex-col gap-3">
              <p className="label-mono">// what is llms.txt?</p>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                <code className="bg-slate-100 px-1 rounded font-mono text-[11px]">llms.txt</code> is an emerging standard (llmstxt.org) that tells AI models what your site is about and where to find key content — reducing hallucinations when an LLM references your site.
              </p>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Once generated, host it at <code className="bg-slate-100 px-1 rounded font-mono text-[11px]">yourdomain.com/llms.txt</code>.
              </p>
            </div>
          </div>

          {/* Right — output */}
          <div>
            {status === "done" && output ? (
              <OutputCard content={output} filename="llms.txt" label="Generated llms.txt" mimeType="text/plain" />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center">
                <p className="text-[13px] text-slate-400 font-mono">Your llms.txt will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content — always rendered */}
        <div className="mt-20 flex flex-col gap-16">

          {/* What is llms.txt */}
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// the standard</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  llms.txt tells AI models how to read your site.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  When an LLM is asked about your product, it searches the web, finds your pages, and tries to understand them from raw HTML. Without structure, it often gets things wrong — hallucinating features, confusing your pricing, or missing key information entirely.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[12px]">llms.txt</code> is a simple markdown file you host at the root of your domain. It gives LLMs a curated, authoritative map of your site — what it is, where to find key pages, and what they contain. The format was proposed by Jeremy Howard (fast.ai) and is supported by an growing number of AI tools.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                  <span className="font-mono text-[11px] text-slate-500">yourdomain.com/llms.txt</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-600 leading-relaxed bg-white">{`# SuperMD

> The markdown generator for the AI era.
Convert files to LLM-optimized markdown.

## Pages

- [markitdown](/markitdown): Convert PDF, DOCX,
  XLSX, and images to clean markdown
- [claude.md](/claude-md): Generate CLAUDE.md
  from any GitHub repo
- [skill.md](/skill-md): Build Claude Code
  skill files with a guided form
- [Pricing](/pricing): Free tier and Pro plan`}</pre>
              </div>
            </div>
          </section>

          {/* Who needs it */}
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// use cases</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              Which websites benefit most from llms.txt?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Developer tool and SaaS sites", desc: "Technical products are frequently referenced by LLMs in coding contexts. A good llms.txt ensures Claude and GPT describe your API, your pricing, and your features correctly.", tag: "SaaS" },
                { title: "Documentation sites", desc: "Docs sites often have thousands of pages. llms.txt tells LLMs which pages matter most — the getting-started guide, the API reference, the changelog — without crawling everything.", tag: "Docs" },
                { title: "Portfolio and personal sites", desc: "When someone asks an AI about you, it should get the right answer. llms.txt gives it your bio, your projects, your contact info, and your work — accurately.", tag: "Portfolio" },
                { title: "E-commerce and product sites", desc: "Product descriptions, pricing pages, and shipping policies are exactly what LLMs get wrong. llms.txt points them directly to the canonical sources.", tag: "E-commerce" },
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

          {/* The spec */}
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// the format</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
              The llms.txt spec, explained simply.
            </h2>
            <p className="text-[14px] text-slate-500 mb-8 max-w-2xl leading-relaxed">
              The spec is deliberately minimal — just markdown with a few conventions. There&apos;s no XML, no JSON, no special encoding. Any LLM can read it directly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {[
                { element: "# H1", rule: "Site name — exactly one, at the top.", example: "# SuperMD" },
                { element: "> Blockquote", rule: "Required one-sentence description immediately after the H1.", example: "> The markdown generator for the AI era." },
                { element: "## H2 sections", rule: "Group related pages under H2 headings. Each link line: - [Title](url): description.", example: "## Pages\n- [Docs](/docs): Full API reference" },
              ].map((r, i) => (
                <div key={r.element} className={`p-5 ${i < 2 ? "border-r border-slate-200" : ""}`}>
                  <code className="font-mono text-[13px] font-semibold text-blue-600">{r.element}</code>
                  <p className="mt-2 text-[12px] text-slate-500 leading-relaxed">{r.rule}</p>
                  <pre className="mt-3 text-[10px] font-mono text-slate-400 bg-slate-50 rounded p-2">{r.example}</pre>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="border-t border-slate-100 pt-12 pb-4">
            <p className="label-mono mb-4">// faq</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              Frequently asked questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { q: "Where do I host llms.txt?", a: "Host it at the root of your domain: yourdomain.com/llms.txt. This is the only path that LLMs and crawlers will look for by convention, similar to robots.txt and sitemap.xml." },
                { q: "Who reads llms.txt?", a: "AI tools and LLM-powered search engines that crawl the web, including Perplexity, ChatGPT Browse, and Claude's web tools. As the standard grows, more tools will support it. You can also point users to it directly." },
                { q: "What's the difference between llms.txt and robots.txt?", a: "robots.txt tells crawlers what NOT to index. llms.txt tells AI models what IS important — it's a positive signal rather than a restriction. Both can coexist. llms.txt doesn't replace robots.txt." },
                { q: "What's the difference between llms.txt and a sitemap?", a: "A sitemap lists every URL on your site for search engine indexing. llms.txt is curated — it highlights the most important pages with human-written descriptions. It's for understanding, not exhaustive indexing." },
                { q: "How often should I update llms.txt?", a: "Update it when you launch major new pages, change your pricing, or significantly update your product. Unlike a sitemap, llms.txt is hand-curated, so monthly or quarterly updates are usually sufficient." },
                { q: "Does llms.txt affect my Google SEO?", a: "llms.txt has no direct effect on Google Search rankings — it's not a Google standard. Its impact is on AI-powered tools that reference your site. As AI-generated answers become more common in search, having accurate llms.txt context matters more." },
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
