"use client"

import { Progress } from "@/components/ui/progress"
import type { ConverterProgress } from "@/hooks/useConverter"

interface Props {
  progress: ConverterProgress
  status: string
}

export function ProcessingStatus({ progress, status }: Props) {
  if (status === "idle" || status === "done" || status === "error") return null

  let label = "Converting..."
  let value = 0

  if (progress?.type === "pdf") {
    label = `Reading page ${progress.loaded} of ${progress.total}...`
    value = (progress.loaded / progress.total) * 100
  } else if (progress?.type === "ocr") {
    label =
      progress.status === "recognizing text"
        ? `Running OCR... ${Math.round(progress.progress * 100)}%`
        : progress.status
    value = progress.progress * 100
  } else if (status === "profiling") {
    label = "Applying LLM profile..."
    value = 95
  }

  return (
    <div className="flex flex-col gap-2 py-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <Progress value={value} className="h-1.5" />
    </div>
  )
}
