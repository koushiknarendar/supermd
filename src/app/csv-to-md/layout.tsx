import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CSV to Markdown Table — Convert CSV for LLMs",
  description:
    "Paste any CSV and get a clean markdown table. Auto-detects delimiters, handles quoted fields, and formats for LLM context windows. Free, runs in your browser.",
  keywords: [
    "CSV to markdown",
    "CSV to markdown table",
    "CSV converter",
    "markdown table generator",
    "CSV for LLM",
    "spreadsheet to markdown",
  ],
  alternates: { canonical: "https://supermd.dev/csv-to-md" },
  openGraph: {
    title: "CSV to Markdown Table — Convert CSV for LLMs",
    description: "Paste any CSV, get a clean markdown table. Auto-detects delimiter, handles quotes.",
    url: "https://supermd.dev/csv-to-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
