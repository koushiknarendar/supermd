import Link from "next/link"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 py-8">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-5">
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-slate-800">
            SuperMD
          </span>
          <Link
            href="/markitdown"
            className="text-[12px] text-slate-400 hover:text-slate-700 transition-colors font-mono"
          >
            markitdown
          </Link>
          <Link
            href="/pricing"
            className="text-[12px] text-slate-400 hover:text-slate-700 transition-colors font-mono"
          >
            pricing
          </Link>
        </div>
        <span className="label-mono">
          © {new Date().getFullYear()} supermd — generate the markdown your ai actually needs
        </span>
      </div>
    </footer>
  )
}
