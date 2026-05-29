export interface RepoData {
  name: string
  description: string | null
  defaultBranch: string
  language: string | null
  topics: string[]
  readme: string | null
  packageJson: Record<string, unknown> | null
  fileTree: string[]
}

function detectFramework(deps: Record<string, string>, tree: string[]): string {
  if (deps["next"]) return `Next.js ${(deps["next"] as string).replace(/[\^~]/, "")}`
  if (deps["nuxt"]) return `Nuxt ${(deps["nuxt"] as string).replace(/[\^~]/, "")}`
  if (deps["@sveltejs/kit"]) return "SvelteKit"
  if (deps["svelte"]) return "Svelte"
  if (deps["@angular/core"]) return "Angular"
  if (deps["vue"]) return `Vue ${(deps["vue"] as string).replace(/[\^~]/, "")}`
  if (deps["react"]) return `React ${(deps["react"] as string).replace(/[\^~]/, "")}`
  if (deps["express"]) return "Express"
  if (deps["fastify"]) return "Fastify"
  if (deps["hono"]) return "Hono"
  if (tree.some((f) => f.endsWith("main.go") || f.endsWith("go.mod"))) return "Go"
  if (tree.some((f) => f.endsWith("Cargo.toml"))) return "Rust"
  if (tree.some((f) => f.includes("pyproject.toml") || f.includes("requirements.txt"))) return "Python"
  if (deps["@nestjs/core"]) return "NestJS"
  return "Node.js"
}

function detectPackageManager(tree: string[]): string {
  if (tree.includes("pnpm-lock.yaml")) return "pnpm"
  if (tree.includes("bun.lockb") || tree.includes("bun.lock")) return "bun"
  if (tree.includes("yarn.lock")) return "yarn"
  return "npm"
}

function detectTesting(deps: Record<string, string>): string | null {
  if (deps["vitest"]) return "Vitest"
  if (deps["jest"] || deps["@jest/core"]) return "Jest"
  if (deps["@playwright/test"] || deps["playwright"]) return "Playwright"
  if (deps["cypress"]) return "Cypress"
  return null
}

function detectLinting(tree: string[], deps: Record<string, string>): string[] {
  const tools: string[] = []
  if (tree.some((f) => f.includes("biome.json") || f.includes("biome.jsonc"))) tools.push("Biome")
  if (tree.some((f) => f.match(/\.eslintrc|eslint\.config/))) tools.push("ESLint")
  if (tree.some((f) => f.match(/\.prettierrc|prettier\.config/))) tools.push("Prettier")
  if (deps["@typescript-eslint/parser"] || deps["typescript"]) tools.push("TypeScript")
  return tools
}

function detectOrm(tree: string[], deps: Record<string, string>): string | null {
  if (tree.some((f) => f.includes("prisma/schema"))) return "Prisma"
  if (deps["drizzle-orm"] || tree.some((f) => f.includes("drizzle.config"))) return "Drizzle"
  if (deps["typeorm"]) return "TypeORM"
  if (deps["mongoose"]) return "Mongoose"
  return null
}

function readmeFirstParagraph(readme: string): string {
  const lines = readme.split("\n")
  const para: string[] = []
  let inPara = false
  for (const line of lines) {
    const stripped = line.trim()
    if (stripped.startsWith("#")) continue
    if (stripped.startsWith("![") || stripped.startsWith("<img")) continue
    if (stripped.startsWith("[![")) continue
    if (stripped === "") {
      if (inPara) break
      continue
    }
    para.push(stripped)
    inPara = true
    if (para.length >= 3) break
  }
  return para.join(" ")
}

