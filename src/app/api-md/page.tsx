"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Plug, AlertCircle } from "lucide-react"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateApiMd } from "@/lib/generators/api-md"
import { estimateTokens } from "@/lib/compressors/token-compress"

const SAMPLE_JSON = JSON.stringify(
  {
    openapi: "3.0.0",
    info: { title: "Acme API", version: "1.0.0", description: "REST API for the Acme platform." },
    servers: [{ url: "https://api.acme.com/v1" }],
    paths: {
      "/users": {
        get: {
          summary: "List users",
          tags: ["Users"],
          parameters: [
            { name: "limit", in: "query", required: false, description: "Max results", schema: { type: "integer" } },
            { name: "cursor", in: "query", required: false, description: "Pagination cursor", schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "A list of users",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      users: { type: "array", items: { $ref: "#/components/schemas/User" } },
                      next_cursor: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a user",
          tags: ["Users"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "name"],
                  properties: {
                    email: { type: "string", format: "email", description: "User email address" },
                    name: { type: "string", description: "Full name" },
                    role: { type: "string", enum: ["admin", "member", "viewer"] },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "User created", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
            "422": { description: "Validation error" },
          },
        },
      },
      "/users/{id}": {
        delete: {
          summary: "Delete a user",
          tags: ["Users"],
          parameters: [{ name: "id", in: "path", required: true, description: "User ID", schema: { type: "string" } }],
          responses: { "204": { description: "Deleted" }, "404": { description: "Not found" } },
        },
      },
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            role: { type: "string", enum: ["admin", "member", "viewer"] },
            created_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  null,
  2
)

export default function ApiMdPage() {
  const [input, setInput] = useState("")

  const hasInput = input.trim().length > 0

  const result = useMemo(() => {
    if (!hasInput) return null
    return generateApiMd(input)
  }, [input, hasInput])

  const inputTokens = useMemo(() => estimateTokens(input), [input])
  const outputTokens = useMemo(() => (result?.markdown ? estimateTokens(result.markdown) : 0), [result])
  const saved = inputTokens - outputTokens
  const savingsPct = inputTokens > 0 ? Math.round((saved / inputTokens) * 100) : 0

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
            <Plug className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">api.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// api.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            OpenAPI spec → LLM-readable docs.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste an OpenAPI 3.x or Swagger 2.x JSON spec. Get clean markdown — endpoints, parameters, schemas, and responses —
            without the JSON noise. Feed it to any LLM as API context.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-mono">OpenAPI JSON</span>
              <div className="flex items-center gap-3">
                {hasInput && <span className="text-[11px] font-mono text-slate-400">~{inputTokens.toLocaleString()} tokens</span>}
                {!hasInput && (
                  <button onClick={() => setInput(SAMPLE_JSON)} className="text-[11px] font-mono text-blue-500 hover:text-blue-700 transition-colors">
                    try sample →
                  </button>
                )}
              </div>
            </div>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[12px] font-mono text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none leading-relaxed"
              rows={20}
              placeholder={'{\n  "openapi": "3.0.0",\n  "info": { "title": "My API", "version": "1.0.0" },\n  "paths": { ... }\n}'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-[12px] text-slate-500 leading-relaxed">
              <strong className="text-slate-700 font-medium">JSON only.</strong> Have a YAML spec? Convert it first at{" "}
              <code className="bg-slate-100 px-1 rounded font-mono">yaml-to-json.com</code> or paste it into Claude / ChatGPT and ask for JSON output.
            </div>
            {hasInput && (
              <button onClick={() => setInput("")} className="self-start text-[11px] font-mono text-slate-300 hover:text-slate-500 transition-colors">clear</button>
            )}
          </div>

          {/* Right — output */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-mono">API docs</span>
              {result?.markdown && saved > 0 && (
                <div className="flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: "#f0fdf4", color: "#15803d" }}>
                  −{saved.toLocaleString()} tokens · {savingsPct}% smaller
                </div>
              )}
            </div>

            {result?.error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-5 flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-[13px] text-red-700">{result.error}</p>
              </div>
            ) : result?.markdown ? (
              <>
                <OutputCard
                  content={result.markdown}
                  filename="api.md"
                  label={`api.md · ${result.endpointCount} endpoint${result.endpointCount !== 1 ? "s" : ""} · ~${outputTokens.toLocaleString()} tokens`}
                />
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] text-blue-700 leading-relaxed">
                  Paste <code className="bg-blue-100 px-1 rounded font-mono">api.md</code> into your LLM context before asking it to write API calls, generate SDKs, or build integrations.
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[420px] flex flex-col items-center justify-center gap-2">
                <p className="text-[13px] text-slate-400 font-mono">Docs appear here</p>
                <p className="text-[11px] text-slate-300">Paste an OpenAPI JSON spec on the left</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// why not just paste the spec</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  OpenAPI JSON is noisy. LLMs don&apos;t need all of it.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  A typical OpenAPI spec is 50–90% structural overhead — deeply nested JSON, repeated <code className="bg-slate-100 px-1 rounded font-mono text-[12px]">$ref</code> chains, example payloads, server variable definitions, and extension keys. The LLM needs the endpoints, the parameters, and the schemas. Nothing else.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  This tool resolves <code className="bg-slate-100 px-1 rounded font-mono text-[12px]">$ref</code> references inline, flattens the schema hierarchy to a readable depth, groups endpoints by tag, and removes everything the LLM doesn&apos;t need to generate correct API calls.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  The result is typically <strong className="text-slate-700 font-medium">40–70% fewer tokens</strong> than the raw JSON spec — while containing all the information an LLM needs to write client code, generate tests, or answer questions about the API.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "Endpoints", desc: "Method, path, and summary for every operation" },
                  { label: "Parameters", desc: "Name, location, type, required flag, and description as a table" },
                  { label: "Request schemas", desc: "$refs resolved inline — no separate schema lookup needed" },
                  { label: "Response schemas", desc: "Status code, description, and response body structure" },
                  { label: "Tag grouping", desc: "Endpoints organized by tag for easy navigation" },
                  { label: "Token savings", desc: "40–70% smaller than the raw JSON spec" },
                ].map((f) => (
                  <div key={f.label} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3">
                    <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#2563eb" }} />
                    <div>
                      <span className="text-[13px] font-semibold text-slate-800">{f.label}</span>
                      <span className="text-[13px] text-slate-500 ml-2">{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12 pb-4">
            <p className="label-mono mb-4">// faq</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">Frequently asked questions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { q: "Which spec versions are supported?", a: "OpenAPI 3.x (3.0, 3.1) and Swagger 2.x. Both JSON formats are supported. YAML is not supported — convert to JSON first using any free online converter or by asking an LLM." },
                { q: "Are $ref schemas resolved?", a: "Yes. References to components/schemas (OpenAPI 3.x) and definitions (Swagger 2.x) are resolved inline up to 3 levels deep. Circular references are truncated with { ... } to prevent infinite loops." },
                { q: "What gets omitted?", a: "Examples, extensions (x-* fields), server variable definitions, security scheme details, external docs links, and deeply nested schema levels beyond 3. These rarely affect the LLM's ability to generate correct API calls." },
                { q: "How should I use the output?", a: "Paste api.md into your LLM context at the start of a session before asking it to write API calls, generate SDK clients, build integrations, or answer questions about the API. It gives the model accurate endpoint and schema knowledge without guessing." },
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
