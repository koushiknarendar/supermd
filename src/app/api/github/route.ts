import { NextRequest, NextResponse } from "next/server"

const GITHUB_API = "https://api.github.com"

const ALLOWED_PREFIXES = ["/repos/", "/search/repositories"]

function isValidPath(path: string): boolean {
  if (!path.startsWith("/")) return false
  if (path.includes("..") || path.includes("//")) return false
  return ALLOWED_PREFIXES.some((p) => path.startsWith(p))
}

export async function GET(req: NextRequest) {
  const path = new URL(req.url).searchParams.get("path")

  if (!path || !isValidPath(path)) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 })
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SuperMD/1.0 (+https://supermd.dev)",
  }
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const url = `${GITHUB_API}${path}`

  try {
    const res = await fetch(url, { headers, next: { revalidate: 120 } })

    const remaining = res.headers.get("X-RateLimit-Remaining")
    const resetTs = res.headers.get("X-RateLimit-Reset")

    if (res.status === 403 && remaining === "0") {
      const resetTime = resetTs
        ? new Date(Number(resetTs) * 1000).toLocaleTimeString()
        : "soon"
      return NextResponse.json(
        { error: `GitHub rate limit reached. Resets at ${resetTime}. Add a GITHUB_TOKEN env var to increase the limit.` },
        { status: 429 }
      )
    }

    if (res.status === 404) {
      return NextResponse.json(
        { error: "Repository not found — make sure it's public." },
        { status: 404 }
      )
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: body.message ?? `GitHub error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Could not reach GitHub API." }, { status: 502 })
  }
}
