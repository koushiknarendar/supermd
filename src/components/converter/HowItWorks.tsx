"use client"

import { Upload, Sliders, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ConversionStatus } from "@/types"

const STEPS = [
  {
    n: "01",
    icon: Upload,
    title: "Drop your file",
    desc: "PDF, DOCX, XLSX, or image. Up to 5 MB. Processed entirely in your browser.",
  },
  {
    n: "02",
    icon: Sliders,
    title: "Pick your model",
    desc: "Claude, GPT-4o, or Gemini. Each gets a different format tuned to how it reads.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Get clean markdown",
    desc: "See tokens saved, copy to clipboard, or download the .md file — ready to paste.",
  },
]

const stepForStatus: Record<ConversionStatus, number> = {
  idle: 0,
  converting: 1,
  profiling: 1,
  done: 2,
  error: 0,
}

interface Props {
  status: ConversionStatus
}

export function HowItWorks({ status }: Props) {
  const activeStep = stepForStatus[status]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const isActive = i === activeStep
        const isDone = i < activeStep

        return (
          <div
            key={step.n}
            className={cn(
              "flex flex-col gap-3 p-5 transition-colors border-b sm:border-b-0 last:border-b-0 sm:border-r sm:last:border-r-0 border-slate-200",
              isActive && "bg-blue-50",
              isDone && "bg-slate-50"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex items-center justify-center h-7 w-7 rounded-lg transition-colors",
                  isActive ? "bg-blue-600 text-white" : isDone ? "bg-slate-200 text-slate-500" : "bg-slate-100 text-slate-400"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span
                className={cn(
                  "font-mono text-[10px] font-semibold tracking-widest uppercase",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              >
                {step.n}
              </span>
              {isDone && (
                <span className="ml-auto text-[10px] font-mono text-slate-400 uppercase tracking-wider">done</span>
              )}
              {isActive && (
                <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-blue-500 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  now
                </span>
              )}
            </div>
            <div>
              <p className={cn("text-[13px] font-semibold tracking-[-0.01em]", isActive ? "text-blue-900" : "text-slate-600")}>
                {step.title}
              </p>
              <p className={cn("mt-0.5 text-[12px] leading-[1.6]", isActive ? "text-blue-700" : "text-slate-400")}>
                {step.desc}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
