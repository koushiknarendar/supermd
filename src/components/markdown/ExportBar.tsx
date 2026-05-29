"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, Check } from "lucide-react"
import { toast } from "sonner"
import type { ConversionResult } from "@/types"

interface Props {
  result: ConversionResult
}

export function ExportBar({ result }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(result.formattedMarkdown)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
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
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="gap-1.5"
      >
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
  )
}
