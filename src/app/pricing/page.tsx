import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing — SuperMD",
  description:
    "SuperMD markitdown is free for single files up to 5 MB, processed entirely in your browser. Pro tier with batch conversion, API access, and server-side quality coming soon.",
  alternates: { canonical: "https://supermd.dev/pricing" },
}

const FREE_FEATURES = [
  "PDF, DOCX, XLSX, image (OCR)",
  "Claude, GPT-4o, Gemini profiles",
  "Token savings display",
  "Copy & download .md",
  "Files never leave your browser",
  "Up to 5 MB per file",
]

const PRO_FEATURES = [
  "Everything in Free",
  "Server-side PDF (tables + images)",
  "High-quality cloud OCR",
  "Up to 50 MB per file",
  "Batch conversion (ZIP download)",
  "Saved custom profiles",
  "RAG-ready JSON export",
  "REST API access",
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center gap-3 px-6 py-5 max-w-5xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-zinc-600">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="font-semibold text-lg tracking-tight">SuperMD</span>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-32">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-semibold tracking-tight">Simple pricing</h1>
          <p className="mt-3 text-zinc-500">Start free. No sign-up required.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Free */}
          <div className="rounded-2xl border border-zinc-200 p-8 flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Free</p>
              <p className="mt-2 text-4xl font-semibold">$0</p>
              <p className="text-sm text-zinc-400 mt-1">No account required</p>
            </div>
            <Link href="/markitdown" className="w-full">
              <Button variant="outline" className="w-full">
                Start converting
              </Button>
            </Link>
            <ul className="flex flex-col gap-2.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-zinc-900 p-8 flex flex-col gap-6 relative">
            <div className="absolute top-4 right-4 rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white">
              Coming soon
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Pro</p>
              <p className="mt-2 text-4xl font-semibold">$9</p>
              <p className="text-sm text-zinc-400 mt-1">per month</p>
            </div>
            <Button className="w-full" disabled>
              Join waitlist
            </Button>
            <ul className="flex flex-col gap-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-zinc-400">
          Questions? Reach out at{" "}
          <a href="mailto:teamgrowth@letstranzact.com" className="underline hover:text-zinc-600">
            teamgrowth@letstranzact.com
          </a>
        </p>
      </main>
    </div>
  )
}
