import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "api.md — OpenAPI to Markdown for LLMs",
  description:
    "Paste an OpenAPI or Swagger JSON spec. Get clean, LLM-readable API docs in markdown — endpoints, parameters, schemas, and responses without the JSON noise. Free, runs in your browser.",
  keywords: [
    "OpenAPI to markdown",
    "Swagger to markdown",
    "API docs for LLM",
    "OpenAPI markdown generator",
    "API reference markdown",
    "LLM API context",
  ],
  alternates: { canonical: "https://supermd.dev/api-md" },
  openGraph: {
    title: "api.md — OpenAPI to Markdown for LLMs",
    description: "Paste an OpenAPI spec, get clean LLM-readable API docs in markdown.",
    url: "https://supermd.dev/api-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
