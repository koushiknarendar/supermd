import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
})

const BASE = "https://supermd.dev"

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "SuperMD — Generate the Markdown Your AI Actually Needs",
    template: "%s | SuperMD",
  },
  description:
    "SuperMD is the markdown generator for the AI era. Convert files, generate CLAUDE.md, build skill files — every MD tool focused on reducing token waste.",
  keywords: [
    "markdown generator for LLM",
    "convert file to markdown",
    "LLM-optimized markdown",
    "reduce LLM tokens",
    "CLAUDE.md generator",
    "AI context file",
    "markitdown",
    "supermd",
  ],
  authors: [{ name: "SuperMD" }],
  creator: "SuperMD",
  openGraph: {
    type: "website",
    siteName: "SuperMD",
    locale: "en_US",
    url: BASE,
    title: "SuperMD — Generate the Markdown Your AI Actually Needs",
    description:
      "The markdown generator for the AI era. Convert files, generate CLAUDE.md, build skill files — every MD tool focused on reducing token waste.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperMD — Generate the Markdown Your AI Actually Needs",
    description:
      "The markdown generator for the AI era. Convert files to LLM-optimized markdown with up to 63% fewer tokens.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased bg-white text-zinc-900 min-h-screen`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
