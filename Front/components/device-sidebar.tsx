"use client"

import { Monitor, ChevronRight, Plus } from "lucide-react"
import type { Device } from "@/lib/types"
import { BatteryBar } from "./battery-bar"

interface DeviceSidebarProps {
  devices: Device[]
  selectedDeviceId: string | null
  onSelectDevice: (id: string) => void
}

export function DeviceSidebar({ devices, selectedDeviceId, onSelectDevice }: DeviceSidebarProps) {
  const connectedCount = devices.filter((d) => d.status === "online").length

  return (
    <aside
      className="flex h-full w-[260px] shrink-0 flex-col"
      style={{
        background: "rgba(12, 14, 18, 0.85)",
        borderRight: "1px solid #1E232C",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Sidebar header */}
      <div className="flex flex-col gap-3 px-4 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-mono tracking-[0.3em] uppercase"
            style={{ color: "#4B5563" }}
          >
            Devices
          </span>
          <button
            className="flex items-center justify-center rounded transition-colors duration-150"
            style={{
              width: "22px",
              height: "22px",
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              color: "#3B82F6",
            }}
            aria-label="Add device"
          >
            <Plus className="h-3 w-3" strokeWidth={2} />
          </button>
        </div>
        <BatteryBar connectedCount={connectedCount} totalSlots={devices.length} />
      </div>

      {/* Divider */}
      <div className="mx-3" style={{ height: "1px", background: "#1E232C" }} />

      {/* Device list */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2" aria-label="Device list">
        {devices.map((device) => {
          const isSelected = selectedDeviceId === device.id
          const isOnline = device.status === "online"
          return (
            <button
              key={device.id}
              onClick={() => onSelectDevice(device.id)}
              className="group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200"
              style={{
                background: isSelected
                  ? "rgba(59, 130, 246, 0.08)"
                  : "transparent",
                border: isSelected
                  ? "1px solid rgba(59, 130, 246, 0.2)"
                  : "1px solid transparent",
              }}
              aria-current={isSelected ? "page" : undefined}
            >
              {/* Active indicator bar */}
              {isSelected && (
                <div
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r"
                  style={{ background: "#3B82F6" }}
                />
              )}

              {/* Icon */}
              <div
                className="flex shrink-0 items-center justify-center rounded"
                style={{
                  width: "30px",
                  height: "30px",
                  background: isSelected
                    ? "rgba(59, 130, 246, 0.12)"
                    : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isSelected ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.05)"}`,
                }}
              >
                <Monitor
                  className="h-3.5 w-3.5"
                  style={{ color: isSelected ? "#3B82F6" : "#FFFFFF" }}
                  strokeWidth={1.5}
                />
              </div>

              {/* Name + status */}
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <span
                  className="truncate text-[13px] font-medium tracking-tight"
                  style={{ color: isSelected ? "#E2E5EA" : "#A0A6B2" }}
                >
                  {device.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: isOnline ? "#22C55E" : "#6B7280",
                      boxShadow: isOnline ? "0 0 5px rgba(34, 197, 94, 0.4)" : "none",
                    }}
                  />
                  <span className="text-[10px] font-mono" style={{ color: isOnline ? "#4ADE80" : "#6B7280" }}>
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </span>
                  {device.os && (
                    <>
                      <span className="text-[10px]" style={{ color: "#2A2F38" }}>|</span>
                      <span className="text-[10px] font-mono" style={{ color: "#4B5563" }}>
                        {device.os}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-200"
                style={{
                  color: isSelected ? "#3B82F6" : "#2A2F38",
                  transform: isSelected ? "translateX(0)" : "translateX(-2px)",
                  opacity: isSelected ? 1 : 0,
                }}
                strokeWidth={2}
              />
            </button>
          )
        })}
      </nav>

      {/* Sidebar footer */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: "1px solid #1E232C" }}
      >
        <span className="text-[10px] font-mono" style={{ color: "#4B5563" }}>
          {connectedCount} of {devices.length} online
        </span>
        <span className="text-[10px] font-mono" style={{ color: "#2A2F38" }}>
          FLEET
        </span>
      </div>
    </aside>
  )
}
