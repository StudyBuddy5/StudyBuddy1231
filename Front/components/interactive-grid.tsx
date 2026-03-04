"use client"

import { useRef, useEffect, useCallback } from "react"

const GRID_SPACING = 48
const WARP_RADIUS = 160
const WARP_STRENGTH = 14
const GLOW_RADIUS = 120

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }

    ctx.clearRect(0, 0, w, h)

    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    const cols = Math.ceil(w / GRID_SPACING) + 2
    const rows = Math.ceil(h / GRID_SPACING) + 2

    // Precompute warped positions
    const getWarpedPos = (gx: number, gy: number) => {
      const dx = gx - mx
      const dy = gy - my
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < WARP_RADIUS && dist > 0) {
        const force = (1 - dist / WARP_RADIUS) * WARP_STRENGTH
        const angle = Math.atan2(dy, dx)
        return {
          x: gx - Math.cos(angle) * force,
          y: gy - Math.sin(angle) * force,
        }
      }
      return { x: gx, y: gy }
    }

    // Draw vertical lines (as warped paths)
    for (let c = 0; c < cols; c++) {
      const baseX = c * GRID_SPACING
      ctx.beginPath()
      for (let r = 0; r < rows; r++) {
        const baseY = r * GRID_SPACING
        const pos = getWarpedPos(baseX, baseY)
        if (r === 0) ctx.moveTo(pos.x, pos.y)
        else ctx.lineTo(pos.x, pos.y)
      }
      ctx.strokeStyle = "#1A1E26"
      ctx.lineWidth = 0.6
      ctx.stroke()
    }

    // Draw horizontal lines (as warped paths)
    for (let r = 0; r < rows; r++) {
      const baseY = r * GRID_SPACING
      ctx.beginPath()
      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING
        const pos = getWarpedPos(baseX, baseY)
        if (c === 0) ctx.moveTo(pos.x, pos.y)
        else ctx.lineTo(pos.x, pos.y)
      }
      ctx.strokeStyle = "#1A1E26"
      ctx.lineWidth = 0.6
      ctx.stroke()
    }

    // Draw glow at intersections near cursor
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const baseX = c * GRID_SPACING
        const baseY = r * GRID_SPACING
        const dx = baseX - mx
        const dy = baseY - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < GLOW_RADIUS) {
          const intensity = 1 - dist / GLOW_RADIUS
          const pos = getWarpedPos(baseX, baseY)
          const gradient = ctx.createRadialGradient(
            pos.x, pos.y, 0,
            pos.x, pos.y, 6 + intensity * 8
          )
          gradient.addColorStop(0, `rgba(200, 122, 58, ${intensity * 0.6})`)
          gradient.addColorStop(1, `rgba(200, 122, 58, 0)`)
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, 6 + intensity * 8, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          // Dot at intersection
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, 1.2 + intensity * 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 122, 58, ${intensity * 0.9})`
          ctx.fill()
        }
      }
    }

    animationRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseleave", handleLeave)

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseleave", handleLeave)
      cancelAnimationFrame(animationRef.current)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