function condensedTree(tree: string[]): string {
  const dirs = new Set<string>()
  const topLevel: string[] = []

  for (const path of tree) {
    const parts = path.split("/")
    if (parts.length === 1) {
      topLevel.push(path)
    } else {
      dirs.add(parts[0] + "/")
    }
  }

  const entries = [
    ...topLevel.filter((f) => !f.startsWith(".") && f !== "node_modules").slice(0, 10),
    ...[...dirs].filter((d) => d !== "node_modules/").sort().slice(0, 20),
  ]
  return entries.slice(0, 28).join("\n")
}

function formatScripts(scripts: Record<string, string>, pm: string): string {
  const important = ["dev", "start", "build", "test", "lint", "typecheck", "type-check", "check", "format", "migrate", "db:push", "db:studio"]
  const lines: string[] = []
  for (const key of important) {
    if (scripts[key]) {
      lines.push(`${pm} run ${key}`)
    }
  }
  return lines.join("\n")
}

export function generateClaudeMd(data: RepoData): string {
  const pkg = data.packageJson ?? {}
  const deps = {
    ...((pkg.dependencies as Record<string, string>) ?? {}),
    ...((pkg.devDependencies as Record<string, string>) ?? {}),
  }
  const scripts = (pkg.scripts as Record<string, string>) ?? {}
  const tree = data.fileTree

  const pm = detectPackageManager(tree)
  const framework = detectFramework(deps, tree)
  const testing = detectTesting(deps)
  const linting = detectLinting(tree, deps)
  const orm = detectOrm(tree, deps)

  const mainDeps = Object.keys((pkg.dependencies as Record<string, string>) ?? {})
    .filter((d) => !["react-dom", "react"].includes(d))
    .slice(0, 8)
    .join(", ")

  const overview = data.description
    ? data.description
    : data.readme
    ? readmeFirstParagraph(data.readme)
    : `${data.name} — no description found.`

  const scriptBlock = Object.keys(scripts).length
    ? "```bash\n" + formatScripts(scripts, pm) + "\n```"
    : `_No scripts found in package.json._`

  const treeBlock = tree.length
    ? "```\n" + condensedTree(tree) + "\n```"
    : "_File tree unavailable._"

  const conventions: string[] = []
  if (linting.length) conventions.push(`Linting/formatting: ${linting.join(", ")}`)
  if (testing) conventions.push(`Tests: ${testing}`)
  if (orm) conventions.push(`ORM: ${orm}`)
  if (tree.some((f) => f === ".env.example" || f === ".env.sample")) conventions.push("Copy `.env.example` → `.env.local` to set up environment variables")
  if (tree.some((f) => f.startsWith("src/"))) conventions.push("Source code lives in `src/`")
  if (tree.some((f) => f.startsWith("app/"))) conventions.push("App Router pattern — routes are folders inside `app/`")
  if (tree.some((f) => f.includes("prisma/schema"))) conventions.push("Run `prisma db push` after changing the schema")
  if (data.topics.includes("monorepo")) conventions.push("Monorepo — check individual package READMEs for per-package commands")

  const conventionsBlock = conventions.length
    ? conventions.map((c) => `- ${c}`).join("\n")
    : "- Follow existing code style and naming patterns in the codebase"

  return `# CLAUDE.md

This file gives Claude context about \`${data.name}\` — what it is, how to run it, and how to work within it.

## Overview

${overview}

## Tech Stack

- **Framework**: ${framework}
- **Language**: ${data.language ?? "TypeScript"}
- **Package manager**: ${pm}${mainDeps ? `\n- **Key libraries**: ${mainDeps}` : ""}${testing ? `\n- **Testing**: ${testing}` : ""}${linting.length ? `\n- **Linting**: ${linting.join(", ")}` : ""}${orm ? `\n- **ORM**: ${orm}` : ""}

## Project Structure

${treeBlock}

## Commands

${scriptBlock}

## Conventions

${conventionsBlock}

## Important Notes

- Default branch is \`${data.defaultBranch}\`
- Do not commit secrets — use environment variables${data.topics.length ? `\n- Topics: ${data.topics.join(", ")}` : ""}
`
}
