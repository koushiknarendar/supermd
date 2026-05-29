"use client"

// Lazy-load tiktoken WASM only on first call to avoid impacting page load
let encoder: { encode: (text: string) => Uint32Array; free: () => void } | null = null
let loadPromise: Promise<void> | null = null

async function loadEncoder() {
  if (encoder) return
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const { Tiktoken } = await import("tiktoken/lite")
    const cl100k = await import("tiktoken/encoders/cl100k_base")
    encoder = new Tiktoken(
      cl100k.default.bpe_ranks,
      cl100k.default.special_tokens,
      cl100k.default.pat_str
    )
  })()

  return loadPromise
}

export async function countTokensGPT4o(text: string): Promise<number> {
  try {
    await loadEncoder()
    if (!encoder) return Math.ceil(text.length / 4)
    const tokens = encoder.encode(text)
    return tokens.length
  } catch {
    // Fallback if WASM fails to load
    return Math.ceil(text.length / 4)
  }
}
