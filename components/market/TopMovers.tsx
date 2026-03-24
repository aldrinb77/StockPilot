"use client"

import * as React from "react"
import { StockData, Signal } from "@/lib/types"
import { Sparkline } from "@/components/charts/Sparkline"
import { SignalBadge } from "@/components/signals/SignalBadge"
import { formatCurrency, formatPercent } from "@/lib/utils"
import Link from "next/link"
import { getMockHistoricalData } from "@/lib/mockData"
import { useStore } from "@/store/store"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { MARKETS } from "@/lib/markets"
import { ArrowRight, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface TopMoversProps {
  gainers: (StockData & { signal: Signal })[]
  losers: (StockData & { signal: Signal })[]
}

export function TopMovers({ gainers, losers }: TopMoversProps) {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      
      {/* Gainers */}
      <div className="glass-card rounded-2xl overflow-hidden animate-stagger">
        <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <h3 className="font-black text-lg text-white flex items-center tracking-tight">
            <span className="text-tvGreen mr-3 text-xl">📈</span> Top Gainers
          </h3>
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest bg-tvGreen/10 text-tvGreen px-2 py-0.5 rounded border border-tvGreen/20">24h Alpha</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left border-separate border-spacing-0">
            <thead className="text-[10px] text-gray-500 uppercase font-black tracking-widest bg-white/[0.01]">
              <tr>
                <th className="px-6 py-4 font-black">Asset</th>
                <th className="px-6 py-4 font-black text-right">Price</th>
                <th className="px-6 py-4 font-black text-right">Momentum</th>
                <th className="px-6 py-4 font-black text-center w-[100px]">Micro Trend</th>
                <th className="px-6 py-4 font-black text-right">Indicator</th>
              </tr>
            </thead>
            <tbody>
              {gainers.map((stock, i) => (
                <tr key={stock.symbol} className="group border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer">
                  <td className="px-6 py-4 relative">
                    <Link href={`/stock/${stock.symbol}`} className="flex flex-col relative z-10">
                      <div className="flex items-center space-x-2">
                         <span className="font-black text-white group-hover:text-tvGreen transition-colors">{stock.symbol}</span>
                         <ArrowRight className="w-3.5 h-3.5 text-tvGreen opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[80px] group-hover:text-gray-400">{stock.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-white whitespace-nowrap">
                    <AnimatedNumber value={stock.price} prefix={marketConfig.currencySymbol} decimals={2} />
                  </td>
                  <td className="px-6 py-4 text-right font-black text-tvGreen whitespace-nowrap">
                    +<AnimatedNumber value={stock.changePercent} suffix="%" decimals={2} />
                  </td>
                  <td className="px-6 py-2 text-center w-[100px]">
                    <div className="inline-block transition-transform group-hover:scale-110">
                      <Sparkline data={getMockHistoricalData(stock.price).map(d => d.close).slice(-20)} color="#10B981" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SignalBadge type={stock.signal.type} className="scale-75 origin-right font-black" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Losers */}
      <div className="glass-card rounded-2xl overflow-hidden animate-stagger" style={{ animationDelay: '100ms' }}>
        <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <h3 className="font-black text-lg text-white flex items-center tracking-tight">
            <span className="text-tvRed mr-3 text-xl">📉</span> Top Losers
          </h3>
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest bg-tvRed/10 text-tvRed px-2 py-0.5 rounded border border-tvRed/20">Bearish Pressure</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left border-separate border-spacing-0">
            <thead className="text-[10px] text-gray-500 uppercase font-black tracking-widest bg-white/[0.01]">
              <tr>
                <th className="px-6 py-4 font-black">Asset</th>
                <th className="px-6 py-4 font-black text-right">Price</th>
                <th className="px-6 py-4 font-black text-right">Momentum</th>
                <th className="px-6 py-4 font-black text-center w-[100px]">Micro Trend</th>
                <th className="px-6 py-4 font-black text-right">Indicator</th>
              </tr>
            </thead>
            <tbody>
              {losers.map((stock, i) => (
                <tr key={stock.symbol} className="group border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer">
                  <td className="px-6 py-4 relative">
                    <Link href={`/stock/${stock.symbol}`} className="flex flex-col relative z-10">
                      <div className="flex items-center space-x-2">
                         <span className="font-black text-white group-hover:text-tvRed transition-colors">{stock.symbol}</span>
                         <ArrowRight className="w-3.5 h-3.5 text-tvRed opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[80px] group-hover:text-gray-400">{stock.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-white whitespace-nowrap">
                    <AnimatedNumber value={stock.price} prefix={marketConfig.currencySymbol} decimals={2} />
                  </td>
                  <td className="px-6 py-4 text-right font-black text-tvRed whitespace-nowrap">
                    <AnimatedNumber value={stock.changePercent} suffix="%" decimals={2} />
                  </td>
                  <td className="px-6 py-2 text-center w-[100px]">
                    <div className="inline-block transition-transform group-hover:scale-110">
                      <Sparkline data={getMockHistoricalData(stock.price).map(d => d.close).slice(-20)} color="#ef4444" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SignalBadge type={stock.signal.type} className="scale-75 origin-right font-black" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}


