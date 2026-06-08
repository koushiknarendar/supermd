export type CompressionLevel = "light" | "balanced" | "aggressive"

interface Rule {
  level: CompressionLevel
  pattern: RegExp
  replacement: string
}

function r(level: CompressionLevel, phrase: string, replacement: string): Rule {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const startsWord = /^\w/.test(phrase)
  const endsWord = /\w$/.test(phrase)
  const pat = `${startsWord ? "\\b" : ""}${escaped}${endsWord ? "\\b" : ""}`
  return { level, pattern: new RegExp(pat, "gi"), replacement }
}

// Rules ordered longest → shortest to avoid partial matches
const RULES: Rule[] = [
  // Light — pure filler, zero semantic change
  r("light", "in spite of the fact that", "although"),
  r("light", "despite the fact that", "although"),
  r("light", "due to the fact that", "because"),
  r("light", "for the reason that", "because"),
  r("light", "owing to the fact that", "because"),
  r("light", "on the grounds that", "because"),
  r("light", "in the event that", "if"),
  r("light", "for the purpose of", "to"),
  r("light", "in order to", "to"),
  r("light", "on the basis of", "based on"),
  r("light", "as a result of", "because of"),
  r("light", "with regards to", "about"),
  r("light", "with regard to", "about"),
  r("light", "with respect to", "about"),
  r("light", "in relation to", "about"),
  r("light", "first and foremost", "first"),
  r("light", "last but not least", "finally"),
  r("light", "each and every", "every"),
  r("light", "any and all", "all"),
  r("light", "null and void", "void"),
  r("light", "various different", "various"),
  r("light", "end result", "result"),
  r("light", "future plans", "plans"),
  r("light", "past history", "history"),
  r("light", "close proximity", "proximity"),
  r("light", "general consensus", "consensus"),
  r("light", "added bonus", "bonus"),
  r("light", "advance warning", "warning"),
  r("light", "final outcome", "outcome"),
  r("light", "unexpected surprise", "surprise"),
  r("light", "new innovation", "innovation"),
  r("light", "personal opinion", "opinion"),
  r("light", "current status", "status"),

  // Balanced — more patterns + partial removals
  r("balanced", "it is important to note that", "Note:"),
  r("balanced", "it should be noted that", "Note:"),
  r("balanced", "it is worth noting that", "Note:"),
  r("balanced", "please note that", "Note:"),
  r("balanced", "it is worth mentioning that", ""),
  r("balanced", "it goes without saying that", ""),
  r("balanced", "needless to say,", ""),
  r("balanced", "needless to say", ""),
  r("balanced", "as mentioned earlier,", ""),
  r("balanced", "as mentioned earlier", ""),
  r("balanced", "as mentioned above,", ""),
  r("balanced", "as mentioned above", ""),
  r("balanced", "as previously stated,", ""),
  r("balanced", "as previously stated", ""),
  r("balanced", "as previously mentioned,", ""),
  r("balanced", "as previously mentioned", ""),
  r("balanced", "as noted above,", ""),
  r("balanced", "as noted above", ""),
  r("balanced", "at this point in time", "now"),
  r("balanced", "at the present time", "now"),
  r("balanced", "at the current time", "currently"),
  r("balanced", "a large number of", "many"),
  r("balanced", "a majority of", "most"),
  r("balanced", "a number of", "several"),
  r("balanced", "a wide variety of", "various"),
  r("balanced", "were able to", "could"),
  r("balanced", "was able to", "could"),
  r("balanced", "are able to", "can"),
  r("balanced", "is able to", "can"),
  r("balanced", "be able to", "can"),
  r("balanced", "are going to", "will"),
  r("balanced", "is going to", "will"),
  r("balanced", "completely eliminate", "eliminate"),
  r("balanced", "completely unique", "unique"),
  r("balanced", "absolutely essential", "essential"),
  r("balanced", "very unique", "unique"),
  r("balanced", "very essential", "essential"),

  // Aggressive — nominalisation reversal + discourse markers removed
  r("aggressive", "take into consideration", "consider"),
  r("aggressive", "make a decision", "decide"),
  r("aggressive", "reach a conclusion", "conclude"),
  r("aggressive", "conduct an investigation", "investigate"),
  r("aggressive", "provide an explanation", "explain"),
  r("aggressive", "make an adjustment to", "adjust"),
  r("aggressive", "provide assistance to", "help"),
  r("aggressive", "provide assistance", "help"),
  r("aggressive", "in terms of", "in"),
  r("aggressive", "in conclusion,", ""),
  r("aggressive", "in conclusion", ""),
  r("aggressive", "to summarize,", ""),
  r("aggressive", "to summarize", ""),
  r("aggressive", "in summary,", ""),
  r("aggressive", "in summary", ""),
  r("aggressive", "that being said,", ""),
  r("aggressive", "that being said", ""),
  r("aggressive", "having said that,", ""),
  r("aggressive", "having said that", ""),
  r("aggressive", "with that in mind,", ""),
  r("aggressive", "with that in mind", ""),
]

const ACTIVE_LEVELS: Record<CompressionLevel, CompressionLevel[]> = {
  light: ["light"],
  balanced: ["light", "balanced"],
  aggressive: ["light", "balanced", "aggressive"],
}

function preserveCase(original: string, replacement: string): string {
  if (!replacement) return replacement
  if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }
  return replacement
}

function cleanup(text: string, level: CompressionLevel): string {
  let out = text

  // Collapse space before punctuation
  out = out.replace(/ +([,.])/g, "$1")
  // Collapse multiple spaces on the same line (preserving newlines)
  out = out.replace(/[^\S\n]+/g, " ")
  // Trim trailing space on each line
  out = out.replace(/ +$/gm, "")
  // Remove lines that became empty after removals (except for structure)
  out = out.replace(/^\s*$/gm, "")

  if (level === "balanced" || level === "aggressive") {
    // Collapse more than 2 consecutive blank lines → 1
    out = out.replace(/\n{3,}/g, "\n\n")
  }
  if (level === "aggressive") {
    // Collapse all multiple blank lines → 0 (tight prose)
    out = out.replace(/\n{2,}/g, "\n")
  }

  return out.trim()
}

export interface CompressResult {
  compressed: string
  changesApplied: number
}

export function compressText(text: string, level: CompressionLevel): CompressResult {
  const active = ACTIVE_LEVELS[level]
  const activeRules = RULES.filter((r) => active.includes(r.level))

  let out = text
  let changesApplied = 0

  for (const rule of activeRules) {
    // Reset lastIndex since patterns are created with /gi
    rule.pattern.lastIndex = 0
    const before = out
    out = out.replace(rule.pattern, (match) => {
      changesApplied++
      return preserveCase(match, rule.replacement)
    })
    // Reset again after use
    rule.pattern.lastIndex = 0
    if (out !== before) {
      // already counted inside replace callback
    }
  }

  out = cleanup(out, level)

  return { compressed: out, changesApplied }
}

export function estimateTokens(text: string): number {
  // ~3.8 chars per token (Claude heuristic, close enough for all models)
  return Math.round(text.length / 3.8)
}
