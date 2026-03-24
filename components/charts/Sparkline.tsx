"use client"

import { useMemo } from "react"

export function Sparkline({ 
  data, 
  color = "#10B981", 
  width = 80, 
  height = 32 
}: { 
  data: number[], 
  color?: string, 
  width?: number, 
  height?: number 
}) {
  const points = useMemo(() => {
    if (!data.length) return ""
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((val - min) / range) * height
      return `${x},${y}`
    }).join(" ")
  }, [data, width, height])

  const gradientId = useMemo(() => `spark-grad-${Math.random().toString(36).substr(2, 9)}`, [])

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M ${points.split(" ")[0]} L ${points} L ${width},${height} L 0,${height} Z`}
        fill={`url(#${gradientId})`}
        stroke="none"
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="animate-draw"
      />
    </svg>
  )
}
