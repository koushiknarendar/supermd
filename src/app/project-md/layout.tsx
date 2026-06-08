import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "project.md — Combined Brand + Design Context File | SuperMD",
  description: "Combine brand guidelines and design tokens into one project.md. Paste a URL to extract styles, fill your brand details, download a single context file your AI can use for everything.",
  alternates: { canonical: "https://supermd.dev/project-md" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
