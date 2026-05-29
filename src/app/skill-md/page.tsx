"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Wrench, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateSkillMd, toSlug } from "@/lib/generators/skill-md"

export default function SkillMdPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [trigger, setTrigger] = useState("")
  const [steps, setSteps] = useState(["", "", ""])
  const [example, setExample] = useState("")
  const [args, setArgs] = useState("")

  const slug = toSlug(name) || "my-skill"
  const filename = `${slug}.md`

  const hasContent = name.trim() || description.trim() || steps.some((s) => s.trim())

  const output = useMemo(() => {
    if (!hasContent) return ""
    return generateSkillMd({ name, description, trigger, steps, example, args })
  }, [name, description, trigger, steps, example, args, hasContent])

  function addStep() { setSteps((s) => [...s, ""]) }
  function removeStep(i: number) { setSteps((s) => s.filter((_, idx) => idx !== i)) }
  function updateStep(i: number, val: string) {
    setSteps((s) => { const n = [...s]; n[i] = val; return n })
  }

  const labelClass = "label-mono mb-1.5 block"
  const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700 placeholder:text-slate-300"

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      <div className="dot-grid dot-grid-fade pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.35 }} />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10" style={{ background: "linear-gradient(90deg, transparent 0%, #2563eb60 30%, #2563eb90 50%, #2563eb60 70%, transparent 100%)" }} />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto flex items-center gap-3 px-6 h-14">
          <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-6 w-6 rounded-md flex items-center justify-center" style={{ background: "#eff6ff" }}>
            <Wrench className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">skill.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// skill.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Build Claude Code skill files.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Fill the form. Get a <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">skill.md</code> ready to drop into <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">~/.claude/skills/</code>. Preview updates live as you type.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8">
          {/* Left — form */}
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Skill name</label>
                <Input
                  placeholder="deploy-preview"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-mono"
                />
                {name && <p className="mt-1 text-[10px] text-slate-400 font-mono">→ {slug}.md</p>}
              </div>
              <div>
                <label className={labelClass}>One-line description</label>
                <Input
                  placeholder="Deploy a preview to Vercel"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>When to trigger</label>
              <textarea
                className={inputClass}
                rows={2}
                placeholder="When the user asks to deploy, ship, or preview the current branch..."
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ marginBottom: 0 }}>Steps</label>
                <button onClick={addStep} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add step
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono w-4 shrink-0">{i + 1}.</span>
                    <Input
                      placeholder={`Step ${i + 1}`}
                      value={step}
                      onChange={(e) => updateStep(i, e.target.value)}
                      className="flex-1"
                    />
                    {steps.length > 1 && (
                      <button onClick={() => removeStep(i)} className="text-slate-300 hover:text-slate-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Arguments <span className="text-slate-300 normal-case font-sans font-normal">(optional — how $ARGUMENTS is used)</span></label>
              <Input
                placeholder="The branch name or PR number to deploy"
                value={args}
                onChange={(e) => setArgs(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Example <span className="text-slate-300 normal-case font-sans font-normal">(optional)</span></label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="/deploy feat/new-checkout"
                value={example}
                onChange={(e) => setExample(e.target.value)}
              />
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] text-blue-700 leading-relaxed">
              Download and save to <code className="bg-blue-100 px-1 rounded font-mono">~/.claude/skills/{filename}</code> — Claude Code picks it up automatically on next launch.
            </div>
          </div>

          {/* Right — live preview */}
          <div>
            {hasContent ? (
              <OutputCard content={output} filename={filename} label={`skill: ${slug}`} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[300px] flex items-center justify-center">
                <p className="text-[13px] text-slate-400 font-mono">Preview updates as you type</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
