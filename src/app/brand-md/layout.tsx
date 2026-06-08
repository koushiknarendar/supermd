import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "brand.md — Generate Brand Guidelines for Your AI | SuperMD",
  description: "Fill the form. Get a structured brand.md with colors, typography, voice, and values — so your AI always stays on brand in every output.",
  alternates: { canonical: "https://supermd.dev/brand-md" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
