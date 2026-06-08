import { NextRequest, NextResponse } from "next/server"

const BLOCKED_HOSTS = new Set([
  "localhost", "127.0.0.1", "0.0.0.0", "::1",
  "169.254.169.254", "metadata.google.internal",
])

function isSafeUrl(raw: string): boolean {
  try {
    const u = new URL(raw)
    if (!["http:", "https:"].includes(u.protocol)) return false
    const h = u.hostname
    if (BLOCKED_HOSTS.has(h)) return false
    if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(h)) return false
    return true
  } catch {
    return false
  }
}

function resolveUrl(href: string, base: string): string | null {
  if (href.startsWith("//")) href = "https:" + href
  try { return new URL(href, base).toString() } catch { return null }
}

function parseTitle(html: string): string {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? ""
}

function extractGoogleFonts(html: string, css: string): string[] {
  const fonts = new Set<string>()
  const sources = [
    ...html.matchAll(/href=["']https?:\/\/fonts\.googleapis\.com\/css2?\?([^"'\s>]+)/gi),
    ...css.matchAll(/@import\s+url\(['"]?https?:\/\/fonts\.googleapis\.com\/css2?\?([^'")\s]+)/gi),
  ]
  for (const m of sources) {
    try {
      const params = new URLSearchParams(m[1].replace(/&amp;/g, "&"))
      for (const [k, v] of params.entries()) {
        if (k === "family") {
          for (const fam of v.split("|")) {
            const name = fam.split(":")[0].replace(/\+/g, " ").trim()
            if (name) fonts.add(name)
          }
        }
      }
    } catch { /* skip malformed */ }
  }
  return Array.from(fonts)
}

function extractCustomProperties(css: string): Record<string, string> {
  const props: Record<string, string> = {}
  const matches = css.matchAll(/(--[\w-]+)\s*:\s*([^;!{}]+?)(?:\s*!important)?\s*;/g)
  for (const m of matches) {
    const key = m[1].trim()
    const value = m[2].trim()
    if (!(key in props) && value.length > 0 && value.length < 200) {
      props[key] = value
    }
  }
  return props
}

function extractFontFamilies(css: string): string[] {
  const families = new Set<string>()
  for (const m of css.matchAll(/font-family\s*:\s*([^;{}]+)[;{}]/gi)) {
    const val = m[1].trim()
    if (val.startsWith("var(") || val.startsWith("inherit") || val.startsWith("unset")) continue
    const first = val.split(",")[0].trim().replace(/['"]/g, "")
    if (first && first.length < 80) families.add(first)
    if (families.size >= 8) break
  }
  return Array.from(families)
}

function extractColors(css: string): string[] {
  const freq = new Map<string, number>()
  for (const m of css.matchAll(/#([0-9a-fA-F]{6})\b/g)) {
    const c = m[0].toLowerCase()
    freq.set(c, (freq.get(c) ?? 0) + 1)
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c)
    .filter(c => !["#ffffff", "#000000"].includes(c))
    .slice(0, 20)
}

function extractFontSizes(css: string): string[] {
  const sizes = new Set<string>()
  for (const m of css.matchAll(/font-size\s*:\s*([\d.]+(?:px|rem|em))/gi)) {
    sizes.add(m[1])
  }
  return Array.from(sizes)
    .sort((a, b) => parseFloat(a) - parseFloat(b))
    .slice(0, 16)
}

function extractRadii(css: string): string[] {
  const radii = new Set<string>()
  for (const m of css.matchAll(/border-radius\s*:\s*([\d.]+(?:px|rem|em|%))\b/gi)) {
    radii.add(m[1])
  }
  return Array.from(radii).sort((a, b) => parseFloat(a) - parseFloat(b)).slice(0, 10)
}

function extractShadows(css: string): string[] {
  const shadows = new Set<string>()
  for (const m of css.matchAll(/box-shadow\s*:\s*([^;{}]+)[;{}]/gi)) {
    const v = m[1].trim()
    if (v !== "none" && !v.startsWith("var(") && v.length < 200) shadows.add(v)
    if (shadows.size >= 8) break
  }
  return Array.from(shadows)
}

function extractBodyStyles(css: string): { bg?: string; color?: string } {
  const bodyBlock = css.match(/(?:^|[^a-z-])body\s*\{([^}]+)\}/i)?.[1] ?? ""
  const bg = bodyBlock.match(/background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|[a-z]+)/i)?.[1]
  const color = bodyBlock.match(/(?:^|;)\s*color\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|[a-z]+)/i)?.[1]
  return { bg, color }
}

async function fetchText(url: string, type: "html" | "css"): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SuperMD-Bot/1.0; +https://supermd.dev)" },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ""
    const ct = res.headers.get("content-type") ?? ""
    if (type === "css" && !ct.includes("css") && !ct.includes("plain") && !url.endsWith(".css")) return ""
    const text = await res.text()
    return text.slice(0, 600_000)
  } catch {
    return ""
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const url: string = body?.url ?? ""

  if (!url || !isSafeUrl(url)) {
    return NextResponse.json({ error: "Invalid or unsafe URL." }, { status: 400 })
  }

  const html = await fetchText(url, "html")
  if (!html) return NextResponse.json({ error: "Could not fetch the page. Make sure the URL is publicly accessible." }, { status: 422 })

  const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join("\n")

  // Collect up to 5 stylesheet links (skip fonts, icons, print media)
  const stylesheetUrls: string[] = []
  for (const tag of html.matchAll(/<link([^>]+)>/gi)) {
    const attrs = tag[1]
    if (!/rel=["']stylesheet["']/i.test(attrs)) continue
    if (/media=["']print["']/i.test(attrs)) continue
    const href = attrs.match(/href=["']([^"']+)["']/i)?.[1]
    if (!href) continue
    if (/fonts\.googleapis|fontawesome|font-awesome/i.test(href)) continue
    const resolved = resolveUrl(href, url)
    if (resolved && isSafeUrl(resolved)) {
      stylesheetUrls.push(resolved)
      if (stylesheetUrls.length >= 5) break
    }
  }

  const fetched = await Promise.all(stylesheetUrls.map(u => fetchText(u, "css")))
  const allCss = [inlineStyles, ...fetched].join("\n")

  const { bg: bodyBg, color: bodyColor } = extractBodyStyles(allCss)

  return NextResponse.json({
    url,
    title: parseTitle(html),
    googleFonts: extractGoogleFonts(html, allCss),
    customProperties: extractCustomProperties(allCss),
    fontFamilies: extractFontFamilies(allCss),
    colors: extractColors(allCss),
    fontSizes: extractFontSizes(allCss),
    radii: extractRadii(allCss),
    shadows: extractShadows(allCss),
    bodyBg,
    bodyColor,
  })
}
