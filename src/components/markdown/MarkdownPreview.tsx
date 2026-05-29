"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import { Button } from "@/components/ui/button"
import { Eye, Code } from "lucide-react"
import "highlight.js/styles/github.css"

interface Props {
  markdown: string
}

export function MarkdownPreview({ markdown }: Props) {
  const [showRaw, setShowRaw] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Preview</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRaw((v) => !v)}
          className="h-6 gap-1 text-xs text-zinc-400 hover:text-zinc-600"
        >
          {showRaw ? (
            <>
              <Eye className="h-3 w-3" /> Rendered
            </>
          ) : (
            <>
              <Code className="h-3 w-3" /> Raw
            </>
          )}
        </Button>
      </div>

      <div className="max-h-[500px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm">
        {showRaw ? (
          <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-700 leading-relaxed">
            {markdown}
          </pre>
        ) : (
          <div className="prose prose-sm prose-zinc max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
