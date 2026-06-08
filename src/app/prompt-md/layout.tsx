import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "prompt.md — System Prompt Generator for Claude, GPT & Gemini",
  description:
    "Fill the form and get a structured system prompt ready to paste into any LLM. Role, task, constraints, output format, and few-shot examples — all formatted correctly for Claude, GPT-4o, or Gemini. Free, no sign-up.",
  keywords: [
    "system prompt generator",
    "prompt builder",
    "Claude system prompt",
    "GPT system prompt",
    "LLM prompt template",
    "few-shot prompt",
    "AI prompt engineering",
    "system prompt template",
  ],
  alternates: { canonical: "https://supermd.dev/prompt-md" },
  openGraph: {
    title: "prompt.md — System Prompt Generator for Claude, GPT & Gemini",
    description: "Fill the form, get a structured system prompt. Role, constraints, format — done in 60 seconds.",
    url: "https://supermd.dev/prompt-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
