import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "PDF to Markdown for AI: Complete Guide for RAG and LLM Workflows — SuperMD",
  description:
    "PDFs waste 60–70% of your AI token budget on formatting overhead. Learn why markdown beats PDF for LLMs, how to convert accurately, optimal chunking strategies for RAG, and which tools give the cleanest output.",
  keywords: [
    "PDF to markdown for AI",
    "convert PDF to markdown",
    "PDF to markdown RAG",
    "PDF to markdown LLM",
    "best PDF to markdown tool",
    "prepare documents for AI",
    "PDF token usage AI",
    "markdown vs PDF LLM",
    "PDF to markdown conversion",
    "RAG document preparation",
    "LLM document format",
    "PDF to markdown workflow",
  ],
  alternates: { canonical: "https://supermd.dev/pdf-to-markdown-for-ai" },
  openGraph: {
    title: "PDF to Markdown for AI: Complete Guide for RAG and LLM Workflows",
    description:
      "PDFs waste 60–70% of your AI token budget. This guide covers why markdown is better, how to convert accurately, chunking strategies for RAG, and tool comparisons.",
    url: "https://supermd.dev/pdf-to-markdown-for-ai",
  },
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why is markdown better than PDF for AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PDFs carry extensive non-content overhead: repeated headers and footers on every page, embedded font metadata, layout coordinates, ligature artifacts, and binary encoding. An LLM pays tokens for all of it. Markdown carries only content — headings, paragraphs, tables, code — with minimal syntax overhead. A 50-page PDF that costs 75,000 tokens becomes approximately 21,000 tokens as clean markdown, a 72% reduction.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best PDF to markdown converter for LLMs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For in-browser use with LLM-optimised output (model-specific profiles, token savings display): SuperMD markitdown. For Python-based pipelines: pymupdf4llm (fast, good table support) or Marker (ML-based, highest accuracy on complex layouts). For Microsoft Office files in addition to PDF: Microsoft's Markitdown library (open source). For enterprise with OCR: Mistral Document AI.",
      },
    },
    {
      "@type": "Question",
      name: "What is the optimal chunk size for RAG after PDF-to-markdown conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The optimal RAG chunk size after markdown conversion is 128–512 tokens, with 0–15% overlap. Chunks of 200–400 tokens give the best balance of retrieval precision and context richness. Larger chunks (800+ tokens) reduce precision — the model retrieves more noise alongside relevant content. Semantic chunking (splitting on heading boundaries and topic shifts rather than fixed token counts) outperforms fixed-size chunking.",
      },
    },
    {
      "@type": "Question",
      name: "How much does PDF-to-markdown conversion reduce token costs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Token reduction from PDF-to-markdown conversion ranges from 40% to 95% depending on the PDF. Simple text-heavy documents: 40–60% reduction. Reports with tables and headers: 60–75% reduction. Scanned or visually complex documents: up to 95% after OCR extraction and cleanup. For RAG applications, the reduction also improves retrieval accuracy since semantic structure is preserved.",
      },
    },
    {
      "@type": "Question",
      name: "Does converting PDF to markdown lose any information?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Well-executed PDF-to-markdown conversion preserves all semantically meaningful content: headings, paragraphs, tables, lists, code blocks, and image captions. What is intentionally discarded is non-semantic overhead: page numbers, repeated headers/footers, layout coordinates, font metadata, and visual formatting. For AI consumption, this discarded content was noise — the model cannot use it meaningfully anyway.",
      },
    },
  ],
}

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "PDF to Markdown for AI: Complete Guide for RAG and LLM Workflows",
  description: "Why PDFs waste AI tokens and how to convert them to markdown for RAG, LLM context, and agent workflows. Includes tool comparison, chunking strategy guide, and workflow examples.",
  author: { "@type": "Organization", name: "SuperMD" },
  publisher: { "@type": "Organization", name: "SuperMD", url: "https://supermd.dev" },
  mainEntityOfPage: "https://supermd.dev/pdf-to-markdown-for-ai",
  datePublished: "2026-06-01",
  dateModified: "2026-06-01",
}

