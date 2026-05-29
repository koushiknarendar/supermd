import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "markitdown — Convert PDF, DOCX & Files to LLM-Optimized Markdown",
  description:
    "Convert any file to clean, LLM-optimized markdown in one click. Supports PDF, DOCX, XLSX, CSV, and images. Choose Claude, GPT-4o, or Gemini profile — see exactly how many tokens you save. Free, runs in your browser.",
  keywords: [
    "convert PDF to markdown",
    "convert DOCX to markdown",
    "convert XLSX to markdown",
    "file to markdown converter",
    "LLM-optimized markdown",
    "reduce LLM tokens",
    "markitdown",
    "markdown for Claude",
    "markdown for GPT-4o",
    "token reduction tool",
    "AI context file generator",
    "supermd markitdown",
  ],
  alternates: { canonical: "https://supermd.dev/markitdown" },
  openGraph: {
    title: "markitdown — Convert Any File to LLM-Optimized Markdown",
    description:
      "Drop a PDF, DOCX, XLSX, or image. Get clean markdown optimized for Claude, GPT-4o, or Gemini — with up to 63% fewer tokens. Free, runs in your browser.",
    url: "https://supermd.dev/markitdown",
  },
  twitter: {
    title: "markitdown — Convert Any File to LLM-Optimized Markdown",
    description:
      "Drop a PDF, DOCX, XLSX, or image. Get clean markdown with up to 63% fewer tokens. Free, runs in your browser.",
  },
}

export default function MarkitdownLayout({ children }: { children: React.ReactNode }) {
  return children
}
