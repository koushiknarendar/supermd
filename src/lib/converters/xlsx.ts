"use client"

export async function convertXlsx(file: File): Promise<string> {
  const xlsxModule = await import("xlsx")
  // CJS default export may be nested under .default in some bundlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const XLSX = (xlsxModule as any).default ?? xlsxModule

  const isCSV = file.name.toLowerCase().endsWith(".csv")
  let workbook

  if (isCSV) {
    const text = await file.text()
    workbook = XLSX.read(text, { type: "string" })
  } else {
    const arrayBuffer = await file.arrayBuffer()
    workbook = XLSX.read(arrayBuffer, { type: "array" })
  }

  const sections: string[] = []

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const rows: string[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    })

    if (rows.length === 0) continue

    sections.push(`## ${sheetName}`)

    const nonEmptyRows = rows.filter((row) =>
      row.some((cell) => String(cell).trim() !== "")
    )

    if (nonEmptyRows.length === 0) continue

    const header = nonEmptyRows[0].map((cell) =>
      String(cell).trim().replace(/\|/g, "\\|")
    )
    const separator = header.map(() => "---")

    const mdRows = [
      `| ${header.join(" | ")} |`,
      `| ${separator.join(" | ")} |`,
      ...nonEmptyRows.slice(1).map(
        (row) =>
          `| ${header.map((_, i) => String(row[i] ?? "").trim().replace(/\|/g, "\\|")).join(" | ")} |`
      ),
    ]

    sections.push(mdRows.join("\n"))
  }

  return sections.join("\n\n")
}
