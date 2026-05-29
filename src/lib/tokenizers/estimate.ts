// Character-based token estimation for Claude (~3.8 chars/token) and Gemini (~4.0)
// These are heuristics — show ~ prefix in UI

export function estimateClaudeTokens(text: string): number {
  return Math.ceil(text.length / 3.8)
}

export function estimateGeminiTokens(text: string): number {
  return Math.ceil(text.length / 4.0)
}

// Generic fallback
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.9)
}
