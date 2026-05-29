import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "context.md — Generate AI Context Files for Any Topic",
  description:
    "Build a structured context.md that instantly briefs any LLM on a topic, domain, or project. Paste notes, a URL, or type freely — get a reusable context file in seconds.",
  keywords: ["context file for AI", "LLM context", "AI briefing document", "context.md", "LLM knowledge layer"],
  alternates: { canonical: "https://supermd.dev/context-md" },
  openGraph: {
    title: "context.md — Generate AI Context Files for Any Topic",
    description: "Build a structured context.md that instantly briefs any LLM on a topic.",
    url: "https://supermd.dev/context-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
