"use client"

import type { ConversionResult, LLMProfile } from "@/types"
import { MODEL_PRICING } from "@/types"
import { TrendingDown, DollarSign, Info } from "lucide-react"

interface Props {
  result: ConversionResult
  profile: LLMProfile
}

export function TokenSavingsVisual({ result, profile }: Props) {
  const { rawTokenEstimate, tokenCount, tokensSaved } = result
  const hasSavings = tokensSaved > 0
  const savingsPct = rawTokenEstimate > 0 && hasSavings
    ? Math.round((tokensSaved / rawTokenEstimate) * 100)
    : 0
  // Bar width: optimized as % of raw (capped at 100%)
  const optimizedBarPct = rawTokenEstimate > 0
    ? Math.min(Math.round((tokenCount / rawTokenEstimate) * 100), 100)
    : 100

  const pricing = MODEL_PRICING.find((p) => p.model === profile.model)
  const costSaved = hasSavings && pricing
    ? (tokensSaved / 1_000_000) * pricing.inputPricePerMillionTokens
    : 0
  const costPer100 = costSaved * 100

  const isEstimate = profile.tokenizerBackend !== "tiktoken-gpt4o"
  const prefix = isEstimate ? "~" : ""

  const ctxPct = result.contextWindowPercent
  const ctxColor = ctxPct >= 1 ? "bg-red-500" : ctxPct >= profile.warningThreshold ? "bg-amber-400" : "bg-blue-500"
  const ctxTextColor = ctxPct >= 1 ? "text-red-500" : ctxPct >= profile.warningThreshold ? "text-amber-500" : "text-slate-500"

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-blue-600" />
        <span className="text-[12px] font-semibold uppercase tracking-widest text-slate-500 font-mono">
          token analysis
        </span>
      </div>

      {/* Bar comparison */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-slate-400 uppercase tracking-wider">Before profile</span>
            <span className="font-semibold tabular-nums text-slate-500">
              {prefix}{rawTokenEstimate.toLocaleString()} tok
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-full rounded-full bg-slate-300" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-slate-400 uppercase tracking-wider">
              After {profile.name} profile
            </span>
            <span className={`font-semibold tabular-nums ${hasSavings ? "text-blue-600" : "text-slate-500"}`}>
              {prefix}{tokenCount.toLocaleString()} tok
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${hasSavings ? "bg-blue-500" : "bg-slate-400"}`}
              style={{ width: `${Math.max(optimizedBarPct, 4)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Savings callout or info note */}
      {hasSavings ? (
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
                  ${costPer100.toFixed(2)} / 100 calls
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
          <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-blue-700 leading-relaxed">
            The {profile.name} profile adds structural tags that improve comprehension. Net token
            cost is similar to the raw input.
          </p>
        </div>
      )}

      {/* Context window */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-slate-400 uppercase tracking-wider">
            {profile.name} context window
          </span>
          <span className={`font-semibold tabular-nums ${ctxTextColor}`}>
            {Math.min(Math.round(ctxPct * 100), 100)}%
            <span className="text-slate-400 font-normal ml-1">
              of {(profile.contextWindow / 1000).toFixed(0)}K
            </span>
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${ctxColor}`}
            style={{ width: `${Math.min(ctxPct * 100, 100)}%` }}
          />
        </div>
        {ctxPct >= 1 && (
          <p className="text-[11px] text-red-500 font-medium">
            Exceeds {profile.name}&apos;s context window — enable chunking to split.
          </p>
        )}
      </div>
    </div>
  )
}
