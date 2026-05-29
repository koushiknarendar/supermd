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
  const savingsPctRaw = fileTokenEstimate > 0
    ? Math.round((tokensSaved / fileTokenEstimate) * 100)
    : 0
  const savingsPct = savingsPctRaw

  const pricing = MODEL_PRICING.find((p) => p.model === profile.model)
  const costSaved = pricing ? (tokensSaved / 1_000_000) * pricing.inputPricePerMillionTokens : 0

  const isEstimate = profile.tokenizerBackend !== "tiktoken-gpt4o"
  const p = isEstimate ? "~" : ""

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-slate-200">
        {/* Token savings */}
        <div className="flex flex-col gap-1 px-5 py-4">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Tokens saved
            </span>
          </div>
          <p className="text-[32px] font-bold tracking-[-0.04em] leading-none text-emerald-600">
            {savingsPct < 1 ? "<1" : `-${savingsPct}`}%
          </p>
          <p className="font-mono text-[10px] text-slate-400">
            {p}{fmt(tokensSaved)} of {p}{fmt(fileTokenEstimate)} tok
          </p>
        </div>

        {/* Cost saved */}
        <div className="flex flex-col gap-1 px-5 py-4">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Saved per call
            </span>
          </div>
          <p className="text-[32px] font-bold tracking-[-0.04em] leading-none text-blue-600">
            {costSaved < 0.0001
              ? "<$0.001"
              : costSaved < 0.01
              ? `$${costSaved.toFixed(4)}`
              : `$${costSaved.toFixed(3)}`}
          </p>
          <p className="font-mono text-[10px] text-slate-400">
            at {pricing?.label ?? profile.name} pricing
          </p>
        </div>
      </div>
    </div>
  )
}
