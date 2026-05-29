"use client"

import type { ConversionResult, LLMProfile } from "@/types"
import { MODEL_PRICING } from "@/types"
import { TrendingDown, DollarSign } from "lucide-react"

interface Props {
  result: ConversionResult
  profile: LLMProfile
}

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K"
  return n.toLocaleString()
}

export function TokenSavingsVisual({ result, profile }: Props) {
  const { fileTokenEstimate, tokenCount, tokensSaved } = result
  const savingsPct = fileTokenEstimate > 0
    ? Math.round((tokensSaved / fileTokenEstimate) * 100)
    : 0
  const optimizedBarPct = fileTokenEstimate > 0
    ? Math.max(Math.round((tokenCount / fileTokenEstimate) * 100), 3)
    : 100

  const pricing = MODEL_PRICING.find((p) => p.model === profile.model)
  const costSaved = pricing ? (tokensSaved / 1_000_000) * pricing.inputPricePerMillionTokens : 0
  const costWithout = pricing ? (fileTokenEstimate / 1_000_000) * pricing.inputPricePerMillionTokens : 0
  const costWith = pricing ? (tokenCount / 1_000_000) * pricing.inputPricePerMillionTokens : 0

  const isEstimate = profile.tokenizerBackend !== "tiktoken-gpt4o"
  const p = isEstimate ? "~" : ""

  // Context window
  const ctxWithout = Math.round((fileTokenEstimate / profile.contextWindow) * 100)
  const ctxWith = Math.round((tokenCount / profile.contextWindow) * 100)
  const ctxColor = result.contextWindowPercent >= 1
    ? "bg-red-500"
    : result.contextWindowPercent >= profile.warningThreshold
    ? "bg-amber-400"
    : "bg-blue-500"

  return (
    <div className="flex flex-col gap-0 rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Savings headline */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ background: savingsPct >= 20 ? "#f0fdf4" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
      >
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4" style={{ color: savingsPct >= 20 ? "#16a34a" : "#64748b" }} />
          <span className="text-[12px] font-semibold uppercase tracking-widest font-mono"
            style={{ color: savingsPct >= 20 ? "#16a34a" : "#64748b" }}>
            token savings
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[28px] font-bold tracking-[-0.04em] leading-none"
            style={{ color: savingsPct >= 20 ? "#16a34a" : "#475569" }}>
            -{savingsPct}%
          </span>
          <span className="text-[11px] font-mono text-slate-400">vs raw file</span>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Before / After bars */}
        <div className="flex flex-col gap-3">
          {/* Without SuperMD */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Without SuperMD
              </span>
              <span className="text-[12px] font-semibold tabular-nums text-slate-500">
                {p}{fmt(fileTokenEstimate)} tok
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-full rounded-full bg-slate-300" />
            </div>
          </div>

          {/* With SuperMD */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                With SuperMD ({profile.name})
              </span>
              <span className="text-[12px] font-semibold tabular-nums text-blue-600">
                {p}{fmt(tokenCount)} tok
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-700"
                style={{ width: `${optimizedBarPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tokens removed stat */}
        <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Tokens removed</p>
            <p className="text-[18px] font-bold tracking-[-0.03em] text-slate-800 leading-tight">
              {p}{fmt(tokensSaved)}
            </p>
          </div>
          {costSaved > 0 && (
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Cost per call</p>
              <div className="flex items-center gap-0.5 justify-end">
                <DollarSign className="h-3 w-3 text-emerald-600" />
                <p className="text-[16px] font-bold tracking-[-0.03em] leading-tight text-emerald-700">
                  {costWith < 0.0001 ? "<0.0001" : costWith.toFixed(4)}
                </p>
                <span className="text-[10px] text-slate-400 ml-1 font-mono line-through">
                  {costWithout.toFixed(4)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Context window */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              {profile.name} context window ({(profile.contextWindow / 1000).toFixed(0)}K)
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 line-through tabular-nums">{ctxWithout}%</span>
              <span className="text-[11px] font-semibold tabular-nums text-blue-600">{ctxWith}%</span>
            </div>
          </div>
          <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            {/* Without SuperMD ghost bar */}
            <div
              className="absolute h-full rounded-full bg-slate-200 transition-all duration-700"
              style={{ width: `${Math.min(ctxWithout, 100)}%` }}
            />
            {/* With SuperMD bar */}
            <div
              className={`absolute h-full rounded-full transition-all duration-700 ${ctxColor}`}
              style={{ width: `${Math.min(ctxWith, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>without supermd: {ctxWithout}%</span>
            <span className="text-blue-500 font-medium">with supermd: {ctxWith}%</span>
          </div>
          {result.contextWindowPercent >= 1 && (
            <p className="text-[11px] text-red-500 font-medium">
              Exceeds {profile.name}&apos;s context window — enable chunking to split.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
