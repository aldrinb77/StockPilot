"use client"

import React, { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, ColorType, CrosshairMode } from 'lightweight-charts'
import { OHLCV } from '@/lib/types'
import { calcEMA, calcSMA, calcBollingerBands } from '@/lib/indicators'

interface StockChartProps {
  symbol: string
  data: OHLCV[]
  onTimeframeChange?: (tf: string) => void
}

export function StockChart({ symbol, data, onTimeframeChange }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null)
  
  const [activeTimeframe, setActiveTimeframe] = useState('1Y')
  
  // Overlays
  const overlaysRef = useRef<Record<string, ISeriesApi<"Line"> | null>>({})
  const [showSMA20, setShowSMA20] = useState(false)
  const [showSMA50, setShowSMA50] = useState(false)
  const [showEMA200, setShowEMA200] = useState(false)
  const [showBB, setShowBB] = useState(false)

  // Format data for lightweight charts
  const chartData = data.map(d => ({
    time: d.time as any, // timestamp in seconds
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }))

  const volumeData = data.map(d => ({
    time: d.time as any,
    value: d.volume,
    color: d.close >= d.open ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)'
  }))

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: '#D1D4DC',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        timeVisible: true,
      },
      autoSize: true,
    })
    
    chartRef.current = chart

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26A69A',
      downColor: '#EF5350',
      borderVisible: false,
      wickUpColor: '#26A69A',
      wickDownColor: '#EF5350',
    })
    
    candlestickSeries.setData(chartData)
    seriesRef.current = candlestickSeries

    const histogramSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '', // set as an overlay
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    } as any)
    
    histogramSeries.setData(volumeData)
    volumeRef.current = histogramSeries

    chart.timeScale().fitContent()

    // Cleanup
    return () => {
      chart.remove()
    }
  }, [data]) // Re-init on hard data refresh

  // Handle overlay toggles
  useEffect(() => {
    if (!chartRef.current) return
    const chart = chartRef.current
    const closes = data.map(d => d.close)
    const times = data.map(d => d.time)

    // SMA 20
    if (showSMA20 && !overlaysRef.current['sma20']) {
      const smaData = calcSMA(closes, 20)
      const lineData = smaData.map((val, i) => ({ time: times[i + 19] as any, value: val }))
      const series = chart.addLineSeries({ color: '#2962FF', lineWidth: 2 })
      series.setData(lineData)
      overlaysRef.current['sma20'] = series
    } else if (!showSMA20 && overlaysRef.current['sma20']) {
      chart.removeSeries(overlaysRef.current['sma20'])
      overlaysRef.current['sma20'] = null
    }

    // SMA 50
    if (showSMA50 && !overlaysRef.current['sma50']) {
      const smaData = calcSMA(closes, 50)
      const lineData = smaData.map((val, i) => ({ time: times[i + 49] as any, value: val }))
      const series = chart.addLineSeries({ color: '#FF6D00', lineWidth: 2 })
      series.setData(lineData)
      overlaysRef.current['sma50'] = series
    } else if (!showSMA50 && overlaysRef.current['sma50']) {
      chart.removeSeries(overlaysRef.current['sma50'])
      overlaysRef.current['sma50'] = null
    }

    // EMA 200
    if (showEMA200 && !overlaysRef.current['ema200']) {
      const emaData = calcEMA(closes, 200)
      const lineData = emaData.map((val, i) => ({ time: times[i + 199] as any, value: val }))
      const series = chart.addLineSeries({ color: '#9C27B0', lineWidth: 2 })
      series.setData(lineData)
      overlaysRef.current['ema200'] = series
    } else if (!showEMA200 && overlaysRef.current['ema200']) {
      chart.removeSeries(overlaysRef.current['ema200'])
      overlaysRef.current['ema200'] = null
    }

    // Bollinger Bands (just an upper and lower outline for now)
    if (showBB && !overlaysRef.current['bb_u']) {
      const bbData = calcBollingerBands(closes)
      const upperLine = bbData.upper.map((val, i) => ({ time: times[i + 19] as any, value: val }))
      const lowerLine = bbData.lower.map((val, i) => ({ time: times[i + 19] as any, value: val }))
      
      const bbu = chart.addLineSeries({ color: 'rgba(120, 123, 134, 0.5)', lineWidth: 1, lineStyle: 2 })
      const bbl = chart.addLineSeries({ color: 'rgba(120, 123, 134, 0.5)', lineWidth: 1, lineStyle: 2 })
      
      bbu.setData(upperLine)
      bbl.setData(lowerLine)
      
      overlaysRef.current['bb_u'] = bbu
      overlaysRef.current['bb_l'] = bbl
    } else if (!showBB && overlaysRef.current['bb_u']) {
      chart.removeSeries(overlaysRef.current['bb_u']!)
      chart.removeSeries(overlaysRef.current['bb_l']!)
      overlaysRef.current['bb_u'] = null
      overlaysRef.current['bb_l'] = null
    }

  }, [showSMA20, showSMA50, showEMA200, showBB, data])

  return (
    <div className="flex flex-col h-full bg-[#1e222d] border border-gray-700/50 rounded-lg overflow-hidden">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#131722] border-b border-gray-700/50 flex-wrap gap-2">
        
        {/* Indicators */}
        <div className="flex space-x-2">
          <span className="text-gray-400 text-xs font-semibold self-center mr-2 uppercase">Indicators</span>
          <button 
            onClick={() => setShowSMA20(!showSMA20)}
            className={`px-2 py-1 text-xs rounded transition-colors ${showSMA20 ? 'bg-blue-600/20 text-blue-500' : 'text-gray-400 hover:bg-white/5'}`}
          >SMA 20</button>
          <button 
            onClick={() => setShowSMA50(!showSMA50)}
            className={`px-2 py-1 text-xs rounded transition-colors ${showSMA50 ? 'bg-orange-500/20 text-orange-500' : 'text-gray-400 hover:bg-white/5'}`}
          >SMA 50</button>
          <button 
            onClick={() => setShowEMA200(!showEMA200)}
            className={`px-2 py-1 text-xs rounded transition-colors ${showEMA200 ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-white/5'}`}
          >EMA 200</button>
          <button 
            onClick={() => setShowBB(!showBB)}
            className={`px-2 py-1 text-xs rounded transition-colors ${showBB ? 'bg-gray-400/20 text-gray-300' : 'text-gray-400 hover:bg-white/5'}`}
          >BB</button>
        </div>

        {/* Timeframes */}
        <div className="flex space-x-1 border border-gray-700/50 rounded p-0.5 bg-black/20">
          {['1D', '1W', '1M', '3M', '6M', '1Y'].map(tf => (
            <button
              key={tf}
              onClick={() => {
                setActiveTimeframe(tf)
                if (onTimeframeChange) onTimeframeChange(tf)
              }}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${activeTimeframe === tf ? 'bg-tvGreen text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div ref={chartContainerRef} className="w-full flex-1 relative min-h-[400px]" />
    </div>
  )
}
