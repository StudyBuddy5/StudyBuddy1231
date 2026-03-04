"use client"

import { Activity, HardDrive, Cpu, Wifi } from "lucide-react"

export function StatusFooter() {
  return (
    <footer
      className="flex items-center justify-between rounded-lg px-4 py-3"
      style={{
        background: "rgba(12, 14, 18, 0.6)",
        border: "1px solid #1A1E26",
      }}
    >
      <div className="flex items-center gap-5">
        <FooterStat icon={<Activity className="h-3 w-3" />} label="UPTIME" value="14d 7h 22m" />
        <FooterStat icon={<HardDrive className="h-3 w-3" />} label="DISK" value="847 GB Free" />
        <FooterStat icon={<Cpu className="h-3 w-3" />} label="LOAD" value="0.42" />
        <FooterStat icon={<Wifi className="h-3 w-3" />} label="NET" value="1.2 Gbps" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono" style={{ color: "#4B5563" }}>
          v2.4.1
        </span>
        <div className="h-3 w-px" style={{ background: "#2A2F38" }} />
        <span className="text-[10px] font-mono" style={{ color: "#4B5563" }}>
          TLS 1.3
        </span>
      </div>
    </footer>
  )
}

function FooterStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "#4B5563" }}>{icon}</span>
      <span className="text-[10px] font-mono tracking-wider" style={{ color: "#4B5563" }}>
        {label}
      </span>
      <span className="text-[11px] font-mono" style={{ color: "#A0A6B2" }}>
        {value}
      </span>
    </div>
  )
}
