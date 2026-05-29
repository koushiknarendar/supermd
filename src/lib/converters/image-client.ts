"use client"

export type OcrProgress = { status: string; progress: number }

export async function convertImageClient(
  file: File,
  onProgress?: (p: OcrProgress) => void
): Promise<string> {
  const Tesseract = await import("tesseract.js")

  const url = URL.createObjectURL(file)
  try {
    const result = await Tesseract.recognize(url, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          onProgress?.({ status: m.status, progress: m.progress })
        } else {
          onProgress?.({ status: m.status, progress: 0 })
        }
      },
    })
    return result.data.text.trim()
  } finally {
    URL.revokeObjectURL(url)
  }
}
