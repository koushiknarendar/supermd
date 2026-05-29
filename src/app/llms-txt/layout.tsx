import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "llms.txt — Generate llms.txt for Any Website",
  description:
    "Paste your URL and get a spec-compliant llms.txt file so LLMs can navigate your site without hallucinating. Crawls up to 5 pages. Free, no sign-up.",
  keywords: ["llms.txt generator", "llms txt", "website for LLMs", "AI website indexing", "llmstxt"],
  alternates: { canonical: "https://supermd.dev/llms-txt" },
  openGraph: {
    title: "llms.txt — Generate llms.txt for Any Website",
    description: "Paste your URL and get a spec-compliant llms.txt file in seconds.",
    url: "https://supermd.dev/llms-txt",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
