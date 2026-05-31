import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "What is Markdown? Complete Guide to .md Files — SuperMD",
  description:
    "Markdown (.md) is a lightweight markup language that converts plain text to formatted documents. Learn what Markdown is, how it works, why LLMs prefer it, and how to use it.",
  keywords: [
    "what is markdown",
    "what is an md file",
    "markdown explained",
    "markdown for LLMs",
    "markdown use cases",
    "markdown syntax guide",
    "markdown for AI",
    "why use markdown with ChatGPT",
    "markdown file format",
    "md file",
  ],
  alternates: { canonical: "https://supermd.dev/what-is-markdown" },
  openGraph: {
    title: "What is Markdown? Complete Guide to .md Files",
    description:
      "Markdown (.md) is a lightweight markup language that converts plain text to formatted documents. Learn what it is, why LLMs prefer it, and how to use it.",
    url: "https://supermd.dev/what-is-markdown",
  },
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Markdown?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Markdown is a lightweight markup language created by John Gruber in 2004. It uses plain text with simple symbols (like # for headings and ** for bold) to define formatting. A Markdown file uses the .md or .markdown extension and can be converted to HTML, PDF, or other formats.",
      },
    },
    {
      "@type": "Question",
      name: "What is an .md file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An .md file is a plain text file written in Markdown syntax. It can be opened in any text editor. On GitHub, .md files are automatically rendered as formatted HTML. CLAUDE.md, README.md, and skill.md are common examples of .md files used in software development.",
      },
    },
    {
      "@type": "Question",
      name: "Why do LLMs prefer Markdown?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LLMs prefer Markdown because it encodes structure (headings, lists, tables) using fewer tokens than HTML or XML. A PDF with raw formatting overhead can use 40–60% more tokens than the same content converted to clean Markdown. Markdown also makes the model's job easier — structure is explicit without being noisy.",
      },
    },
    {
      "@type": "Question",
      name: "What is Markdown used for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Markdown is used for README files on GitHub, documentation sites (Docusaurus, GitBook), blog posts (Ghost, Hashnode), note-taking apps (Obsidian, Notion), AI context files (CLAUDE.md, llms.txt), and RAG pipelines for LLMs. It is the de-facto format for developer documentation and AI-ready content.",
      },
    },
    {
      "@type": "Question",
      name: "How is Markdown different from HTML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HTML uses verbose tags like <h1>Title</h1> and <strong>bold</strong>. Markdown uses # Title and **bold**. Markdown is faster to write, easier to read as plain text, and produces fewer tokens — making it better for LLM consumption. Markdown is typically converted to HTML for display.",
      },
    },
    {
      "@type": "Question",
      name: "What is GitHub Flavored Markdown (GFM)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GitHub Flavored Markdown (GFM) is a superset of standard Markdown that adds tables, task lists (- [ ] item), strikethrough (~~text~~), and syntax-highlighted fenced code blocks (```javascript). It is the most widely used Markdown dialect and is supported by most LLMs.",
      },
    },
  ],
}

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What is Markdown? Complete Guide to .md Files",
  description:
    "Markdown is a lightweight markup language that uses plain text to define formatting. This guide explains what Markdown is, how it works, why LLMs prefer it, and how to use it.",
  author: { "@type": "Organization", name: "SuperMD" },
  publisher: { "@type": "Organization", name: "SuperMD", url: "https://supermd.dev" },
  mainEntityOfPage: "https://supermd.dev/what-is-markdown",
}

const SYNTAX = [
  { md: "# Heading 1", result: "Large heading (H1)", note: "One # per heading level" },
  { md: "## Heading 2", result: "Sub-heading (H2)", note: "" },
  { md: "**bold text**", result: "Bold text", note: "Or __bold__" },
  { md: "_italic text_", result: "Italic text", note: "Or *italic*" },
  { md: "- list item", result: "Bullet list", note: "Or * or +" },
  { md: "1. ordered item", result: "Numbered list", note: "" },
  { md: "`inline code`", result: "Inline code", note: "Backtick" },
  { md: "```python\\ncode\\n```", result: "Code block", note: "Fenced with language" },
  { md: "[Link](https://url.com)", result: "Hyperlink", note: "" },
  { md: "| Col | Col |\\n|---|---|", result: "Table", note: "GFM only" },
  { md: "> blockquote", result: "Blockquote", note: "" },
  { md: "---", result: "Horizontal rule", note: "" },
]

