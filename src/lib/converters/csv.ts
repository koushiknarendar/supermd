export type Delimiter = "auto" | "," | "\t" | ";" | "|"

export interface CsvOptions {
  delimiter: Delimiter
  hasHeader: boolean
  maxRows: number // 0 = unlimited
}

export interface CsvResult {
  table: string
  rows: number
  cols: number
  truncated: boolean
  detectedDelimiter: string
}

function detectDelimiter(text: string): string {
  const sample = text.slice(0, 2000)
  const counts: Record<string, number> = {
    ",": (sample.match(/,/g) ?? []).length,
    "\t": (sample.match(/\t/g) ?? []).length,
    ";": (sample.match(/;/g) ?? []).length,
    "|": (sample.match(/\|/g) ?? []).length,
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

function parseCSV(text: string, delimiter: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cell += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === delimiter) {
        row.push(cell)
        cell = ""
      } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
        if (ch === "\r") i++
        row.push(cell)
        cell = ""
        if (row.some((c) => c.trim() !== "")) rows.push(row)
        row = []
      } else {
        cell += ch
      }
    }
  }

  // last cell / row
  row.push(cell)
  if (row.some((c) => c.trim() !== "")) rows.push(row)

  return rows
}

function escapeCell(s: string): string {
  return s.trim().replace(/\|/g, "\\|").replace(/\n/g, " ")
}

export function csvToMarkdown(raw: string, opts: CsvOptions): CsvResult {
  const del = opts.delimiter === "auto" ? detectDelimiter(raw) : opts.delimiter
  const allRows = parseCSV(raw, del)

  if (allRows.length === 0) {
    return { table: "", rows: 0, cols: 0, truncated: false, detectedDelimiter: del }
  }

  const maxCols = Math.max(...allRows.map((r) => r.length))
  const pad = (r: string[]) => [...r, ...Array(maxCols - r.length).fill("")]

  const headerRow = opts.hasHeader ? pad(allRows[0]) : allRows[0].map((_, i) => `Column ${i + 1}`)
  const dataRows = opts.hasHeader ? allRows.slice(1) : allRows

  const limit = opts.maxRows > 0 ? opts.maxRows : Infinity
  const truncated = dataRows.length > limit
  const visibleData = truncated ? dataRows.slice(0, limit) : dataRows

  const lines: string[] = []
  lines.push(`| ${headerRow.map(escapeCell).join(" | ")} |`)
  lines.push(`| ${headerRow.map(() => "---").join(" | ")} |`)
  for (const row of visibleData) {
    lines.push(`| ${pad(row).map(escapeCell).join(" | ")} |`)
  }
  if (truncated) {
    lines.push(``)
    lines.push(`> ⚠️ Showing ${limit.toLocaleString()} of ${dataRows.length.toLocaleString()} rows. Download the file and remove the limit to include all rows.`)
  }

  return {
    table: lines.join("\n"),
    rows: visibleData.length,
    cols: maxCols,
    truncated,
    detectedDelimiter: del,
  }
}
