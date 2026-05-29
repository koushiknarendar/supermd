"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { LLMProfile } from "@/types"
import { ALL_PROFILES } from "@/lib/profiles"
import { Sparkles } from "lucide-react"

const MODEL_ICONS: Record<string, string> = {
  claude: "🟣",
  gpt4o: "🟢",
  gemini: "🔵",
  raw: "⚪",
}

interface Props {
  activeProfile: LLMProfile
  onChange: (profile: LLMProfile) => void
}

export function ProfileSelector({ activeProfile, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Output profile
        </span>
      </div>
      <Tabs
        value={activeProfile.id}
        onValueChange={(id) => {
          const p = ALL_PROFILES.find((p) => p.id === id)
          if (p) onChange(p)
        }}
      >
        <TabsList className="grid grid-cols-4 w-full">
          {ALL_PROFILES.map((profile) => (
            <TabsTrigger key={profile.id} value={profile.id} className="gap-1.5">
              <span>{MODEL_ICONS[profile.model]}</span>
              <span>{profile.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="text-xs text-zinc-400">{profileDescription(activeProfile)}</p>
    </div>
  )
}

function profileDescription(profile: LLMProfile): string {
  switch (profile.model) {
    case "claude":
      return "XML-structured output with <document> tags — optimized for Claude's 200K context."
    case "gpt4o":
      return "Standard markdown with YAML frontmatter — optimized for GPT-4o's 128K context."
    case "gemini":
      return "Clean prose markdown — optimized for Gemini's 1M context window."
    case "raw":
      return "No formatting applied — raw markdown as extracted from the file."
    default:
      return ""
  }
}
