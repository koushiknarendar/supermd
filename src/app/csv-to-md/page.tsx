"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Table } from "lucide-react"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { csvToMarkdown, type Delimiter } from "@/lib/converters/csv"
import { estimateTokens } from "@/lib/compressors/token-compress"

const SAMPLE = `name,age,city,role
Alice Johnson,32,New York,Engineer
Bob Smith,28,"San Francisco, CA",Designer
"Carol O'Brien",45,Austin,Manager
Dave Lee,31,Seattle,Engineer
Eve Martinez,26,Chicago,Product`

const MAX_ROW_OPTIONS = [
  { value: 50, label: "50 rows" },
  { value: 100, label: "100 rows" },
  { value: 250, label: "250 rows" },
  { value: 0, label: "All rows" },
]

const DELIMITER_OPTIONS: { value: Delimiter; label: string }[] = [
  { value: "auto", label: "Auto-detect" },
  { value: ",", label: "Comma (,)" },
  { value: "\t", label: "Tab (\\t)" },
  { value: ";", label: "Semicolon (;)" },
  { value: "|", label: "Pipe (|)" },
]

export default function CsvToMdPage() {
  const [input, setInput] = useState("")
  const [delimiter, setDelimiter] = useState<Delimiter>("auto")
  const [hasHeader, setHasHeader] = useState(true)
  const [maxRows, setMaxRows] = useState(100)

  const hasInput = input.trim().length > 0

  const result = useMemo(() => {
    if (!hasInput) return null
    return csvToMarkdown(input, { delimiter, hasHeader, maxRows })
  }, [input, delimiter, hasHeader, maxRows, hasInput])

  const inputTokens = useMemo(() => estimateTokens(input), [input])
  const outputTokens = useMemo(() => (result ? estimateTokens(result.table) : 0), [result])

  const delLabel: Record<string, string> = { ",": "comma", "\t": "tab", ";": "semicolon", "|": "pipe" }

  const selectClass = "rounded-lg border border-slate-200 px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-700"

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
            <Table className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">csv-to-md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// csv-to-md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            CSV to markdown table.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste any CSV — comma, tab, semicolon, or pipe separated. Get a clean markdown table LLMs can read, query, and reason over.
            Auto-detects the delimiter. Handles quoted fields with commas inside.
          </p>
        </div>

        {/* Options bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <select className={selectClass} value={delimiter} onChange={(e) => setDelimiter(e.target.value as Delimiter)}>
            {DELIMITER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-200"
            />
            First row is header
          </label>
          <select className={selectClass} value={maxRows} onChange={(e) => setMaxRows(Number(e.target.value))}>
            {MAX_ROW_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-mono">CSV input</span>
              <div className="flex items-center gap-3">
                {hasInput && <span className="text-[11px] font-mono text-slate-400">~{inputTokens.toLocaleString()} tokens</span>}
                {!hasInput && (
                  <button onClick={() => setInput(SAMPLE)} className="text-[11px] font-mono text-blue-500 hover:text-blue-700 transition-colors">
                    try sample →
                  </button>
                )}
              </div>
            </div>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-mono text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none leading-relaxed"
              rows={18}
              placeholder={"name,age,city\nAlice,32,New York\nBob,28,\"San Francisco, CA\""}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {hasInput && (
              <button onClick={() => setInput("")} className="self-start text-[11px] font-mono text-slate-300 hover:text-slate-500 transition-colors">
                clear
              </button>
            )}
          </div>

          {/* Right — output */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-mono">Markdown table</span>
              {result && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  {result.detectedDelimiter && delimiter === "auto" && (
                    <span className="bg-slate-100 px-2 py-0.5 rounded">detected: {delLabel[result.detectedDelimiter] ?? result.detectedDelimiter}</span>
                  )}
                  <span>{result.rows} rows · {result.cols} cols</span>
                  <span>~{outputTokens.toLocaleString()} tok</span>
                </div>
              )}
            </div>
            {result && result.table ? (
              <>
                <OutputCard content={result.table} filename="table.md" label="table.md" />
                {result.truncated && (
                  <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-[12px] text-amber-700">
                    Showing {maxRows} of {result.rows + (input.split("\n").length - result.rows - (hasHeader ? 1 : 0))} rows.
                    Select <strong>&ldquo;All rows&rdquo;</strong> above to include everything.
                  </div>
                )}
              </>
            ) : hasInput ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-[13px] text-red-600">
                Could not parse the CSV. Check that the delimiter setting matches your file format.
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[340px] flex flex-col items-center justify-center gap-2">
                <p className="text-[13px] text-slate-400 font-mono">Table appears here</p>
                <p className="text-[11px] text-slate-300">Paste CSV on the left to start</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// why markdown tables</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  LLMs read tables better than raw CSV.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  When you paste raw CSV into a prompt, the LLM sees a stream of comma-separated values with no explicit structure. It has to guess what&apos;s a header and what&apos;s data. The more columns or quoted fields involved, the more likely it is to misparse a row.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  Markdown tables use <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[12px]">|</code> as an unambiguous cell separator, with a header row explicitly separated by <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[12px]">---</code>. Every major LLM was trained on markdown and parses it accurately even for complex multi-column data.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  For large tables, set the max rows limit to keep your context window focused — send the LLM the most relevant slice, not the entire dataset.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                  <span className="font-mono text-[11px] text-slate-400 line-through">raw CSV</span>
                  <span className="font-mono text-[11px] text-slate-700">→ markdown table</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-100">
                  <pre className="p-4 text-[11px] font-mono text-slate-400 leading-relaxed bg-white overflow-x-auto">{`name,age,city
Alice,32,New York
"Bob, Jr.",28,SF
Carol,45,Austin`}</pre>
                  <pre className="p-4 text-[11px] font-mono text-slate-700 leading-relaxed bg-white overflow-x-auto">{`| name | age | city |
| --- | --- | --- |
| Alice | 32 | New York |
| Bob, Jr. | 28 | SF |
| Carol | 45 | Austin |`}</pre>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12 pb-4">
            <p className="label-mono mb-4">// faq</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">Frequently asked questions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { q: "What delimiters are supported?", a: "Comma, tab, semicolon, and pipe. Auto-detect picks the most frequent delimiter in the first 2,000 characters — it works for almost every CSV format. Switch to manual if your file uses an unusual delimiter." },
                { q: "Does it handle quoted fields?", a: "Yes. Fields containing commas, newlines, or pipes can be wrapped in double quotes — the parser handles them correctly, including escaped quotes inside fields (e.g. \"it's a \"\"quote\"\"\")." },
                { q: "What's the max rows limit for?", a: "To keep your context window manageable. A 10,000-row CSV would use tens of thousands of tokens. Set a limit to send only the most relevant rows to the LLM — useful for sampling large datasets." },
                { q: "Can I paste tab-separated data?", a: "Yes — copy directly from Excel or Google Sheets and select 'Tab' delimiter. When you copy a spreadsheet selection, it copies as TSV (tab-separated values) which this tool handles correctly." },
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
