import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "skill.md — Build Claude Code Skill Files",
  description:
    "Fill the form and get a ready-to-use skill.md for Claude Code. Define the trigger, steps, and arguments — then drop it into ~/.claude/skills/. Free, no sign-up.",
  keywords: ["Claude Code skill", "skill.md generator", "Claude Code skills", "AI skill file", "Claude automation"],
  alternates: { canonical: "https://supermd.dev/skill-md" },
  openGraph: {
    title: "skill.md — Build Claude Code Skill Files",
    description: "Fill the form and get a ready-to-use skill.md for Claude Code in seconds.",
    url: "https://supermd.dev/skill-md",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
