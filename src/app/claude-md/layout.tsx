import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "claude.md — Generate CLAUDE.md from Any GitHub Repo",
  description:
    "Paste a GitHub URL and get a structured CLAUDE.md in seconds. Detects framework, language, scripts, and conventions automatically. Free, no sign-up.",
  keywords: ["CLAUDE.md generator", "Claude Code context", "generate CLAUDE.md", "GitHub repo to markdown", "AI codebase context"],
  alternates: { canonical: "https://supermd.dev/claude-md" },
  openGraph: {
    title: "claude.md — Generate CLAUDE.md from Any GitHub Repo",
    description: "Paste a GitHub URL and get a structured CLAUDE.md in seconds.",
    url: "https://supermd.dev/claude-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
