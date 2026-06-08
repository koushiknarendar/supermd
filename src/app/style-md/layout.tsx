import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "style.md — Extract Any Website's Design System | SuperMD",
  description: "Paste a URL, get a style.md with exact CSS colors, fonts, spacing, radii, and shadows. Give your AI the real design tokens to match any site precisely.",
  alternates: { canonical: "https://supermd.dev/style-md" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
