import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import Script from "next/script"
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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PZXCFH78');`}
        </Script>
      </head>
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased bg-white text-zinc-900 min-h-screen`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PZXCFH78"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Grain noise overlay — adds tactile depth to flat white */}
        <div
          className="grain pointer-events-none fixed inset-0 z-50"
          style={{ opacity: 0.035, mixBlendMode: "multiply" }}
        />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
