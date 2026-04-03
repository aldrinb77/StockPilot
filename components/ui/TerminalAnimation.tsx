"use client"

import { useEffect, useRef } from "react"

export function TerminalAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800
      canvas.height = canvas.parentElement?.clientHeight || 450
    }

    const chars = "0123456789ABCDEF/\\|+=-_$%#@!&*[]{}<>"
    const fontSize = 12
    const columns = Math.ceil(canvas.width / fontSize)
    const drops: number[] = new Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = "rgba(6, 10, 19, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px JetBrains Mono`
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length))
        
        // Varying colors for high-tech look
        const r = Math.random()
        if (r > 0.95) ctx.fillStyle = "#00e676" // Success green
        else if (r > 0.90) ctx.fillStyle = "#2979ff" // Info blue
        else ctx.fillStyle = "rgba(255, 255, 255, 0.05)" // Dim data
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    window.addEventListener("resize", resize)
    resize()
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-40 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-transparent to-[#060a13] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060a13] via-transparent to-[#060a13] pointer-events-none" />
    </div>
  )
}
