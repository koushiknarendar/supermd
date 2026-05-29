"use client"

import type { ConversionResult, LLMProfile } from "@/types"
import { MODEL_PRICING } from "@/types"
import { TrendingDown, DollarSign } from "lucide-react"

interface Props {
  result: ConversionResult
  profile: LLMProfile
}

export function TokenSavingsVisual({ result, profile }: Props) {
  const { rawTokenEstimate, tokenCount, tokensSaved } = result
  const savingsPct = rawTokenEstimate > 0 ? Math.round((tokensSaved / rawTokenEstimate) * 100) : 0
  const optimizedPct = rawTokenEstimate > 0 ? Math.round((tokenCount / rawTokenEstimate) * 100) : 100

  const pricing = MODEL_PRICING.find((p) => p.model === profile.model)
  const costSaved = pricing ? (tokensSaved / 1_000_000) * pricing.inputPricePerMillionTokens : 0
  const costPer100 = costSaved * 100

  const isEstimate = profile.tokenizerBackend !== "tiktoken-gpt4o"
  const prefix = isEstimate ? "~" : ""

  if (tokensSaved <= 0) return null

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-blue-600" />
        <span className="text-[12px] font-semibold uppercase tracking-widest text-slate-500 font-mono">
          token savings
        </span>
      </div>

      {/* Bar comparison */}
      <div className="flex flex-col gap-2.5">
        {/* Raw bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-slate-400 uppercase tracking-wider">Raw file</span>
            <span className="font-semibold tabular-nums text-slate-500">
              {prefix}{rawTokenEstimate.toLocaleString()} tok
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-full rounded-full bg-slate-300" />
          </div>
        </div>

        {/* Optimized bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-slate-400 uppercase tracking-wider">After SuperMD</span>
            <span className="font-semibold tabular-nums text-blue-600">
              {prefix}{tokenCount.toLocaleString()} tok
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{ width: `${Math.max(optimizedPct, 4)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Savings callout */}
      <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
        <div>
          <p className="text-[22px] font-semibold tracking-[-0.03em] leading-none text-emerald-700">
            -{savingsPct}%
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-600">
            {prefix}{tokensSaved.toLocaleString()} tokens removed
          </p>
        </div>
        {costSaved > 0 && (
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              <p className="text-[18px] font-semibold tracking-[-0.03em] leading-none text-emerald-700">
                {costSaved < 0.001 ? "<$0.001" : `$${costSaved.toFixed(4)}`}
              </p>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-600">
              saved per call
            </p>
            {costPer100 > 0.01 && (
              <p className="mt-0.5 font-mono text-[10px] text-emerald-500">
                ${costPer100.toFixed(2)} per 100 calls
              </p>
            )}
          </div>
        )}
      </div>

      {/* Context window */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-slate-400 uppercase tracking-wider">
            Context window ({profile.name})
          </span>
          <span className={`font-semibold tabular-nums ${result.contextWindowPercent >= 1 ? "text-red-500" : result.contextWindowPercent >= profile.warningThreshold ? "text-amber-500" : "text-slate-500"}`}>
            {Math.min(Math.round(result.contextWindowPercent * 100), 100)}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              result.contextWindowPercent >= 1
                ? "bg-red-500"
                : result.contextWindowPercent >= profile.warningThreshold
                ? "bg-amber-400"
                : "bg-blue-500"
            }`}
            style={{ width: `${Math.min(result.contextWindowPercent * 100, 100)}%` }}
          />
        </div>
        {result.contextWindowPercent >= 1 && (
          <p className="text-[11px] text-red-500 font-medium">
            Exceeds {profile.name}&apos;s context window — enable chunking to split.
          </p>
        )}
      </div>
    </div>
  )
}
