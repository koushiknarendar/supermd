import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // pdf.js tries to require canvas for node — disable in browser
      canvas: { browser: "./src/lib/empty.ts" },
    },
  },
}

export default nextConfig
