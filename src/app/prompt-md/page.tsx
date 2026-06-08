"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Plus, X, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import {
  generatePromptMd,
  type PromptTarget,
  type PromptFormData,
  type ExamplePair,
} from "@/lib/generators/prompt-md"

const TARGETS: { id: PromptTarget; label: string; note: string }[] = [
  { id: "claude", label: "Claude", note: "XML tags" },
  { id: "gpt", label: "GPT / Gemini", note: "Markdown" },
  { id: "universal", label: "Universal", note: "Plain text" },
]

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "technical", label: "Technical" },
  { value: "concise", label: "Concise" },
  { value: "empathetic", label: "Empathetic" },
]

const LENGTH_OPTIONS = [
  { value: "brief", label: "Brief (< 150 words)" },
  { value: "standard", label: "Standard (match complexity)" },
  { value: "detailed", label: "Detailed (thorough)" },
  { value: "adaptive", label: "Adaptive (match the ask)" },
]

const FORMAT_OPTIONS = [
  { value: "mixed", label: "Mixed (prose + bullets)" },
  { value: "prose", label: "Prose paragraphs" },
  { value: "bullets", label: "Bullet points" },
  { value: "numbered", label: "Numbered lists" },
]

export default function PromptMdPage() {
  const [role, setRole] = useState("")
  const [task, setTask] = useState("")
  const [context, setContext] = useState("")
  const [constraints, setConstraints] = useState(["", ""])
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("standard")
  const [format, setFormat] = useState("mixed")
  const [formatExtra, setFormatExtra] = useState("")
  const [examples, setExamples] = useState<ExamplePair[]>([{ input: "", output: "" }])
  const [showExamples, setShowExamples] = useState(false)
  const [activeTarget, setActiveTarget] = useState<PromptTarget>("claude")

  const hasContent = !!(role.trim() || task.trim())

  const formData: PromptFormData = {
    role, task, context, constraints, tone, length, format, formatExtra, examples,
  }

  const outputs = useMemo(() => {
    if (!hasContent) return null
    return {
      claude: generatePromptMd(formData, "claude"),
      gpt: generatePromptMd(formData, "gpt"),
      universal: generatePromptMd(formData, "universal"),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, task, context, constraints, tone, length, format, formatExtra, examples, hasContent])

  function addConstraint() { setConstraints((s) => [...s, ""]) }
  function removeConstraint(i: number) { setConstraints((s) => s.filter((_, idx) => idx !== i)) }
  function updateConstraint(i: number, val: string) {
    setConstraints((s) => { const n = [...s]; n[i] = val; return n })
  }

  function addExample() { setExamples((s) => [...s, { input: "", output: "" }]) }
  function removeExample(i: number) { setExamples((s) => s.filter((_, idx) => idx !== i)) }
  function updateExample(i: number, field: keyof ExamplePair, val: string) {
    setExamples((s) => { const n = [...s]; n[i] = { ...n[i], [field]: val }; return n })
  }

  const labelClass = "label-mono mb-1.5 block"
  const textareaClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700 placeholder:text-slate-300"
  const selectClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-700"

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
            <MessageSquare className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">prompt.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// prompt.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Build system prompts that actually work.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Fill the form. Get a structured system prompt formatted for Claude, GPT-4o, or Gemini — with the right structure for each model&apos;s preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8">
          {/* Left — form */}
          <div className="flex flex-col gap-5">

            {/* Role */}
            <div>
              <label className={labelClass}>Role <span className="text-red-400">*</span></label>
              <Input
                placeholder="expert customer support agent for Acme Corp, a B2B SaaS company"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              {role.trim() && !role.trim().toLowerCase().startsWith("you are") && (
                <p className="mt-1 text-[10px] text-slate-400 font-mono">→ You are {role.trim()}.</p>
              )}
            </div>

            {/* Task */}
            <div>
              <label className={labelClass}>Task / Goal <span className="text-red-400">*</span></label>
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="Answer user questions about the platform. Help with troubleshooting, feature explanations, and billing inquiries."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            {/* Context */}
            <div>
              <label className={labelClass}>Context <span className="text-slate-300 normal-case font-sans font-normal">(optional)</span></label>
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="Users may range from technical developers to non-technical executives. The platform is a project management tool used by teams of 5–500 people."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            {/* Constraints */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ marginBottom: 0 }}>Constraints — never do</label>
                <button onClick={addConstraint} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {constraints.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] text-red-300 font-mono w-4 shrink-0">−</span>
                    <Input
                      placeholder={
                        i === 0 ? "Promise features that don't exist" :
                        i === 1 ? "Share pricing without routing to sales" :
                        "Constraint..."
                      }
                      value={c}
                      onChange={(e) => updateConstraint(i, e.target.value)}
                      className="flex-1"
                    />
                    {constraints.length > 1 && (
                      <button onClick={() => removeConstraint(i)} className="text-slate-300 hover:text-slate-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Output format */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <label className={labelClass} style={{ marginBottom: 0 }}>Output format</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Tone</p>
                  <select className={selectClass} value={tone} onChange={(e) => setTone(e.target.value)}>
                    {TONE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Length</p>
                  <select className={selectClass} value={length} onChange={(e) => setLength(e.target.value)}>
                    {LENGTH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Format</p>
                  <select className={selectClass} value={format} onChange={(e) => setFormat(e.target.value)}>
                    {FORMAT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Input
                  placeholder="Custom format note — e.g. Always end with a follow-up question"
                  value={formatExtra}
                  onChange={(e) => setFormatExtra(e.target.value)}
                  className="text-[13px]"
                />
              </div>
            </div>

            {/* Examples (collapsible) */}
            <div className="rounded-xl border border-slate-100">
              <button
                onClick={() => setShowExamples((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="label-mono" style={{ marginBottom: 0 }}>Few-shot examples</span>
                  <span className="text-[11px] text-slate-400 font-sans font-normal normal-case">(optional — improves accuracy)</span>
                </span>
                {showExamples ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>

              {showExamples && (
                <div className="border-t border-slate-100 px-4 pb-4 flex flex-col gap-4 pt-4">
                  {examples.map((ex, i) => (
                    <div key={i} className="flex flex-col gap-2 rounded-lg border border-slate-100 p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Example {i + 1}</span>
                        {examples.length > 1 && (
                          <button onClick={() => removeExample(i)} className="text-slate-300 hover:text-slate-500">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <textarea
                        className={textareaClass}
                        rows={2}
                        placeholder="User input..."
                        value={ex.input}
                        onChange={(e) => updateExample(i, "input", e.target.value)}
                      />
                      <textarea
                        className={textareaClass}
                        rows={2}
                        placeholder="Ideal assistant response..."
                        value={ex.output}
                        onChange={(e) => updateExample(i, "output", e.target.value)}
                      />
                    </div>
                  ))}
                  {examples.length < 4 && (
                    <button onClick={addExample} className="self-start flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                      <Plus className="h-3 w-3" /> Add example
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right — output */}
          <div className="flex flex-col gap-3">
            <Tabs value={activeTarget} onValueChange={(v) => setActiveTarget(v as PromptTarget)}>
              <TabsList className="w-full">
                {TARGETS.map((t) => (
                  <TabsTrigger key={t.id} value={t.id} className="flex-1 font-mono text-[12px]">
                    {t.label}
                    <span className="ml-1.5 text-slate-400 text-[10px]">{t.note}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {hasContent && outputs ? (
              <>
                <OutputCard
                  content={outputs[activeTarget]}
                  filename="system-prompt.md"
                  label="system-prompt.md"
                />
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] text-blue-700 leading-relaxed flex flex-col gap-1">
                  <p><strong className="font-semibold">Claude:</strong> Paste into the &ldquo;System&rdquo; field in Claude.ai or pass as <code className="bg-blue-100 px-1 rounded font-mono">system</code> in the API.</p>
                  <p><strong className="font-semibold">GPT / Gemini:</strong> Paste as the system message in the API or the &ldquo;Custom instructions&rdquo; in ChatGPT / Gemini.</p>
                  <p><strong className="font-semibold">Universal:</strong> Works in any LLM interface — just paste at the top of your first message if there&apos;s no system field.</p>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[420px] flex flex-col items-center justify-center gap-2">
                <p className="text-[13px] text-slate-400 font-mono">Preview updates as you type</p>
                <p className="text-[11px] text-slate-300">At minimum, fill in Role or Task</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// why structure matters</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  A system prompt is your contract with the model.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  The system prompt is the single most impactful thing you control when working with an LLM. It sets the role, the constraints, the output style, and the persona — before the user types a single word. A well-structured prompt means fewer corrections, more consistent outputs, and less token waste repeating yourself in every message.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  Different models parse different formats best. Claude performs well with XML tags — it was trained to process them as structured instructions. GPT-4o and Gemini respond best to clear markdown headers. The Universal format works everywhere when you&apos;re not sure which model you&apos;re targeting.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Few-shot examples are the highest-leverage addition you can make to a system prompt — they show the model exactly what &ldquo;good&rdquo; looks like, faster than any instruction.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                  <span className="font-mono text-[11px] text-slate-500">Claude — system-prompt.md</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-600 leading-relaxed bg-white overflow-x-auto">{`<role>
You are an expert customer support agent
for Acme Corp, a B2B SaaS company.
</role>

<context>
Users range from technical developers to
non-technical executives.
</context>

<task>
Answer platform questions. Help with
troubleshooting, feature explanations,
and billing inquiries.
</task>

<constraints>
- Never promise unbuilt features
- Route pricing questions to sales
</constraints>

<output_format>
- Write in a professional, authoritative tone.
- Match response length to question complexity.
- Use the format that best fits the content.
</output_format>`}</pre>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// what each section does</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              The anatomy of a good system prompt.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { section: "Role", desc: "Sets the persona. The model behaves differently as 'expert engineer' vs 'friendly assistant' vs 'strict editor' — even with identical instructions. Pick the role that matches the outputs you want.", required: true },
                { section: "Task", desc: "The primary objective. What should the model do on every turn? Be specific — 'answer questions' is weaker than 'answer questions about X, escalate Y, refuse Z'.", required: true },
                { section: "Context", desc: "Background knowledge the model needs to do the job well — who the users are, what the product does, domain-specific facts. Without context, the model guesses.", required: false },
                { section: "Constraints", desc: "What to never do. Explicit prohibitions are more reliable than implied ones. If there's something the model should always avoid, name it directly here.", required: false },
                { section: "Output Format", desc: "Tone, length, and structure. Setting these in the system prompt prevents you from repeating 'be concise' or 'use bullet points' in every message.", required: false },
                { section: "Examples", desc: "Few-shot examples are the highest-leverage addition. One good example is worth 10 lines of instructions — it shows the model exactly what 'good' looks like.", required: false },
              ].map((item) => (
                <div key={item.section} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-slate-800 tracking-[-0.01em]">{item.section}</h3>
                    {item.required
                      ? <span className="text-[10px] font-mono text-red-400 bg-red-50 px-1.5 py-0.5 rounded">required</span>
                      : <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">optional</span>
                    }
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12 pb-4">
            <p className="label-mono mb-4">// faq</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              Frequently asked questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { q: "Why does format differ by model?", a: "Claude was trained with XML tag structure in its training data — it parses <role> and <task> tags as structured instructions more reliably than markdown. GPT-4o and Gemini respond well to markdown headers. Universal is plain text that works everywhere but is less structured." },
                { q: "How long should a system prompt be?", a: "Aim for 200–800 tokens. Short enough that the model reads all of it carefully; long enough to cover role, constraints, and format. Each added token increases processing cost — keep it tight and cut anything the model doesn't need." },
                { q: "Should I include few-shot examples?", a: "Yes, when you can. One clear input-output example teaches the model more about what you want than several lines of instructions. Three examples is usually the sweet spot — enough to show patterns without overloading the context." },
                { q: "Where do I paste the system prompt?", a: "Claude: Settings > System Prompt in Claude.ai, or the 'system' field in the API. GPT: Custom Instructions in ChatGPT, or 'system' in the API. Gemini: System Instructions in AI Studio, or the API. Universal: paste at the top of your first user message in any interface." },
                { q: "How often should I update my system prompt?", a: "Treat it like code — update it when behavior diverges from what you expect, when the task scope changes, or when you notice the model consistently getting something wrong. Version-control it alongside your codebase." },
                { q: "Can I use this for agents?", a: "Yes. Agent system prompts follow the same structure but typically add a 'Tools' section (what the agent can call) and explicit state-handling rules. Use the constraints section to define what the agent should always escalate or refuse." },
              ].map((item) => (
                <div key={item.q}>
                  <h3 className="text-[14px] font-semibold text-slate-800 mb-2 tracking-[-0.01em]">{item.q}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
