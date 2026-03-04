"use client"

interface BatteryBarProps {
  connectedCount: number
  totalSlots: number
}

export function BatteryBar({ connectedCount, totalSlots }: BatteryBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "#6B7280" }}>
          Device Uplink
        </span>
        <span className="text-xs font-mono" style={{ color: "#6B7280" }}>
          {connectedCount}/{totalSlots} Online
        </span>
      </div>
      <div
        className="flex gap-1 rounded-lg p-1.5"
        style={{
          background: "rgba(15, 17, 21, 0.6)",
          border: "1px solid #2A2F38",
          boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.5)",
        }}
      >
        {Array.from({ length: totalSlots }).map((_, i) => {
          const isActive = i < connectedCount
          const fillRatio = connectedCount / totalSlots
          // Color transitions from grey (0 devices) -> blue (some) -> blue-purple (all)
          let fillColor = "#3B82F6"
          if (fillRatio >= 0.75) {
            fillColor = "#6366F1" // indigo/purple at high capacity
          } else if (fillRatio >= 0.5) {
            fillColor = "#3B82F6" // blue at mid
          } else if (fillRatio > 0) {
            fillColor = "#64748B" // slate grey at low
          }

          return (
            <div
              key={i}
              className="relative flex-1 overflow-hidden rounded-md transition-all duration-500"
              style={{
                height: "28px",
                background: isActive
                  ? fillColor
                  : "rgba(28, 32, 40, 0.5)",
                border: `1px solid ${isActive ? "rgba(255,255,255,0.1)" : "rgba(42, 47, 56, 0.5)"}`,
                boxShadow: isActive
                  ? `0 0 12px ${fillColor}33, inset 0 1px 0 rgba(255,255,255,0.15)`
                  : "inset 0 1px 4px rgba(0,0,0,0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              {isActive && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)`,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
