"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, Check, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import type { ConversionResult } from "@/types"

interface Props {
  result: ConversionResult
}

interface SecretMatch {
  name: string
  pattern: RegExp
}

const SECRET_PATTERNS: SecretMatch[] = [
  { name: "OpenAI API key", pattern: /sk-[a-zA-Z0-9]{32,}/ },
  { name: "Anthropic API key", pattern: /sk-ant-[a-zA-Z0-9-]{32,}/ },
  { name: "GitHub token", pattern: /ghp_[a-zA-Z0-9]{36}/ },
  { name: "AWS access key", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "Stripe secret key", pattern: /sk_live_[a-zA-Z0-9]{24,}/ },
  { name: "Google API key", pattern: /AIza[0-9A-Za-z-_]{35}/ },
  { name: ".env secret", pattern: /^(API_KEY|SECRET|PASSWORD|DATABASE_URL|TOKEN|PRIVATE_KEY)\s*=\s*.+$/m },
]

function detectSecrets(text: string): string[] {
  return SECRET_PATTERNS
    .filter((p) => p.pattern.test(text))
    .map((p) => p.name)
}

export function ExportBar({ result }: Props) {
  const [copied, setCopied] = useState(false)

  const secrets = detectSecrets(result.formattedMarkdown)
  const hasSecrets = secrets.length > 0

  function handleCopy() {
    if (hasSecrets) {
      const ok = window.confirm(
        `⚠️ Possible secret detected in output:\n${secrets.join(", ")}\n\nCopy anyway?`
      )
      if (!ok) return
    }
    navigator.clipboard.writeText(result.formattedMarkdown)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    if (hasSecrets) {
      const ok = window.confirm(
        `⚠️ Possible secret detected in output:\n${secrets.join(", ")}\n\nDownload anyway?`
      )
      if (!ok) return
    }
    const basename = result.metadata.filename.replace(/\.[^.]+$/, "")
    const blob = new Blob([result.formattedMarkdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${basename}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Downloaded")
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      {hasSecrets && (
        <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] text-amber-700 font-medium">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          Possible secret in output: {secrets.join(", ")}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Download .md
        </Button>
      </div>
    </div>
  )
}
