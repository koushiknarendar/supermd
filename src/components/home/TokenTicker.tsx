"use client"

import { useEffect, useState } from "react"

const SEED = 3_847_293_104
const INCREMENT_PER_TICK = 312

function formatBig(n: number) {
  if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(2) + "B+"
  }
  return (n / 1_000_000).toFixed(1) + "M+"
}

export function TokenTicker() {
  const [count, setCount] = useState(SEED)

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + INCREMENT_PER_TICK + Math.floor(Math.random() * 80))
    }, 300)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="stat-box">
      <span
        className="stat-number"
        style={{ color: "#2563eb", fontVariantNumeric: "tabular-nums" }}
      >
        {formatBig(count)}
      </span>
      <span className="stat-label">tokens eliminated by supermd</span>
    </div>
  )
}
