"use client"

import React from 'react'
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"
import { useAppMode } from "@/hooks/useAppMode"
import { OHLCV } from '@/lib/types'

interface StockChartProps {
  symbol: string
  data?: OHLCV[]
  onTimeframeChange?: (tf: string) => void
}

export function StockChart({ symbol }: StockChartProps) {
  const { isGodMode, isLoaded } = useAppMode()

  return (
    <div className="flex flex-col h-full bg-[#1e222d] border border-gray-700/50 rounded-lg overflow-hidden relative min-h-[500px]">
      <div className="w-full h-full flex-1 relative z-0">
        <AdvancedRealTimeChart 
            theme="dark"
            symbol={symbol}
            width="100%"   
            autosize
            allow_symbol_change={false}
            hide_side_toolbar={false}
            toolbar_bg="#131722"
            container_id={`tradingview_${symbol}`}
        />
      </div>
      
      {isLoaded && !isGodMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-20 pointer-events-none">
          <span className="text-2xl font-bold font-heading text-white mix-blend-overlay uppercase tracking-widest text-shadow-xl drop-shadow-2xl">
            StoxPilot — Educational Use Only
          </span>
        </div>
      )}
      
      <div className="bg-[#131722] p-2 text-center text-[10px] text-gray-500 border-t border-gray-800 shrink-0 z-10 relative">
        Chart provided by TradingView. StoxPilot is not affiliated with TradingView.
      </div>
    </div>
  )
}
