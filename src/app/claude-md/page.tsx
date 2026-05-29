"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Loader2, AlertCircle, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateClaudeMd, type RepoData } from "@/lib/generators/claude-md"

type Status = "idle" | "fetching" | "done" | "error"

function parseGitHubUrl(raw: string): { owner: string; repo: string } | null {
  const match = raw.trim().match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/)
  if (!match) return null
  return { owner: match[1], repo: match[2].replace(/\.git$/, "").split("/")[0] }
}

async function githubFetch(path: string) {
  const res = await fetch(`/api/github?path=${encodeURIComponent(path)}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `GitHub error ${res.status}`)
  return data
}

async function fetchRepoData(owner: string, repo: string): Promise<RepoData> {
  const base = `/repos/${owner}/${repo}`

  const [repoInfo, readmeData, treeData] = await Promise.all([
    githubFetch(base),
    githubFetch(`${base}/readme`).catch(() => null),
    githubFetch(`${base}/git/trees/HEAD?recursive=1`).catch(() => null),
  ])

  let packageJson: Record<string, unknown> | null = null
  const pkgData = await githubFetch(`${base}/contents/package.json`).catch(() => null)
  if (pkgData?.content) {
    try {
      packageJson = JSON.parse(atob(pkgData.content.replace(/\n/g, "")))
    } catch { /* */ }
  }

  const readme = readmeData?.content
    ? atob(readmeData.content.replace(/\n/g, ""))
    : null

  const fileTree: string[] =
    treeData?.tree?.map((t: { path: string }) => t.path) ?? []

  return {
    name: repoInfo.name,
    description: repoInfo.description ?? null,
    defaultBranch: repoInfo.default_branch ?? "main",
    language: repoInfo.language ?? null,
    topics: repoInfo.topics ?? [],
    readme,
    packageJson,
    fileTree,
  }
}

export default function ClaudeMdPage() {
  const [tab, setTab] = useState<"github" | "paste">("github")
  const [url, setUrl] = useState("")
  const [pasteContent, setPasteContent] = useState("")
  const [repoName, setRepoName] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [output, setOutput] = useState("")

  async function handleGitHub() {
    const parsed = parseGitHubUrl(url)
    if (!parsed) { setError("Paste a valid GitHub URL, e.g. https://github.com/owner/repo"); setStatus("error"); return }
    setStatus("fetching")
    setError("")
    try {
      const data = await fetchRepoData(parsed.owner, parsed.repo)
      setOutput(generateClaudeMd(data))
      setStatus("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch repo.")
      setStatus("error")
    }
  }

  function handlePaste() {
    if (!pasteContent.trim()) { setError("Paste some content first."); setStatus("error"); return }
    setError("")
    const data: RepoData = {
      name: repoName.trim() || "my-project",
      description: null,
      defaultBranch: "main",
      language: null,
      topics: [],
      readme: pasteContent,
      packageJson: null,
      fileTree: [],
    }
    setOutput(generateClaudeMd(data))
    setStatus("done")
  }

  const loading = status === "fetching"

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
            <BookOpen className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">claude.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// claude.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Generate CLAUDE.md from any GitHub repo.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Paste a public GitHub URL. SuperMD fetches the repo structure, README, and package.json — then generates a CLAUDE.md that gives Claude everything it needs to work in your codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* Left — input */}
          <div className="flex flex-col gap-5">
            <Tabs value={tab} onValueChange={(v) => { setTab(v as "github" | "paste"); setStatus("idle"); setError("") }}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="github" className="gap-1.5">
                  <GitBranch className="h-3.5 w-3.5" /> GitHub URL
                </TabsTrigger>
                <TabsTrigger value="paste">Paste content</TabsTrigger>
              </TabsList>
            </Tabs>

            {tab === "github" ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="label-mono mb-2 block">Repository URL</label>
                  <Input
                    placeholder="https://github.com/owner/repo"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleGitHub()}
                    className="font-mono text-sm"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400">Public repos only. No auth required.</p>
                </div>
                <Button onClick={handleGitHub} disabled={loading || !url.trim()} className="w-fit gap-2" style={{ background: "#2563eb", color: "#fff" }}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Fetching repo…</> : "Generate CLAUDE.md"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="label-mono mb-2 block">Project name</label>
                  <Input placeholder="my-project" value={repoName} onChange={(e) => setRepoName(e.target.value)} />
                </div>
                <div>
                  <label className="label-mono mb-2 block">Paste README, package.json, or any context</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700"
                    rows={10}
                    placeholder="Paste your README.md, package.json, or any project context here..."
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                  />
                </div>
                <Button onClick={handlePaste} disabled={!pasteContent.trim()} className="w-fit gap-2" style={{ background: "#2563eb", color: "#fff" }}>
                  Generate CLAUDE.md
                </Button>
              </div>
            )}

            {status === "error" && error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-700">{error}</p>
              </div>
            )}

            {/* How it works */}
            {status === "idle" && (
              <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-5 flex flex-col gap-3">
                <p className="label-mono">// what gets detected</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Framework & version", "Package manager", "Key dependencies", "npm scripts", "Test runner", "Linter / formatter", "ORM", "File structure"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-slate-500">
                      <span className="h-1 w-1 rounded-full bg-blue-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — output */}
          <div>
            {status === "done" && output ? (
              <OutputCard content={output} filename="CLAUDE.md" label="Generated CLAUDE.md" />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center">
                <p className="text-[13px] text-slate-400 font-mono">Your CLAUDE.md will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content — always rendered */}
        <div className="mt-20 flex flex-col gap-16">

          {/* What is CLAUDE.md */}
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// what is claude.md</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  The file Claude reads before it reads anything else.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  CLAUDE.md is a special markdown file that Claude Code reads automatically at the start of every session. It tells Claude what your project is, how to run it, and how to work within it — without you repeating yourself in every prompt.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  A well-written CLAUDE.md means Claude immediately knows your tech stack, your commands, your conventions, and your architecture. It stops making assumptions. It stops suggesting the wrong framework. It stops asking questions you&apos;ve answered a hundred times.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                  <span className="font-mono text-[11px] text-slate-500">CLAUDE.md</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-600 leading-relaxed bg-white">{`# CLAUDE.md

## Overview
Next.js SaaS app for converting files to markdown.

## Tech Stack
- Framework: Next.js 16 (Turbopack)
- Language: TypeScript
- Styling: Tailwind CSS v4

## Commands
\`\`\`bash
npm run dev    # start dev server
npm run build  # production build
npm run test   # run Vitest
\`\`\`

## Conventions
- ESLint + Prettier
- Source code in src/
- App Router — routes are folders in app/`}</pre>
              </div>
            </div>
          </section>

          {/* Use cases */}
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// use cases</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              When do you need a CLAUDE.md?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Starting a new project with Claude Code", desc: "Generate a CLAUDE.md on day one. Claude immediately understands your stack, your commands, and your conventions — no warmup prompts needed.", tag: "Solo dev" },
                { title: "Onboarding Claude to an existing codebase", desc: "Paste your GitHub URL and get a CLAUDE.md that captures your real project state — not a generic template. Claude stops guessing about your architecture.", tag: "Existing projects" },
                { title: "Consistent behaviour across sessions", desc: "Without CLAUDE.md, every new Claude session starts from zero. With it, Claude behaves consistently — same conventions, same patterns, same assumptions every time.", tag: "Teams" },
                { title: "Reducing repeated context in prompts", desc: "Every token you spend re-explaining your stack is a token wasted. A good CLAUDE.md eliminates the preamble from every prompt and keeps your context window for actual work.", tag: "Token efficiency" },
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

          {/* What gets detected */}
          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// auto-detection</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              What SuperMD detects from your repo.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-slate-200 rounded-xl overflow-hidden">
              {[
                { group: "Framework", items: ["Next.js", "React", "Vue", "Svelte", "Angular", "NestJS", "Go", "Rust", "Python"] },
                { group: "Tooling", items: ["npm / pnpm / bun / yarn", "ESLint", "Prettier", "Biome", "TypeScript"] },
                { group: "Testing", items: ["Vitest", "Jest", "Playwright", "Cypress"] },
                { group: "Infrastructure", items: ["Prisma ORM", "Drizzle ORM", "Docker", "Postgres", ".env pattern"] },
              ].map((g, i) => (
                <div key={g.group} className={`p-5 ${i < 3 ? "border-r border-slate-200" : ""}`}>
                  <p className="label-mono mb-3">{g.group}</p>
                  <ul className="flex flex-col gap-1.5">
                    {g.items.map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-[12px] text-slate-500">
                        <span className="h-1 w-1 rounded-full bg-blue-300 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
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
                { q: "Does Claude automatically read CLAUDE.md?", a: "Yes. Claude Code reads CLAUDE.md from your project root automatically at the start of every session. You can also have CLAUDE.md files in subdirectories for per-module context." },
                { q: "What should go in a CLAUDE.md?", a: "The most valuable sections are: (1) a brief project overview, (2) the tech stack with versions, (3) the commands needed to run, build, and test the project, and (4) coding conventions and gotchas. Keep it under 500 tokens — longer files are less reliably followed." },
                { q: "How often should I update my CLAUDE.md?", a: "Update it when your stack changes, when you add major dependencies, or when you notice Claude repeatedly making the same mistake. Think of it as living documentation — it should reflect the current state of your project." },
                { q: "Can I use this for private repos?", a: "The GitHub URL tab only works for public repos. For private repos, use the Paste tab — copy your README.md and package.json and paste them in. The generator works from any text content." },
                { q: "Can I customise the generated CLAUDE.md?", a: "Yes — the output is plain markdown. Copy it, edit it in any text editor, and paste any additional context that SuperMD couldn't detect automatically (e.g. deployment process, third-party integrations, known gotchas)." },
                { q: "Is CLAUDE.md the same as a system prompt?", a: "Similar concept, different mechanism. A system prompt is per-conversation. CLAUDE.md is persistent across all Claude Code sessions in a project, and is read from the file system rather than passed via API. It&apos;s designed specifically for coding context." },
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
