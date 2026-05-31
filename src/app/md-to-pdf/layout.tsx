import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MD to PDF — Convert Markdown to PDF",
  description:
    "Paste markdown and download a styled PDF. Renders headings, code blocks, tables, and lists — with a clean print-ready layout. Free, runs in your browser.",
  keywords: ["markdown to pdf", "md to pdf converter", "convert markdown pdf", "markdown pdf generator"],
  alternates: { canonical: "https://supermd.dev/md-to-pdf" },
  openGraph: {
    title: "MD to PDF — Convert Markdown to PDF",
    description: "Paste markdown and download a clean PDF in seconds.",
    url: "https://supermd.dev/md-to-pdf",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
