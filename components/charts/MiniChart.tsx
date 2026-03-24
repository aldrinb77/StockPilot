"use client"

import React, { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

interface MiniChartProps {
  data: number[] // just close prices
  isPositive: boolean
}

export function MiniChart({ data, isPositive }: MiniChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return

    const color = isPositive ? '#26A69A' : '#EF5350'
    const chart = createChart(chartContainerRef.current, {
      width: 100,
      height: 40,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'transparent',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      crosshair: {
        mode: 0,
        horzLine: { visible: false, labelVisible: false },
        vertLine: { visible: false, labelVisible: false },
      },
      handleScroll: false,
      handleScale: false,
    })

    const lineSeries = chart.addLineSeries({
      color,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    })

    const chartData = data.map((val, i) => ({ time: i as any, value: val }))
    lineSeries.setData(chartData)
    chart.timeScale().fitContent()

    return () => {
      chart.remove()
    }
  }, [data, isPositive])

  return (
    <div ref={chartContainerRef} className="w-[100px] h-[40px]" />
  )
}
