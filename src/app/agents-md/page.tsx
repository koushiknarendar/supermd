"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Network, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { OutputCard } from "@/components/shared/OutputCard"
import { Footer } from "@/components/layout/Footer"
import { generateAgentsMd, type AgentDef } from "@/lib/generators/agents-md"

function emptyAgent(): AgentDef {
  return { name: "", role: "", tools: [""], trigger: "" }
}

export default function AgentsMdPage() {
  const [systemName, setSystemName] = useState("")
  const [systemDescription, setSystemDescription] = useState("")
  const [globalRules, setGlobalRules] = useState(["", ""])
  const [agents, setAgents] = useState<AgentDef[]>([emptyAgent(), emptyAgent()])
  const [handoffLogic, setHandoffLogic] = useState("")

  const hasContent = agents.some((a) => a.name.trim() || a.role.trim())

  const output = useMemo(() => {
    if (!hasContent) return ""
    return generateAgentsMd({ systemName, systemDescription, globalRules, agents, handoffLogic })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemName, systemDescription, globalRules, agents, handoffLogic, hasContent])

  const filename = (systemName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "agents") + ".md"

  // Global rules
  function addRule() { setGlobalRules((r) => [...r, ""]) }
  function removeRule(i: number) { setGlobalRules((r) => r.filter((_, idx) => idx !== i)) }
  function updateRule(i: number, val: string) { setGlobalRules((r) => { const n = [...r]; n[i] = val; return n }) }

  // Agents
  function addAgent() { if (agents.length < 8) setAgents((a) => [...a, emptyAgent()]) }
  function removeAgent(i: number) { setAgents((a) => a.filter((_, idx) => idx !== i)) }
  function updateAgent(i: number, field: keyof AgentDef, val: string) {
    setAgents((a) => { const n = [...a]; n[i] = { ...n[i], [field]: val }; return n })
  }

  // Agent tools
  function addTool(agentIdx: number) {
    setAgents((a) => {
      const n = [...a]
      n[agentIdx] = { ...n[agentIdx], tools: [...n[agentIdx].tools, ""] }
      return n
    })
  }
  function removeTool(agentIdx: number, toolIdx: number) {
    setAgents((a) => {
      const n = [...a]
      n[agentIdx] = { ...n[agentIdx], tools: n[agentIdx].tools.filter((_, i) => i !== toolIdx) }
      return n
    })
  }
  function updateTool(agentIdx: number, toolIdx: number, val: string) {
    setAgents((a) => {
      const n = [...a]
      const tools = [...n[agentIdx].tools]
      tools[toolIdx] = val
      n[agentIdx] = { ...n[agentIdx], tools }
      return n
    })
  }

  const labelClass = "label-mono mb-1.5 block"
  const textareaClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-700 placeholder:text-slate-300"

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
            <Network className="h-3.5 w-3.5" style={{ color: "#2563eb" }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-[-0.02em] text-slate-900">agents.md</span>
            <span className="text-[11px] text-slate-400 font-mono">by SuperMD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="label-mono mb-3">// agents.md</p>
          <h1 className="text-[36px] font-semibold tracking-[-0.04em] leading-[1.1] text-slate-900 max-w-xl">
            Document your multi-agent system.
          </h1>
          <p className="mt-3 text-[15px] text-slate-500 leading-relaxed max-w-2xl font-medium tracking-[-0.01em]">
            Define agent roles, tools, triggers, and handoff rules. Get a structured{" "}
            <code className="text-[13px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">AGENTS.md</code>{" "}
            any agent runtime or LLM can read to understand the system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8">
          {/* Left — form */}
          <div className="flex flex-col gap-6">

            {/* System */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>System name</label>
                  <Input
                    placeholder="Support Triage System"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  {systemName.trim() && (
                    <p className="text-[10px] font-mono text-slate-400 pb-2.5">→ {filename}</p>
                  )}
                </div>
              </div>
              <div>
                <label className={labelClass}>System description <span className="text-slate-300 normal-case font-sans font-normal">(optional)</span></label>
                <textarea
                  className={textareaClass}
                  rows={2}
                  placeholder="A three-agent pipeline that triages customer requests, resolves known issues, and escalates complex cases to a human operator."
                  value={systemDescription}
                  onChange={(e) => setSystemDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Global rules */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ marginBottom: 0 }}>Global rules — apply to all agents</label>
                <button onClick={addRule} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {globalRules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] text-blue-300 font-mono w-4 shrink-0">·</span>
                    <Input
                      placeholder={
                        i === 0 ? "Never make promises about timelines without confirmation" :
                        i === 1 ? "Always cite the source when referencing documentation" :
                        "Rule..."
                      }
                      value={rule}
                      onChange={(e) => updateRule(i, e.target.value)}
                      className="flex-1"
                    />
                    {globalRules.length > 1 && (
                      <button onClick={() => removeRule(i)} className="text-slate-300 hover:text-slate-500">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Agents */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelClass} style={{ marginBottom: 0 }}>Agents <span className="text-slate-300 font-sans font-normal normal-case text-[11px]">({agents.length}/8)</span></label>
                {agents.length < 8 && (
                  <button onClick={addAgent} className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-mono">
                    <Plus className="h-3 w-3" /> Add agent
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-4">
                {agents.map((agent, ai) => (
                  <div key={ai} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Agent {ai + 1}</span>
                      {agents.length > 1 && (
                        <button onClick={() => removeAgent(ai)} className="text-slate-300 hover:text-slate-500">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Name</p>
                        <Input
                          placeholder={ai === 0 ? "Triage Agent" : ai === 1 ? "Resolver Agent" : "Agent name"}
                          value={agent.name}
                          onChange={(e) => updateAgent(ai, "name", e.target.value)}
                          className="text-[13px]"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">When to use</p>
                        <Input
                          placeholder={ai === 0 ? "First contact on every request" : ai === 1 ? "Known issue identified" : "Trigger..."}
                          value={agent.trigger}
                          onChange={(e) => updateAgent(ai, "trigger", e.target.value)}
                          className="text-[13px]"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Role</p>
                      <textarea
                        className={textareaClass}
                        rows={2}
                        placeholder={
                          ai === 0
                            ? "Reads incoming requests, classifies intent, and routes to the appropriate specialist agent."
                            : ai === 1
                            ? "Searches the knowledge base and resolves known issue types without human intervention."
                            : "What this agent does..."
                        }
                        value={agent.role}
                        onChange={(e) => updateAgent(ai, "role", e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Tools</p>
                        <button onClick={() => addTool(ai)} className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 font-mono">
                          <Plus className="h-2.5 w-2.5" /> tool
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {agent.tools.map((tool, ti) => (
                          <div key={ti} className="flex items-center gap-1">
                            <input
                              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-200 w-28"
                              placeholder={ti === 0 ? "search_kb" : ti === 1 ? "send_email" : "tool_name"}
                              value={tool}
                              onChange={(e) => updateTool(ai, ti, e.target.value)}
                            />
                            {agent.tools.length > 1 && (
                              <button onClick={() => removeTool(ai, ti)} className="text-slate-300 hover:text-slate-500">
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Handoff logic */}
            <div>
              <label className={labelClass}>Handoff logic <span className="text-slate-300 normal-case font-sans font-normal">(optional)</span></label>
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="Triage Agent always runs first. If confidence < 0.8, hand off to Escalation Agent. Resolver Agent hands back to Triage on failure. Never hand off mid-conversation without notifying the user."
                value={handoffLogic}
                onChange={(e) => setHandoffLogic(e.target.value)}
              />
            </div>

          </div>

          {/* Right — output */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-mono">Output</span>
              {hasContent && <span className="text-[11px] font-mono text-slate-400">{agents.filter(a => a.name.trim() || a.role.trim()).length} agent{agents.filter(a => a.name.trim() || a.role.trim()).length !== 1 ? "s" : ""} defined</span>}
            </div>
            {hasContent ? (
              <OutputCard content={output} filename={filename} label={filename} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-[420px] flex flex-col items-center justify-center gap-2">
                <p className="text-[13px] text-slate-400 font-mono">Preview updates as you type</p>
                <p className="text-[11px] text-slate-300">Fill in at least one agent name or role</p>
              </div>
            )}
            {hasContent && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] text-blue-700 leading-relaxed">
                Save as <code className="bg-blue-100 px-1 rounded font-mono">AGENTS.md</code> in your project root.
                Agent runtimes and LLMs read this file to understand the system structure before executing.
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-20 flex flex-col gap-16">

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// what is agents.md</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-4">
                  The context file for multi-agent systems.
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  As AI systems grow from single models to multi-agent pipelines — with specialized agents, tool calls, and handoff logic — the complexity of keeping every agent oriented grows too. <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[12px]">AGENTS.md</code> is the document that describes the system to every agent in it.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                  It captures what each agent is responsible for, which tools it can call, when to hand off to another agent, and the global rules that apply regardless of which agent is executing. Think of it as the org chart and operating manual for your AI pipeline — in a single readable file.
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Agent runtimes like Claude Code, OpenAI Agents SDK, and LangGraph can load this file as context at the start of every session, keeping all agents aligned with the same operating rules.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                  <span className="font-mono text-[11px] text-slate-500">AGENTS.md</span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-600 leading-relaxed bg-white overflow-x-auto">{`# AGENTS.md — Support Triage System

> A three-agent pipeline that triages requests,
  resolves known issues, and escalates complex cases.

## Global Rules

- Never make promises about timelines without confirmation
- Always cite the source when referencing documentation

## Agents

### Triage Agent

Reads incoming requests, classifies intent,
and routes to the appropriate specialist agent.

**Tools:** \`classify_intent\`, \`search_kb\`

**When to use:** First contact on every request

---

### Resolver Agent

Searches the knowledge base and resolves known
issue types without human intervention.

**Tools:** \`search_kb\`, \`create_ticket\`, \`send_email\`

**When to use:** Known issue identified

## Handoff Logic

Triage Agent always runs first. If confidence < 0.8,
hand off to Escalation Agent.`}</pre>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-12">
            <p className="label-mono mb-4">// use cases</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 mb-8">
              When do you need an AGENTS.md?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: "Customer support pipelines", desc: "A triage agent routes to specialists; specialists resolve or escalate. Without a shared context file, each agent runs blind to what the others can do.", example: "Triage → Billing / Tech Support → Escalation" },
                { title: "Coding agent fleets", desc: "Orchestrator assigns tasks to specialized subagents (code, test, review). AGENTS.md defines the division of labour and prevents agents from stepping on each other.", example: "Planner → Coder → Reviewer → Deployer" },
                { title: "Research pipelines", desc: "One agent searches, another summarizes, another fact-checks, another formats. Roles and tool access need to be explicit so each agent stays in its lane.", example: "Search → Summarize → Verify → Report" },
                { title: "Automated ops systems", desc: "Alert triage, runbook execution, and escalation to on-call — each step handled by a different agent with a different tool set. AGENTS.md is the playbook.", example: "Alert → Diagnose → Remediate → Notify" },
              ].map((u) => (
                <div key={u.title} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-5">
                  <h3 className="text-[14px] font-semibold text-slate-800 tracking-[-0.01em]">{u.title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{u.desc}</p>
                  <code className="text-[11px] font-mono text-blue-500 bg-blue-50 px-2.5 py-1.5 rounded-lg">{u.example}</code>
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
                { q: "Is AGENTS.md a standard format?", a: "Not yet — there's no universal spec. The format generated here is designed to be readable by any LLM and loadable by any agent runtime that accepts markdown context files. It mirrors conventions emerging in Claude Code, OpenAI Agents SDK, and LangGraph documentation." },
                { q: "How is this different from a system prompt?", a: "A system prompt defines one agent's behavior. AGENTS.md describes a system of agents — their relationships, tools, and handoff rules. You'd typically reference AGENTS.md from each agent's system prompt, or load it as a shared context object at orchestration time." },
                { q: "Where do I put the file?", a: "In your project root as AGENTS.md — same location as CLAUDE.md or README.md. Some runtimes (like Claude Code) auto-load this file as context. Others require you to pass it explicitly as part of the system prompt or context window." },
                { q: "How many agents is too many?", a: "Practically, keep it under 8 agents in a single AGENTS.md. Beyond that, the file becomes hard for the orchestrator to reason about in context. For larger systems, consider splitting into subsystem files and referencing them." },
                { q: "Should tools be function names or descriptions?", a: "Use the exact function/tool names from your implementation. If your code exposes `search_knowledge_base`, write that — not 'search tool' or 'KB lookup'. The exact name is what the agent needs to call the tool correctly." },
                { q: "Do I need handoff logic if I only have two agents?", a: "For two agents, the handoff is usually obvious and doesn't need documentation. The Handoff Logic section becomes essential at 3+ agents — especially when multiple agents can receive the same type of input and you need deterministic routing rules." },
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
