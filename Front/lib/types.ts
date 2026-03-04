// ─── Device & Action Types ───────────────────────────────────────────────────
// These types are designed for direct backend integration.
// Replace the mock implementations in api.ts with real API calls.

export type DeviceStatus = "online" | "offline" | "idle"

export interface Device {
  id: string
  name: string
  status: DeviceStatus
  ip?: string
  os?: string
  lastSeen?: string
}

export type ActionType = "screenshot" | "camera" | "jump" | "ip" | "live-feed"

export interface ActionRequest {
  deviceId: string
  action: ActionType
  timestamp: number
}

export interface ActionResult {
  deviceId: string
  action: ActionType
  timestamp: number
  success: boolean
  data?: ScreenshotResult | CameraResult | IPResult | LiveFeedResult
  error?: string
}

export interface ScreenshotResult {
  type: "screenshot"
  imageUrl: string
  resolution: string
  capturedAt: string
}

export interface CameraResult {
  type: "camera"
  imageUrl: string
  capturedAt: string
}

export interface IPResult {
  type: "ip"
  localIp: string
  publicIp: string
  mac: string
  gateway: string
}

export interface LiveFeedResult {
  type: "live-feed"
  streamUrl: string
  status: "streaming" | "stopped" | "connecting"
}

export interface DeviceStats {
  ping: string
  cpu: string
  memory: string
  uptime: string
}
