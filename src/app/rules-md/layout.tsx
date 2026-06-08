import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "rules.md — Generate AI Coding Rules for Cursor, Copilot & Windsurf",
  description:
    "Fill the form and get AI coding rules for Cursor (.cursorrules), GitHub Copilot (copilot-instructions.md), and Windsurf (.windsurfrules). Free, instant, no sign-up.",
  keywords: [
    "cursorrules generator",
    "copilot instructions",
    "windsurfrules",
    "AI coding rules",
    "cursor rules",
    ".cursorrules",
    "GitHub Copilot instructions",
    "AI code editor rules",
  ],
  alternates: { canonical: "https://supermd.dev/rules-md" },
  openGraph: {
    title: "rules.md — Generate AI Coding Rules for Cursor, Copilot & Windsurf",
    description: "Fill one form, get rules files for every major AI code editor in seconds.",
    url: "https://supermd.dev/rules-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
