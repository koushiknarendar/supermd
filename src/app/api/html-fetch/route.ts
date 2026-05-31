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

function extractMainContent(html: string): string {
  // Try to pull out the main content block in priority order
  const candidates = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<div[^>]*(?:id|class)=["'][^"']*(?:content|main|post|article|body)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ]
  for (const re of candidates) {
    const m = html.match(re)
    if (m && m[1].length > 200) return m[1]
  }
  // Fall back to body
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]
  return body ?? html
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const url: string = body?.url ?? ""

  if (!url || !isSafeUrl(url)) {
    return NextResponse.json({ error: "Invalid or unsafe URL." }, { status: 400 })
  }

  let html: string
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SuperMD-Bot/1.0 (+https://supermd.dev)" },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return NextResponse.json({ error: `Fetch failed: ${res.status} ${res.statusText}` }, { status: 422 })
    const ct = res.headers.get("content-type") ?? ""
    if (!ct.includes("text/html")) return NextResponse.json({ error: "URL does not return HTML." }, { status: 422 })
    html = await res.text()
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not fetch URL." }, { status: 422 })
  }

  const content = extractMainContent(html)
  return NextResponse.json({ html: content })
}
