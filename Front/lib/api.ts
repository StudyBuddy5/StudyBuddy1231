// ─── API Service Layer ───────────────────────────────────────────────────────
// All calls hit the real FastAPI backend at Back/api_server.py.
// No mock data — every response comes from the live server.

import type {
  Device,
  ActionResult,
  DeviceStats,
} from "./types"

// ─── Base URL ────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// ─── Devices ─────────────────────────────────────────────────────────────────

export async function fetchDevices(): Promise<Device[]> {
  const res = await fetch(`${API_BASE}/api/devices`)
  if (!res.ok) throw new Error("Failed to fetch devices")
  return res.json()
}

export async function fetchDeviceStats(deviceId: string): Promise<DeviceStats> {
  const res = await fetch(`${API_BASE}/api/devices/${deviceId}/stats`)
  if (!res.ok) throw new Error("Failed to fetch device stats")
  return res.json()
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function takeScreenshot(deviceId: string): Promise<ActionResult> {
  const res = await fetch(`${API_BASE}/api/devices/${deviceId}/screenshot`, { method: "POST" })
  if (!res.ok) throw new Error("Screenshot failed")
  return res.json()
}

export async function takeCameraPhoto(deviceId: string): Promise<ActionResult> {
  const res = await fetch(`${API_BASE}/api/devices/${deviceId}/camera`, { method: "POST" })
  if (!res.ok) throw new Error("Camera capture failed")
  return res.json()
}

export async function getIPAddress(deviceId: string): Promise<ActionResult> {
  const res = await fetch(`${API_BASE}/api/devices/${deviceId}/ip`)
  if (!res.ok) throw new Error("IP lookup failed")
  return res.json()
}

export async function startLiveFeed(deviceId: string): Promise<ActionResult> {
  const res = await fetch(`${API_BASE}/api/devices/${deviceId}/live-feed`, { method: "POST" })
  if (!res.ok) throw new Error("Live feed failed to start")
  return res.json()
}

export async function stopLiveFeed(deviceId: string): Promise<ActionResult> {
  const res = await fetch(`${API_BASE}/api/devices/${deviceId}/live-feed`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to stop live feed")
  return res.json()
}

export async function jumpToDevice(deviceId: string): Promise<ActionResult> {
  const res = await fetch(`${API_BASE}/api/devices/${deviceId}/jump`, { method: "POST" })
  if (!res.ok) throw new Error("Jump (RDP/VNC) failed")
  return res.json()
}
