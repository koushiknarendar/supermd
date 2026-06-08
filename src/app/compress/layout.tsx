import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Token Compressor — Shrink Any Text Before Sending to an LLM",
  description:
    "Paste any prompt or document. Filler phrases are removed, redundancy stripped, whitespace cleaned — fewer tokens, same meaning. Free, runs in your browser.",
  keywords: [
    "token compressor",
    "reduce tokens",
    "compress prompt",
    "LLM token optimization",
    "reduce token count",
    "prompt compression",
    "token reduction",
    "AI token savings",
  ],
  alternates: { canonical: "https://supermd.dev/compress" },
  openGraph: {
    title: "Token Compressor — Shrink Any Text Before Sending to an LLM",
    description: "Filler removed, redundancy stripped. Fewer tokens, same meaning.",
    url: "https://supermd.dev/compress",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