export default function WhatIsMarkdown() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }}
      />

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
              What is Markdown?<br />
              <span style={{ color: "#2563eb" }}>The complete guide to .md files.</span>
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed font-medium max-w-2xl">
              Markdown is a lightweight markup language that lets you format plain text using simple symbols.
              It is the standard format for README files, documentation, AI context files, and LLM inputs.
            </p>
          </div>

          {/* Quick answer — AEO featured snippet target */}
          <section className="mb-12 rounded-xl border-l-4 border-blue-500 bg-blue-50 px-6 py-5">
            <p className="label-mono mb-2" style={{ color: "#2563eb" }}>// quick answer</p>
            <p className="text-[15px] text-slate-700 leading-relaxed">
              <strong>Markdown</strong> is a plain text formatting syntax created by John Gruber in 2004.
              Files use the <code className="bg-blue-100 px-1 rounded font-mono text-[13px]">.md</code> or{" "}
              <code className="bg-blue-100 px-1 rounded font-mono text-[13px]">.markdown</code> extension.
              You write plain text with simple symbols — <code className="bg-blue-100 px-1 rounded font-mono text-[13px]">#</code> for headings,{" "}
              <code className="bg-blue-100 px-1 rounded font-mono text-[13px]">**text**</code> for bold —
              and tools convert it to formatted HTML, PDF, or other outputs.
              It is the de-facto format for developer documentation, AI context files, and RAG pipelines.
            </p>
          </section>

          {/* What is a .md file */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">What is a .md file?</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-4">
              A <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[13px]">.md</code> file is a plain text file written in Markdown syntax. You can open it in any text editor — Notepad, VS Code, Vim. On platforms like GitHub, GitLab, and Notion, <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[13px]">.md</code> files are automatically rendered as formatted HTML.
            </p>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Common <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[13px]">.md</code> files you&apos;ve likely encountered:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "README.md", desc: "Project introduction on GitHub" },
                { name: "CLAUDE.md", desc: "Codebase context for Claude Code" },
                { name: "CHANGELOG.md", desc: "Version history and release notes" },
                { name: "CONTRIBUTING.md", desc: "Contribution guidelines for open-source" },
                { name: "skill.md", desc: "Claude Code skill definitions" },
                { name: "context.md", desc: "Topic context for LLM sessions" },
              ].map((f) => (
                <div key={f.name} className="rounded-lg border border-slate-200 p-3">
                  <code className="font-mono text-[12px] text-blue-600 font-semibold">{f.name}</code>
                  <p className="text-[11px] text-slate-400 mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Syntax reference */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Markdown syntax — quick reference</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Markdown uses symbols you already type. There is no configuration or installation required.
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-[1.2fr_1fr_1fr] text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                <span>Markdown syntax</span>
                <span>Result</span>
                <span>Note</span>
              </div>
              {SYNTAX.map((s, i) => (
                <div key={i} className={`grid grid-cols-[1.2fr_1fr_1fr] px-4 py-2.5 text-[13px] ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"} border-b border-slate-100 last:border-0`}>
                  <code className="font-mono text-blue-600 text-[12px]">{s.md}</code>
                  <span className="text-slate-700">{s.result}</span>
                  <span className="text-slate-400 text-[11px]">{s.note}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Use cases */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">What is Markdown used for?</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Markdown has become the universal language for structured text on the internet and inside AI systems.
            </p>
            <div className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {[
                { use: "Software documentation", detail: "README.md, CHANGELOG.md, CONTRIBUTING.md are Markdown by convention. GitHub renders them automatically. Every major open-source project uses Markdown for its documentation.", examples: "GitHub, GitLab, Bitbucket" },
                { use: "Documentation sites", detail: "Tools like Docusaurus, GitBook, MkDocs, and Nextra take a folder of .md files and generate a full documentation website. Markdown is the content layer; the framework handles design and navigation.", examples: "Docusaurus, GitBook, MkDocs" },
                { use: "Blogs and publishing", detail: "Ghost, Hashnode, and Dev.to use Markdown for post authoring. Static site generators (Hugo, Astro, Next.js) treat Markdown files as content sources.", examples: "Ghost, Hashnode, Hugo, Astro" },
                { use: "Note-taking and knowledge management", detail: "Obsidian, Notion, Roam Research, and Bear use Markdown as their native format. Your notes are portable plain text files, not proprietary data.", examples: "Obsidian, Notion, Bear" },
                { use: "AI context files and LLM inputs", detail: "CLAUDE.md, llms.txt, context.md, and skill.md are all .md files that brief AI models on projects, codebases, and topics. Markdown's structure is readable by both humans and language models.", examples: "CLAUDE.md, llms.txt, context.md" },
                { use: "RAG pipelines and vector databases", detail: "Before embedding documents into a vector database, they are converted to clean Markdown. The format preserves semantic structure (headings, tables) while minimizing token noise.", examples: "LangChain, LlamaIndex, Pinecone" },
              ].map((u, i) => (
                <div key={u.use} className={`px-5 py-4 ${i < 5 ? "border-b border-slate-200" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[14px] font-semibold text-slate-800 mb-1">{u.use}</h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed">{u.detail}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-mono text-slate-400 mt-0.5 hidden sm:block">{u.examples}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why LLMs prefer Markdown */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Why do LLMs prefer Markdown?</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Every character you feed an LLM costs tokens. Markdown encodes the same structure as HTML or XML but with dramatically fewer characters — which means fewer tokens, lower cost, and more room for actual content.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { format: "Raw PDF text", tokens: "~52,400", bar: 100, color: "bg-red-200" },
                { format: "HTML", tokens: "~38,000", bar: 73, color: "bg-amber-200" },
                { format: "Clean Markdown", tokens: "~21,800", bar: 42, color: "bg-blue-400" },
              ].map((r, i) => (
                <div key={r.format} className={`p-5 ${i < 2 ? "border-r border-slate-200" : ""}`}>
                  <p className="text-[12px] font-semibold text-slate-600 mb-2">{r.format}</p>
                  <p className="text-[22px] font-bold tracking-[-0.03em] text-slate-800 leading-none mb-3">{r.tokens}</p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              Beyond token count, Markdown&apos;s structure helps models understand hierarchy. A document with <code className="bg-slate-100 px-1 rounded font-mono text-[12px]">## Section</code> headings gives the model explicit signals about content organisation. Raw text or HTML forces the model to infer structure from context — wasting attention on formatting rather than meaning.
            </p>
          </section>

          {/* Markdown per model */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Does the best Markdown format differ by model?</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Yes. Different LLMs were trained on different data and respond best to different Markdown structures.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { model: "🟣 Claude", context: "200K tokens", tip: "Uses XML-like tags. Anthropic recommends wrapping long documents in <document> and <section> tags. Claude explicitly parses these in its attention mechanism. YAML frontmatter is less effective than XML structure.", best: "<document><section>## Heading\ncontent</section></document>" },
                { model: "🟢 GPT-4o", context: "128K tokens", tip: "Prefers standard ATX Markdown with YAML frontmatter. Does not benefit from XML tags — they add noise. Aggressive empty-line removal and clean heading hierarchy work best.", best: "---\ntitle: Document\n---\n\n## Section\nContent here." },
                { model: "🔵 Gemini", context: "1M tokens", tip: "With a 1M token context window, chunking is rarely necessary. Clean prose with consistent headings is sufficient. Minimal metadata, no XML wrapping needed.", best: "## Section\nContent here.\n\n## Next Section\nMore content." },
              ].map((m) => (
                <div key={m.model} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[14px] font-semibold text-slate-800">{m.model}</span>
                    <span className="font-mono text-[10px] text-slate-400">{m.context}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed mb-3">{m.tip}</p>
                  <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] font-mono text-slate-600 overflow-x-auto">{m.best}</pre>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
              <p className="text-[13px] text-blue-700">
                <strong>SuperMD markitdown</strong> automatically applies the right Markdown format for each model when you convert a file. Select Claude, GPT-4o, or Gemini in the profile selector and the output is optimised accordingly.{" "}
                <Link href="/markitdown" className="underline font-semibold">Try it free →</Link>
              </p>
            </div>
          </section>

          {/* How to create a Markdown file */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">How to create a Markdown file</h2>
            <div className="flex flex-col gap-4">
              {[
                { n: "01", title: "Create a .md file in any text editor", body: "Open VS Code, Notepad, or any editor. Create a new file and save it with the .md extension — for example, README.md or notes.md. That's all it takes. There is no special software required." },
                { n: "02", title: "Write using Markdown syntax", body: "Use # for H1 headings, ## for H2, **bold** for bold, _italic_ for italics, - for bullet lists, and ``` for code blocks. The syntax is designed to be readable even without rendering." },
                { n: "03", title: "Preview or render it", body: "VS Code has a built-in Markdown preview (Ctrl+Shift+V). GitHub renders .md files automatically. Tools like Pandoc convert .md to PDF, DOCX, or HTML. Online editors like StackEdit give a live side-by-side preview." },
                { n: "04", title: "Convert existing files to Markdown with SuperMD", body: "If you have a PDF, Word doc, or spreadsheet, SuperMD markitdown converts it to clean, LLM-optimized Markdown in your browser. No upload, no account, free." },
              ].map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="font-mono text-[12px] text-slate-400 mt-1 shrink-0 w-6">{s.n}</span>
                  <div>
                    <h3 className="text-[14px] font-semibold text-slate-800 mb-1">{s.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{s.body}</p>
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
              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-900 mb-1">Convert any file to Markdown</h2>
              <p className="text-[13px] text-slate-500">Drop a PDF, DOCX, XLSX, or image. Get LLM-optimized Markdown in seconds. Free.</p>
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
