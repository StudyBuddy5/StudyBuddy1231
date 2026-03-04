"use client"

import { useState, useCallback } from "react"
import {
  Monitor,
  Camera,
  ArrowUpRight,
  Globe,
  Image,
  Video,
  Loader2,
  Copy,
  Check,
  X,
  Download,
  Maximize2,
  Clock,
  Square,
} from "lucide-react"
import type { Device, ActionResult, ScreenshotResult, CameraResult, IPResult, LiveFeedResult } from "@/lib/types"
import * as api from "@/lib/api"

interface DevicePanelProps {
  device: Device
}

type PanelView = "idle" | "loading" | "screenshot" | "camera" | "ip" | "live-feed" | "jump" | "error"

export function DevicePanel({ device }: DevicePanelProps) {
  const [view, setView] = useState<PanelView>("idle")
  const [result, setResult] = useState<ActionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const isOnline = device.status === "online"

  const executeAction = useCallback(
    async (
      actionName: string,
      viewType: PanelView,
      apiCall: () => Promise<ActionResult>
    ) => {
      if (!isOnline) return
      setLoadingAction(actionName)
      setView("loading")
      setError(null)
      try {
        const res = await apiCall()
        if (res.success) {
          setResult(res)
          setView(viewType)
        } else {
          setError(res.error || "Action failed")
          setView("error")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        setView("error")
      } finally {
        setLoadingAction(null)
      }
    },
    [isOnline]
  )

  const handleScreenshot = () =>
    executeAction("screenshot", "screenshot", () => api.takeScreenshot(device.id))

  const handleCamera = () =>
    executeAction("camera", "camera", () => api.takeCameraPhoto(device.id))

  const handleIP = () =>
    executeAction("ip", "ip", () => api.getIPAddress(device.id))

  const handleLiveFeed = () =>
    executeAction("live-feed", "live-feed", () => api.startLiveFeed(device.id))

  const handleJump = () =>
    executeAction("jump", "jump", () => api.jumpToDevice(device.id))

  const handleStopFeed = async () => {
    setLoadingAction("stop-feed")
    try {
      await api.stopLiveFeed(device.id)
      setView("idle")
      setResult(null)
    } catch {
      // silently fail
    } finally {
      setLoadingAction(null)
    }
  }

  const handleClear = () => {
    setView("idle")
    setResult(null)
    setError(null)
  }

  const actions = [
    { key: "screenshot", label: "Screenshot", icon: Image, handler: handleScreenshot },
    { key: "camera", label: "Camera", icon: Camera, handler: handleCamera },
    { key: "ip", label: "IP Address", icon: Globe, handler: handleIP },
    { key: "live-feed", label: "Live Feed", icon: Video, handler: handleLiveFeed },
    { key: "jump", label: "Jump (RDP)", icon: ArrowUpRight, handler: handleJump },
  ]

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Panel header */}
      <div
        className="flex shrink-0 items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #1E232C" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <Monitor className="h-4 w-4" style={{ color: "#3B82F6" }} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h2
              className="text-sm font-semibold tracking-tight"
              style={{ color: "#E2E5EA" }}
            >
              {device.name}
            </h2>
            <div className="flex items-center gap-2">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: isOnline ? "#22C55E" : "#6B7280",
                  boxShadow: isOnline ? "0 0 6px rgba(34, 197, 94, 0.4)" : "none",
                }}
              />
              <span className="text-[11px] font-mono" style={{ color: isOnline ? "#4ADE80" : "#6B7280" }}>
                {isOnline ? "CONNECTED" : "OFFLINE"}
              </span>
              {device.ip && (
                <>
                  <span style={{ color: "#2A2F38" }}>|</span>
                  <span className="text-[11px] font-mono" style={{ color: "#4B5563" }}>
                    {device.ip}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Clear button when viewing a result */}
        {view !== "idle" && view !== "loading" && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-colors duration-150"
            style={{
              background: "rgba(28, 32, 40, 0.5)",
              border: "1px solid #2A2F38",
              color: "#6B7280",
            }}
          >
            <X className="h-3 w-3" strokeWidth={2} />
            Clear
          </button>
        )}
      </div>

      {/* Action buttons bar */}
      <div
        className="flex shrink-0 items-center gap-2 overflow-x-auto px-6 py-3"
        style={{ borderBottom: "1px solid #1A1E26" }}
      >
        {actions.map(({ key, label, icon: Icon, handler }) => {
          const isActive = loadingAction === key
          const isCurrentView = view === key
          return (
            <button
              key={key}
              onClick={handler}
              disabled={!isOnline || !!loadingAction}
              className="flex shrink-0 items-center gap-2 rounded-md px-4 py-2.5 text-xs font-medium tracking-wide transition-all duration-200"
              style={{
                background: isCurrentView
                  ? "rgba(59, 130, 246, 0.12)"
                  : "rgba(28, 32, 40, 0.5)",
                border: `1px solid ${isCurrentView ? "rgba(59, 130, 246, 0.35)" : "#2A2F38"}`,
                color: isCurrentView ? "#3B82F6" : isOnline ? "#A0A6B2" : "#4B5563",
                cursor: isOnline && !loadingAction ? "pointer" : "not-allowed",
                opacity: !isOnline ? 0.4 : 1,
              }}
            >
              {isActive ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              ) : (
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              )}
              {label}
            </button>
          )
        })}
      </div>

      {/* Viewport / Display Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {view === "idle" && <IdleView deviceName={device.name} isOnline={isOnline} />}
        {view === "loading" && <LoadingView action={loadingAction || "action"} />}
        {view === "screenshot" && result?.data && (
          <ImageView result={result.data as ScreenshotResult} label="Screenshot" onRetake={handleScreenshot} />
        )}
        {view === "camera" && result?.data && (
          <ImageView result={result.data as CameraResult} label="Camera Capture" onRetake={handleCamera} />
        )}
        {view === "ip" && result?.data && <IPView result={result.data as IPResult} />}
        {(view === "live-feed" || view === "jump") && result?.data && (
          <LiveFeedView
            result={result.data as LiveFeedResult}
            label={view === "jump" ? "Remote Session (RDP/VNC)" : "Live Camera Feed"}
            onStop={handleStopFeed}
            isStoppingFeed={loadingAction === "stop-feed"}
          />
        )}
        {view === "error" && <ErrorView message={error || "Unknown error"} onRetry={handleClear} />}
      </div>
    </div>
  )
}

// ─── Sub-views ──────────────────────────────────────────────────────────────

function IdleView({ deviceName, isOnline }: { deviceName: string; isOnline: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          width: "72px",
          height: "72px",
          background: "rgba(28, 32, 40, 0.4)",
          border: "1px solid #1E232C",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
        }}
      >
        <Monitor className="h-8 w-8" style={{ color: "#2A2F38" }} strokeWidth={1} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-medium" style={{ color: "#4B5563" }}>
          {deviceName}
        </span>
        <span className="text-xs font-mono" style={{ color: "#2A2F38" }}>
          {isOnline ? "Select an action above to interact with this device" : "Device is offline"}
        </span>
      </div>
    </div>
  )
}

function LoadingView({ action }: { action: string }) {
  const labels: Record<string, string> = {
    screenshot: "Capturing screenshot...",
    camera: "Capturing camera photo...",
    ip: "Fetching network info...",
    "live-feed": "Starting live feed...",
    jump: "Establishing remote connection...",
  }
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="relative">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: "72px",
            height: "72px",
            background: "rgba(59, 130, 246, 0.06)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
          }}
        >
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#3B82F6" }} strokeWidth={1.5} />
        </div>
      </div>
      <span className="text-sm font-mono" style={{ color: "#6B7280" }}>
        {labels[action] || "Processing..."}
      </span>
    </div>
  )
}

function ImageView({
  result,
  label,
  onRetake,
}: {
  result: ScreenshotResult | CameraResult
  label: string
  onRetake: () => void
}) {
  const capturedAt = new Date(result.capturedAt)
  const timeStr = capturedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Image toolbar */}
      <div
        className="flex shrink-0 items-center justify-between px-6 py-2"
        style={{ borderBottom: "1px solid #1A1E26" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono tracking-wider uppercase" style={{ color: "#4B5563" }}>
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" style={{ color: "#2A2F38" }} strokeWidth={1.5} />
            <span className="text-[11px] font-mono" style={{ color: "#4B5563" }}>
              {timeStr}
            </span>
          </div>
          {"resolution" in result && (
            <span className="text-[11px] font-mono" style={{ color: "#2A2F38" }}>
              {(result as ScreenshotResult).resolution}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <SmallActionBtn icon={<Download className="h-3.5 w-3.5" />} label="Download" />
          <SmallActionBtn icon={<Maximize2 className="h-3.5 w-3.5" />} label="Fullscreen" />
          <SmallActionBtn icon={<Image className="h-3.5 w-3.5" />} label="Retake" onClick={onRetake} />
        </div>
      </div>

      {/* Image display */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-6">
        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            border: "1px solid #1E232C",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.02)",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.imageUrl}
            alt={label}
            className="block"
            crossOrigin="anonymous"
            style={{
              maxWidth: "100%",
              maxHeight: "calc(100vh - 320px)",
              objectFit: "contain",
            }}
          />
          {/* Scanline overlay for tactical feel */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
            }}
          />
        </div>
      </div>
    </div>
  )
}

function IPView({ result }: { result: IPResult }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (value: string, key: string) => {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const fields = [
    { key: "local", label: "Local IP", value: result.localIp },
    { key: "public", label: "Public IP", value: result.publicIp },
    { key: "mac", label: "MAC Address", value: result.mac },
    { key: "gateway", label: "Gateway", value: result.gateway },
  ]

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <div
        className="w-full max-w-md rounded-xl"
        style={{
          background: "#0C0E12",
          border: "1px solid #1E232C",
          boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        {/* Title */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <Globe className="h-4 w-4" style={{ color: "#3B82F6" }} strokeWidth={1.5} />
          <span className="text-xs font-mono tracking-wider uppercase" style={{ color: "#6B7280" }}>
            Network Information
          </span>
        </div>

        {/* Divider */}
        <div className="mx-4" style={{ height: "1px", background: "#1E232C" }} />

        {/* Fields */}
        <div className="flex flex-col gap-0 px-2 py-2">
          {fields.map(({ key, label, value }) => (
            <div
              key={key}
              className="group flex items-center justify-between rounded-lg px-3 py-3 transition-colors duration-150"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
            >
              <span className="text-xs font-mono tracking-wider uppercase" style={{ color: "#4B5563" }}>
                {label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-medium" style={{ color: "#E2E5EA" }}>
                  {value}
                </span>
                <button
                  onClick={() => copyToClipboard(value, key)}
                  className="flex items-center justify-center rounded transition-colors duration-150"
                  style={{
                    width: "24px",
                    height: "24px",
                    color: copied === key ? "#22C55E" : "#4B5563",
                  }}
                  aria-label={`Copy ${label}`}
                >
                  {copied === key ? (
                    <Check className="h-3 w-3" strokeWidth={2} />
                  ) : (
                    <Copy className="h-3 w-3" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LiveFeedView({
  result,
  label,
  onStop,
  isStoppingFeed,
}: {
  result: LiveFeedResult
  label: string
  onStop: () => void
  isStoppingFeed: boolean
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Feed toolbar */}
      <div
        className="flex shrink-0 items-center justify-between px-6 py-2"
        style={{ borderBottom: "1px solid #1A1E26" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ background: "#EF4444", boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)" }}
            />
            <span className="text-[11px] font-mono tracking-wider uppercase" style={{ color: "#EF4444" }}>
              LIVE
            </span>
          </div>
          <span className="text-[11px] font-mono" style={{ color: "#4B5563" }}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <SmallActionBtn icon={<Maximize2 className="h-3.5 w-3.5" />} label="Fullscreen" />
          <SmallActionBtn icon={<Image className="h-3.5 w-3.5" />} label="Snapshot" />
          <button
            onClick={onStop}
            disabled={isStoppingFeed}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-colors duration-150"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#EF4444",
            }}
          >
            {isStoppingFeed ? (
              <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
            ) : (
              <Square className="h-3 w-3" strokeWidth={2} />
            )}
            Stop
          </button>
        </div>
      </div>

      {/* Feed viewport */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
        <div
          className="relative flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg"
          style={{
            background: "#0A0C0F",
            border: "1px solid #1E232C",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          {result.status === "streaming" && result.streamUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={result.streamUrl}
              alt="Live Screen Feed"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Video className="h-12 w-12" style={{ color: "#1E232C" }} strokeWidth={1} />
              <span className="text-xs font-mono" style={{ color: "#2A2F38" }}>
                Feed stopped
              </span>
            </div>
          )}

          {/* Scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
            }}
          />

          {/* Corner brackets for tactical feel */}
          <CornerBracket position="top-left" />
          <CornerBracket position="top-right" />
          <CornerBracket position="bottom-left" />
          <CornerBracket position="bottom-right" />
        </div>
      </div>
    </div>
  )
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          width: "72px",
          height: "72px",
          background: "rgba(239, 68, 68, 0.06)",
          border: "1px solid rgba(239, 68, 68, 0.15)",
        }}
      >
        <X className="h-8 w-8" style={{ color: "#EF4444" }} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-medium" style={{ color: "#EF4444" }}>
          Action Failed
        </span>
        <span className="text-xs font-mono" style={{ color: "#6B7280" }}>
          {message}
        </span>
      </div>
      <button
        onClick={onRetry}
        className="rounded-md px-4 py-2 text-xs font-medium transition-colors duration-150"
        style={{
          background: "rgba(28, 32, 40, 0.5)",
          border: "1px solid #2A2F38",
          color: "#A0A6B2",
        }}
      >
        Dismiss
      </button>
    </div>
  )
}

// ─── Small helpers ──────────────────────────────────────────────────────────

function SmallActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-md transition-colors duration-150"
      style={{
        width: "28px",
        height: "28px",
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

function CornerBracket({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const size = 16
  const isTop = position.includes("top")
  const isLeft = position.includes("left")

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        [isTop ? "top" : "bottom"]: "8px",
        [isLeft ? "left" : "right"]: "8px",
        width: `${size}px`,
        height: `${size}px`,
        borderColor: "rgba(59, 130, 246, 0.3)",
        borderStyle: "solid",
        borderWidth: "0",
        ...(isTop && isLeft ? { borderTopWidth: "1px", borderLeftWidth: "1px" } : {}),
        ...(isTop && !isLeft ? { borderTopWidth: "1px", borderRightWidth: "1px" } : {}),
        ...(!isTop && isLeft ? { borderBottomWidth: "1px", borderLeftWidth: "1px" } : {}),
        ...(!isTop && !isLeft ? { borderBottomWidth: "1px", borderRightWidth: "1px" } : {}),
      }}
    />
  )
}
