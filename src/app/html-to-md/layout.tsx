import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "HTML to Markdown — Convert HTML to Clean MD",
  description:
    "Paste HTML or drop a URL. Get clean, LLM-ready markdown instantly. Strips nav, scripts, and noise — leaves only the content. Free, runs in your browser.",
  keywords: ["html to markdown", "html to md converter", "convert html markdown", "turndown", "web scrape to markdown"],
  alternates: { canonical: "https://supermd.dev/html-to-md" },
  openGraph: {
    title: "HTML to Markdown — Convert HTML to Clean MD",
    description: "Paste HTML or drop a URL. Get clean markdown in seconds.",
    url: "https://supermd.dev/html-to-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
