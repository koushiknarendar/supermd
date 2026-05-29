export interface CrawledPage {
  url: string
  title: string
  description: string
  text: string
}

export function generateLlmsTxt(pages: CrawledPage[], siteUrl: string): string {
  if (!pages.length) return ""

  const home = pages[0]
  const rest = pages.slice(1)

  let hostname = siteUrl
  try { hostname = new URL(siteUrl).hostname.replace(/^www\./, "") } catch { /* */ }

  const siteName = home.title || hostname
  const siteDesc = home.description || `Content from ${hostname}`

  const homeLink = `- [${home.title || "Homepage"}](${home.url}): ${home.description || "Main page"}`

  const subLinks = rest
    .filter((p) => p.title && p.url)
    .map((p) => {
      const desc = p.description || p.text.slice(0, 120).replace(/\s+/g, " ").trim()
      return `- [${p.title}](${p.url}): ${desc}`
    })
    .join("\n")

  const sections: string[] = [
    `# ${siteName}`,
    ``,
    `> ${siteDesc}`,
    ``,
    `## Pages`,
    ``,
    homeLink,
    ...(subLinks ? [subLinks] : []),
  ]

  return sections.join("\n")
}
