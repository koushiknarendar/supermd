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

function extractTitle(html: string): string {
  return (
    html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ??
    html.match(/<h1[^>]*>([^<]*)<\/h1>/i)?.[1]?.trim() ??
    ""
  )
}

function extractDescription(html: string): string {
  return (
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{10,})/i)?.[1]?.trim() ??
    html.match(/<meta[^>]+content=["']([^"']{10,})["'][^>]+name=["']description["']/i)?.[1]?.trim() ??
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i)?.[1]?.trim() ??
    ""
  )
}

function extractText(html: string): string {
  let t = html.replace(/<script[\s\S]*?<\/script>/gi, "")
  t = t.replace(/<style[\s\S]*?<\/style>/gi, "")
  t = t.replace(/<nav[\s\S]*?<\/nav>/gi, "")
  t = t.replace(/<footer[\s\S]*?<\/footer>/gi, "")
  t = t.replace(/<header[\s\S]*?<\/header>/gi, "")
  t = t.replace(/<[^>]+>/g, " ")
  return t.replace(/\s+/g, " ").trim().slice(0, 1500)
}

function extractLinks(html: string, base: string): string[] {
  const origin = new URL(base).origin
  const basePath = new URL(base).pathname
  const seen = new Set<string>()
  const links: string[] = []
  const re = /href=["']([^"'#?][^"']*?)["']/gi
  let m: RegExpExecArray | null

  while ((m = re.exec(html)) !== null) {
    try {
      const resolved = new URL(m[1], base)
      if (
        resolved.origin === origin &&
        resolved.pathname !== basePath &&
        !resolved.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|pdf|zip|xml|json|woff|ttf)$/i) &&
        !seen.has(resolved.pathname)
      ) {
        seen.add(resolved.pathname)
        links.push(resolved.href)
      }
    } catch { /* skip */ }
  }

  // Prioritise shorter paths (top-level pages)
  return links.sort((a, b) => a.length - b.length).slice(0, 5)
}

async function fetchPage(url: string): Promise<{ url: string; title: string; description: string; text: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SuperMD-Bot/1.0 (+https://supermd.dev)" },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const ct = res.headers.get("content-type") ?? ""
    if (!ct.includes("text/html")) return null
    const html = await res.text()
    return {
      url,
      title: extractTitle(html),
      description: extractDescription(html),
      text: extractText(html),
    }
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const url: string = body?.url ?? ""

  if (!url || !isSafeUrl(url)) {
    return NextResponse.json({ error: "Invalid or unsafe URL." }, { status: 400 })
  }

  const homepage = await fetchPage(url)
  if (!homepage) {
    return NextResponse.json({ error: "Could not fetch that URL. Make sure it is publicly accessible." }, { status: 422 })
  }

  // Re-fetch raw HTML for link extraction (homepage already consumed the body)
  const rawHtml = await fetch(url, {
    headers: { "User-Agent": "SuperMD-Bot/1.0" },
    signal: AbortSignal.timeout(8000),
  }).then((r) => r.text()).catch(() => "")

  const links = extractLinks(rawHtml, url)
  const subPages = await Promise.all(links.map(fetchPage))
  const pages = [homepage, ...subPages.filter(Boolean)]

  return NextResponse.json({ pages })
}
