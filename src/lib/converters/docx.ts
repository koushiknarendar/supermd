"use client"

export async function convertDocx(file: File): Promise<string> {
  const [mammoth, TurndownService] = await Promise.all([
    import("mammoth"),
    import("turndown"),
  ])

  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.default.convertToHtml({ arrayBuffer })

  const td = new TurndownService.default({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  })

  // Preserve tables
  td.addRule("table", {
    filter: "table",
    replacement: (_content: string, node: Node) => {
      const table = node as HTMLTableElement
      const rows = Array.from(table.querySelectorAll("tr"))
      if (rows.length === 0) return ""

      const mdRows: string[] = []
      rows.forEach((row, i) => {
        const cells = Array.from(row.querySelectorAll("td, th")).map((cell) =>
          (cell as HTMLElement).textContent?.trim().replace(/\|/g, "\\|") ?? ""
        )
        mdRows.push(`| ${cells.join(" | ")} |`)
        if (i === 0) mdRows.push(`| ${cells.map(() => "---").join(" | ")} |`)
      })
      return "\n\n" + mdRows.join("\n") + "\n\n"
    },
  })

  return td.turndown(result.value)
}
