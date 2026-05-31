"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Code2, Loader2, AlertCircle, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import TurndownService from "turndown"

type Status = "idle" | "converting" | "done" | "error"

function htmlToMarkdown(html: string): string {
  const td = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  })
  // Remove script/style/nav/footer noise before converting
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
  return td.turndown(cleaned)
}

export default function HtmlToMdPage() {
  const [tab, setTab] = useState<"paste" | "url">("paste")
  const [pasteContent, setPasteContent] = useState("")
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [output, setOutput] = useState("")

  function handlePaste() {
    if (!pasteContent.trim()) { setError("Paste some HTML first."); setStatus("error"); return }
    setError("")
    try {
      const md = htmlToMarkdown(pasteContent)
      setOutput(md)
      setStatus("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.")
      setStatus("error")
    }
  }

  async function handleUrl() {
    if (!url.trim()) { setError("Enter a URL first."); setStatus("error"); return }
    setError("")
    setStatus("converting")
    try {
      const res = await fetch("/api/html-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`)
      const md = htmlToMarkdown(data.html)
      setOutput(md)
      setStatus("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fetch URL.")
      setStatus("error")
    }
  }

  function handleReset() {
    setStatus("idle")
    setError("")
    setOutput("")
    setPasteContent("")
    setUrl("")
  }

  const loading = status === "converting"
  const urlFilename = (() => {
    try { return new URL(url).hostname.replace(/^www\./, "") + ".md" } catch { return "output.md" }
  })()

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
            <Code2 className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">html-to-md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// html-to-md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Convert HTML to clean markdown.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste raw HTML or drop a URL. SuperMD strips nav, scripts, and noise — converts the content to clean markdown your LLM can actually read.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* Left — input */}
          <div className="flex flex-col gap-5">
            <Tabs value={tab} onValueChange={(v) => { setTab(v as "paste" | "url"); setStatus("idle"); setError(""); setOutput("") }}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="paste" className="gap-1.5">
                  <Code2 className="h-3.5 w-3.5" /> Paste HTML
                </TabsTrigger>
                <TabsTrigger value="url" className="gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Fetch URL
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {tab === "paste" ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="label-mono mb-2 block">HTML input</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700 placeholder:text-slate-300"
                    rows={12}
                    placeholder={"<article>\n  <h1>Hello World</h1>\n  <p>Your HTML here...</p>\n</article>"}
                    value={pasteContent}
                    onChange={(e) => { setPasteContent(e.target.value); if (status === "done") setStatus("idle") }}
                  />
                </div>
                <Button onClick={handlePaste} disabled={!pasteContent.trim()} className="w-fit gap-2" style={{ background: "#2563eb", color: "#fff" }}>
                  Convert to Markdown
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="label-mono mb-2 block">Page URL</label>
                  <Input
                    placeholder="https://example.com/blog/post"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleUrl()}
                    className="font-mono text-sm"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400">Publicly accessible pages only. Scripts, nav, and footer are stripped before conversion.</p>
                </div>
                <Button onClick={handleUrl} disabled={loading || !url.trim()} className="w-fit gap-2" style={{ background: "#2563eb", color: "#fff" }}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Fetching…</> : "Fetch & Convert"}
                </Button>
              </div>
            )}

            {status === "error" && error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-700">{error}</p>
              </div>
            )}

            {status === "done" && (
              <button onClick={handleReset} className="w-fit text-[12px] text-slate-400 hover:text-slate-600 font-mono">
                ← Convert another
              </button>
            )}

            {status === "idle" && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 flex flex-col gap-3">
                <p className="label-mono">// what gets removed</p>
                <div className="grid grid-cols-2 gap-2">
                  {["&lt;script&gt; blocks", "&lt;style&gt; sheets", "&lt;nav&gt; menus", "&lt;header&gt; / &lt;footer&gt;", "HTML comments", "Inline attributes"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-slate-500" dangerouslySetInnerHTML={{ __html: `<span class="h-1 w-1 rounded-full bg-blue-400 shrink-0 inline-block mr-1"></span>${item}` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — output */}
          <div className="flex flex-col gap-4">
            {status === "done" && output ? (
              <OutputCard
                content={output}
                filename={tab === "url" ? urlFilename : "output.md"}
                label="Converted markdown"
              />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center">
                <p className="text-[13px] text-slate-400 font-mono">Markdown output appears here</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// why html to markdown</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  HTML is for browsers. Markdown is for LLMs.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  Raw HTML burns context window on tags, attributes, inline styles, and script blocks the model has to mentally discard. A typical blog post HTML is 3–5× larger than its markdown equivalent — and the model still has to extract the same content.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Converting to markdown first strips the noise and gives your LLM a clean, linear version of the content — the same information, fewer tokens, better results.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-0 border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-5 border-r border-slate-200">
                  <p className="label-mono mb-3 text-red-400">// html</p>
                  <pre className="text-[10px] font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">{`<div class="post-content
  container mx-auto">
  <h1 class="text-4xl font-bold
    mb-4 tracking-tight">
    Hello World
  </h1>
  <p class="text-gray-600
    leading-7">
    Content here...
  </p>
</div>`}</pre>
                  <p className="mt-3 text-[10px] font-mono text-red-400">~180 tokens</p>
                </div>
                <div className="p-5">
                  <p className="label-mono mb-3 text-emerald-500">// markdown</p>
                  <pre className="text-[10px] font-mono text-slate-600 leading-relaxed">{`# Hello World

Content here...`}</pre>
                  <p className="mt-3 text-[10px] font-mono text-emerald-500">~12 tokens</p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// use cases</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              When do you convert HTML to markdown?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Web scraping for RAG pipelines", desc: "Scrape pages, strip HTML, get clean markdown chunks ready to embed. Avoids the HTML-parsing step in your ingestion pipeline.", tag: "RAG" },
                { title: "Feeding docs to your LLM", desc: "Paste API docs, blog posts, or changelogs as markdown instead of HTML. The model focuses on the content, not the DOM structure.", tag: "Context" },
                { title: "Converting CMS content", desc: "Export from WordPress, Notion, or any CMS as HTML — convert to markdown for storage, version control, or LLM consumption.", tag: "CMS" },
                { title: "Documentation ingestion", desc: "Technical docs are often HTML-heavy. Convert them to clean markdown before adding to a knowledge base or feeding to an AI assistant.", tag: "Docs" },
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
                { q: "Does the HTML get sent to a server?", a: "Only when using the URL tab — the server fetches the page on your behalf to avoid CORS restrictions. When you paste HTML directly, conversion runs entirely in your browser using the Turndown library. No HTML is stored." },
                { q: "What does 'fetch URL' do exactly?", a: "The server fetches the public URL, extracts the main content block (article, main, or body), strips scripts/styles/nav/footer, and returns the HTML. Turndown then converts it to markdown in your browser." },
                { q: "Can I convert private or authenticated pages?", a: "Not via the URL tab — the fetch runs server-side without your session cookies. For authenticated content, copy the page source (Cmd+U in Chrome) and paste it into the Paste tab instead." },
                { q: "How does it compare to Pandoc?", a: "Pandoc produces more complete conversions for complex HTML but requires a local install. This tool runs entirely in the browser, handles common web page patterns well, and is optimised for LLM consumption rather than document fidelity." },
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
