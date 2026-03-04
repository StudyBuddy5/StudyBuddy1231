"use client"

import { Shield, Signal, Settings } from "lucide-react"

export function Header() {
  return (
    <header className="relative flex items-center justify-between">
      {/* Title group */}
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <Shield className="h-4 w-4" style={{ color: "#FFFFFF" }} strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <h1
            className="text-xl font-bold tracking-tight leading-none"
            style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}
          >
            LoggerBuddy
          </h1>
          <span
            className="text-[10px] font-mono tracking-[0.25em] uppercase"
            style={{ color: "#4B5563" }}
          >
            Command Center
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <StatusPill />
        <IconButton icon={<Signal className="h-3.5 w-3.5" strokeWidth={1.5} />} label="Network" />
        <IconButton icon={<Settings className="h-3.5 w-3.5" strokeWidth={1.5} />} label="Settings" />
      </div>
    </header>
  )
}

function StatusPill() {
  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{
        background: "rgba(34, 197, 94, 0.08)",
        border: "1px solid rgba(34, 197, 94, 0.2)",
      }}
    >
      <div
        className="h-1.5 w-1.5 rounded-full animate-pulse"
        style={{ background: "#22C55E", boxShadow: "0 0 6px rgba(34, 197, 94, 0.5)" }}
      />
      <span className="text-[11px] font-mono tracking-wide" style={{ color: "#22C55E" }}>
        SYSTEM OK
      </span>
    </div>
  )
}

function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="flex items-center justify-center rounded-lg transition-colors duration-200"
      style={{
        width: "32px",
        height: "32px",
        background: "rgba(28, 32, 40, 0.5)",
        border: "1px solid #2A2F38",
        color: "#6B7280",
      }}
      aria-label={label}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#3B82F6"
        e.currentTarget.style.color = "#3B82F6"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2A2F38"
        e.currentTarget.style.color = "#6B7280"
      }}
    >
      {icon}
    </button>
  )
}
