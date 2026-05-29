"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, AlertTriangle } from "lucide-react"
import type { ConversionResult, LLMProfile } from "@/types"
import { MODEL_PRICING } from "@/types"
import { cn } from "@/lib/utils"

interface Props {
  result: ConversionResult
  profile: LLMProfile
}

export function TokenCounter({ result, profile }: Props) {
  const pct = Math.min(result.contextWindowPercent * 100, 100)
  const isWarning = result.contextWindowPercent >= profile.warningThreshold
  const isExceeded = result.contextWindowPercent >= 1

  const savingsPct =
    result.rawTokenEstimate > 0
      ? Math.round((result.tokensSaved / result.rawTokenEstimate) * 100)
      : 0

  const pricing = MODEL_PRICING.find((p) => p.model === profile.model)
  const dollarSaved = pricing
    ? (result.tokensSaved / 1_000_000) * pricing.inputPricePerMillionTokens
    : 0

  const isEstimate = profile.tokenizerBackend !== "tiktoken-gpt4o"

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      {/* Token savings banner */}
      {result.tokensSaved > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
          <TrendingDown className="h-4 w-4 text-emerald-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-emerald-700">
              {result.tokensSaved.toLocaleString()} tokens saved
            </span>
            <span className="text-xs text-emerald-600 ml-1.5">({savingsPct}% less noise)</span>
          </div>
          {dollarSaved > 0 && (
            <span className="text-xs font-medium text-emerald-600 shrink-0">
              ~${dollarSaved.toFixed(4)} per call
            </span>
          )}
        </div>
      )}

      {/* Context window usage */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Context window usage</span>
          <div className="flex items-center gap-2">
            {isExceeded && (
              <Badge variant="destructive" className="text-xs gap-1">
                <AlertTriangle className="h-3 w-3" /> Exceeds limit
              </Badge>
            )}
            {isWarning && !isExceeded && (
              <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                Approaching limit
              </Badge>
            )}
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                isExceeded ? "text-red-600" : isWarning ? "text-amber-600" : "text-zinc-800"
              )}
            >
              {isEstimate ? "~" : ""}
              {result.tokenCount.toLocaleString()}
              <span className="text-xs font-normal text-zinc-400 ml-0.5">
                / {(profile.contextWindow / 1000).toFixed(0)}K
              </span>
            </span>
          </div>
        </div>
        <Progress
          value={pct}
          className={cn(
            "h-2",
            isExceeded ? "[&>div]:bg-red-500" : isWarning ? "[&>div]:bg-amber-400" : ""
          )}
        />
        <div className="flex justify-between text-xs text-zinc-400">
          <span>
            Raw:{" "}
            <span className="font-medium text-zinc-500">
              ~{result.rawTokenEstimate.toLocaleString()}
            </span>
          </span>
          <span>
            Optimized:{" "}
            <span className="font-medium text-zinc-500">
              {isEstimate ? "~" : ""}
              {result.tokenCount.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
