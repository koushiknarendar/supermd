import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "design.md — Technical Design Doc Generator",
  description:
    "Fill the form and get a ready-to-use design.md for any feature or product. Context, problem, solution, decisions, data model, API design — structured for LLMs.",
  keywords: ["design doc generator", "technical design document", "design.md", "product spec", "LLM context"],
  alternates: { canonical: "https://supermd.dev/design-md" },
  openGraph: {
    title: "design.md — Technical Design Doc Generator",
    description: "Structured design docs your LLM can actually use. Fill the form, get design.md.",
    url: "https://supermd.dev/design-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