export default function PdfToMarkdownForAI() {
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
                Convert PDF free <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="relative z-10 max-w-[860px] mx-auto px-6 py-14">

          <div className="mb-12">
            <p className="label-mono mb-4">// guide</p>
            <h1 className="text-[44px] font-semibold tracking-[-0.045em] leading-[1.08] text-slate-900 mb-5">
              PDF to Markdown for AI.<br />
              <span style={{ color: "#2563eb" }}>The complete RAG and LLM workflow guide.</span>
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed font-medium max-w-2xl">
              PDFs waste 60–70% of your AI token budget on formatting overhead the model can&apos;t use. This guide covers
              why markdown wins, how to convert accurately, optimal RAG chunking, and a comparison of every major tool.
            </p>
          </div>

          {/* Quick answer */}
          <section className="mb-12 rounded-xl border-l-4 border-blue-500 bg-blue-50 px-6 py-5">
            <p className="label-mono mb-2" style={{ color: "#2563eb" }}>// quick answer</p>
            <p className="text-[15px] text-slate-700 leading-relaxed">
              Converting a PDF to markdown before feeding it to an LLM reduces token usage by <strong>40–95%</strong> depending on
              the document. A 50-page report drops from ~75,000 tokens to ~21,000. For RAG pipelines, markdown preserves
              semantic structure (headings, tables, lists) that enables accurate chunking — improving both retrieval
              precision and model comprehension.
            </p>
          </section>

          {/* Why PDFs are bad for AI */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Why PDFs are a poor format for AI</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              PDF was designed for print — for fixed-layout visual rendering. AI models don&apos;t render. They tokenise.
              Everything in a PDF that makes it look good on paper becomes token noise in an LLM context.
            </p>
            <div className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden mb-6">
              {[
                { issue: "Repeated headers and footers", detail: "A 50-page PDF with a title, page number, and company name in the header repeats that content 50 times. The model pays tokens for every repetition." },
                { issue: "Embedded font metadata", detail: "PDFs embed font names, character mappings, and glyph tables. These bytes appear in text extraction as garbled sequences — token noise with zero semantic value." },
                { issue: "Layout coordinates", detail: "PDF text content includes x,y coordinates for positioning. Extraction tools strip most of these, but the resulting text often has broken word spacing and fragmented sentences." },
                { issue: "Ligature artifacts", detail: "Common character combinations like 'fi', 'fl', 'ffi' are often stored as single special characters in PDFs. They extract as unrecognised tokens or broken characters." },
                { issue: "Column and table confusion", detail: "Multi-column layouts and tables often extract as interleaved text — column 1 line 1 followed by column 2 line 1, rather than complete paragraphs. Models interpret this as incoherent content." },
              ].map((u, i) => (
                <div key={u.issue} className={`px-5 py-4 ${i < 4 ? "border-b border-slate-200" : ""}`}>
                  <h3 className="text-[14px] font-semibold text-slate-800 mb-1">{u.issue}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{u.detail}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {[
                { format: "Raw PDF", tokens: "75,000", bar: 100, color: "bg-red-300" },
                { format: "Extracted plain text", tokens: "32,000", bar: 43, color: "bg-amber-300" },
                { format: "Clean Markdown", tokens: "21,000", bar: 28, color: "bg-blue-400" },
              ].map((r, i) => (
                <div key={r.format} className={`p-5 ${i < 2 ? "border-r border-slate-200" : ""}`}>
                  <p className="text-[12px] font-semibold text-slate-600 mb-1">{r.format}</p>
                  <p className="text-[11px] text-slate-400 mb-2">50-page report</p>
                  <p className="text-[22px] font-bold tracking-[-0.03em] text-slate-800 leading-none mb-3">{r.tokens}</p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why markdown wins */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">Why markdown is the right format for LLMs</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-4">
              Markdown was designed for exactly what LLMs need: a lightweight way to express document structure using
              plain text. The syntax <em>is</em> the structure — no binary encoding, no embedded metadata, no layout coordinates.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                { benefit: "Structure survives chunking", detail: "Heading hierarchy (H1 → H2 → H3) persists in every chunk. RAG retrieval can use heading context to improve relevance." },
                { benefit: "Tables are readable", detail: "Markdown tables are plain text. Models parse them accurately without column-interleaving artefacts from PDF extraction." },
                { benefit: "Code blocks are clean", detail: "Fenced code blocks with language tags (```python) tell the model exactly how to interpret the content." },
                { benefit: "Token-minimal syntax", detail: "A Markdown heading is 2–5 characters (#, ##). An HTML heading is 9+ characters (<h1>...</h1>). Across a 50-page document, the savings compound." },
              ].map((b) => (
                <div key={b.benefit} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-[13px] font-semibold text-slate-800 mb-1">{b.benefit}</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{b.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Conversion tools */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">PDF-to-markdown tool comparison</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Not all converters are equal. The output quality varies significantly by tool — and for RAG pipelines, output quality directly affects retrieval accuracy.
            </p>
            <div className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {[
                {
                  tool: "SuperMD markitdown",
                  type: "Browser / SaaS",
                  strength: "LLM-optimised output with per-model profiles (Claude, GPT-4o, Gemini), token savings display, no upload on free tier",
                  bestFor: "In-browser conversion, privacy-sensitive docs",
                  href: "/markitdown",
                },
                {
                  tool: "pymupdf4llm",
                  type: "Python library",
                  strength: "Fast, good table support, native PDF parsing. Returns markdown with heading hierarchy preserved.",
                  bestFor: "Python pipelines, batch processing",
                  href: null,
                },
                {
                  tool: "Marker",
                  type: "Python / ML",
                  strength: "ML-based layout analysis. Best accuracy on complex layouts (academic papers, multi-column reports). Slower than pymupdf4llm.",
                  bestFor: "Complex layouts, academic documents",
                  href: null,
                },
                {
                  tool: "Microsoft Markitdown",
                  type: "Python / Open source",
                  strength: "Converts PDF, DOCX, XLSX, PPTX, images, audio, YouTube URLs → markdown. Broad format support.",
                  bestFor: "Multi-format pipelines (not just PDF)",
                  href: null,
                },
                {
                  tool: "Mistral Document AI",
                  type: "API / Cloud",
                  strength: "OCR-based, handles scanned PDFs and images. High accuracy on non-native PDFs.",
                  bestFor: "Scanned documents, handwritten content",
                  href: null,
                },
              ].map((t, i) => (
                <div key={t.tool} className={`px-5 py-5 ${i < 4 ? "border-b border-slate-200" : ""}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[14px] font-semibold text-slate-800">{t.tool}</h3>
                        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded">{t.type}</span>
                      </div>
                      <p className="text-[13px] text-slate-500 leading-relaxed mb-1">{t.strength}</p>
                      <p className="text-[12px] text-slate-400"><span className="font-semibold">Best for:</span> {t.bestFor}</p>
                    </div>
                    {t.href && (
                      <Link href={t.href} className="shrink-0">
                        <button className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 whitespace-nowrap group">
                          Try free <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RAG chunking */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">RAG chunking after markdown conversion</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
              Markdown conversion is step one. For RAG pipelines, the converted markdown then needs to be chunked into
              segments for vector embedding. The chunking strategy significantly affects retrieval quality.
            </p>
            <div className="flex flex-col gap-4">
              {[
                {
                  strategy: "Fixed-size chunking",
                  size: "256–512 tokens",
                  overlap: "10–15%",
                  pros: "Simple to implement. Predictable chunk sizes for embedding models.",
                  cons: "Splits mid-sentence or mid-section. Loses structural context. Lower precision.",
                },
                {
                  strategy: "Semantic / heading-based chunking",
                  size: "200–800 tokens",
                  overlap: "0–5%",
                  pros: "Chunks align to document sections. Heading context preserved. Better retrieval accuracy.",
                  cons: "Variable chunk sizes. Requires markdown heading hierarchy.",
                },
                {
                  strategy: "Max-Min Semantic Chunking",
                  size: "Variable",
                  overlap: "0%",
                  pros: "Embeds text first, uses semantic similarity for boundaries. Highest retrieval precision. Reduces vectors per document.",
                  cons: "Computationally expensive. Requires embedding model at chunk time.",
                },
              ].map((s) => (
                <div key={s.strategy} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-[14px] font-semibold text-slate-800">{s.strategy}</h3>
                    <div className="flex gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{s.size}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{s.overlap} overlap</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-semibold text-green-700 mb-1">Pros</p>
                      <p className="text-[12px] text-slate-500">{s.pros}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-red-700 mb-1">Cons</p>
                      <p className="text-[12px] text-slate-500">{s.cons}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
              <p className="text-[13px] text-blue-700">
                <strong>Recommendation:</strong> Start with semantic/heading-based chunking at 256–512 tokens. Markdown&apos;s
                heading hierarchy makes this straightforward — split on H2/H3 boundaries first, then by token count
                within sections. This outperforms fixed-size chunking with minimal added complexity.
              </p>
            </div>
          </section>

          {/* Step by step workflow */}
          <section className="mb-12">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">The complete PDF → AI workflow</h2>
            <div className="flex flex-col gap-4">
              {[
                { n: "01", title: "Convert PDF to clean markdown", body: "Use a tool that preserves heading hierarchy, handles tables accurately, and strips formatting overhead. For in-browser work: SuperMD markitdown. For Python pipelines: pymupdf4llm or Marker. Verify the output — check that headings, tables, and code blocks came through correctly." },
                { n: "02", title: "Clean and normalise the markdown", body: "Remove repeated boilerplate (headers, footers, page numbers). Standardise heading levels — if the PDF has inconsistent heading styles, normalise to H1 → H2 → H3 hierarchy. Strip any remaining extraction artefacts (garbled characters, broken lines)." },
                { n: "03", title: "Chunk using heading boundaries", body: "Split the document into sections at heading boundaries. Each section becomes one or more chunks. If a section exceeds 512 tokens, split further using sentence boundaries. Keep the parent heading as context prefix for each sub-chunk: '## Section Name\\n\\n[chunk content]'." },
                { n: "04", title: "Embed and index", body: "Embed each chunk using your model (text-embedding-3-small, Gemini text-embedding, Voyage-3, etc.). Store in a vector database (Pinecone, Weaviate, Qdrant, pgvector). Include metadata: source document, page range, section heading." },
                { n: "05", title: "Retrieve and inject as markdown", body: "At query time, retrieve top-k relevant chunks. Inject them into your LLM prompt as markdown — preserve the heading and bullet structure. The model reads it more accurately than plain text and uses the hierarchy to understand content relationships." },
              ].map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="font-mono text-[12px] text-blue-600 mt-1 shrink-0 w-6">{s.n}</span>
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
              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-900 mb-1">Convert your PDFs to LLM-ready markdown</h2>
              <p className="text-[13px] text-slate-500">Drop a PDF, DOCX, XLSX, or image. Get clean markdown with per-model profiles. Free, in-browser.</p>
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
