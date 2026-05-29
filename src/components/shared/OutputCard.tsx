"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, Check } from "lucide-react"
import { toast } from "sonner"

interface Props {
  content: string
  filename: string
  label?: string
  mimeType?: string
}

export function OutputCard({ content, filename, label, mimeType = "text/plain" }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${filename}`)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="label-mono">{label ?? filename}</span>
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
            {filename}
          </Button>
        </div>
      </div>
      <pre className="p-5 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[520px] overflow-y-auto bg-slate-50">
        {content}
      </pre>
    </div>
  )
}
