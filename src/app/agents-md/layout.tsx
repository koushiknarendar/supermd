import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "agents.md — Multi-Agent Context File Generator",
  description:
    "Describe your multi-agent system and get a structured AGENTS.md — agent roles, tools, triggers, and handoff logic in one file. Free, no sign-up.",
  keywords: [
    "AGENTS.md generator",
    "multi-agent system",
    "AI agents context",
    "agent handoff",
    "agent orchestration",
    "Claude agents",
    "LLM agent context file",
  ],
  alternates: { canonical: "https://supermd.dev/agents-md" },
  openGraph: {
    title: "agents.md — Multi-Agent Context File Generator",
    description: "Define roles, tools, triggers, and handoff logic. Get AGENTS.md in seconds.",
    url: "https://supermd.dev/agents-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
