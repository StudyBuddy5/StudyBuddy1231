"use client"

import { useState, useEffect } from "react"
import { InteractiveGrid } from "@/components/interactive-grid"
import { Header } from "@/components/header"
import { DeviceSidebar } from "@/components/device-sidebar"
import { DevicePanel } from "@/components/device-panel"
import { StatusFooter } from "@/components/status-footer"
import { fetchDevices } from "@/lib/api"
import type { Device } from "@/lib/types"
import { Monitor } from "lucide-react"

export default function LoggerBuddyPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

  useEffect(() => {
    fetchDevices().then((data) => {
      setDevices(data)
    })
  }, [])

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || null

  return (
    <div className="relative flex h-screen flex-col overflow-hidden" style={{ background: "#0F1115" }}>
      {/* Interactive background grid */}
      <InteractiveGrid />

      {/* Top header bar */}
      <div
        className="relative z-10 shrink-0 px-5 py-3"
        style={{ borderBottom: "1px solid #1A1E26" }}
      >
        <Header />
      </div>

      {/* Main content: sidebar + panel */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left sidebar with device list */}
        <DeviceSidebar
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={(id) => setSelectedDeviceId(id)}
        />

        {/* Right content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedDevice ? (
            <DevicePanel key={selectedDevice.id} device={selectedDevice} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Bottom status bar */}
      <div
        className="relative z-10 shrink-0 px-5 py-2"
        style={{ borderTop: "1px solid #1A1E26" }}
      >
        <StatusFooter />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: "88px",
          height: "88px",
          background: "rgba(28, 32, 40, 0.3)",
          border: "1px solid #1E232C",
          boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Monitor className="h-10 w-10" style={{ color: "#1E232C" }} strokeWidth={1} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-sm font-medium" style={{ color: "#4B5563" }}>
          No Device Selected
        </span>
        <span className="text-xs font-mono" style={{ color: "#2A2F38" }}>
          Select a device from the sidebar to begin
        </span>
      </div>
    </div>
  )
}
