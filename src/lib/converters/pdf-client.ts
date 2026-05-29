"use client"

export type PdfProgress = { loaded: number; total: number }

export async function convertPdfClient(
  file: File,
  onProgress?: (p: PdfProgress) => void
): Promise<string> {
  const pdfjs = await import("pdfjs-dist")

  // Point to the worker bundled by Next.js
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pdf: any
  try {
    pdf = await loadingTask.promise
  } catch {
    throw new Error("Could not parse PDF. The file may be corrupted or encrypted.")
  }

  const sections: string[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    onProgress?.({ loaded: pageNum, total: pdf.numPages })
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ("str" in item ? (item.str as string) : ""))
      .join(" ")
      .trim()

    if (pageText) {
      sections.push(`<!-- Page ${pageNum} -->\n${pageText}`)
    }
  }

  return sections.join("\n\n")
}
