"use client"

import * as React from "react"
import { StockData, Signal } from "@/lib/types"
import { MiniChart } from "@/components/charts/MiniChart"
import { SignalBadge } from "@/components/signals/SignalBadge"
import { formatCurrency, formatPercent } from "@/lib/utils"
import Link from "next/link"
import { getMockHistoricalData } from "@/lib/mockData"

interface TopMoversProps {
  gainers: (StockData & { signal: Signal })[]
  losers: (StockData & { signal: Signal })[]
}

export function TopMovers({ gainers, losers }: TopMoversProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      
      {/* Gainers */}
      <div className="bg-[#1E222D] rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700/50 bg-[#131722]/50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-white flex items-center"><span className="text-tvGreen mr-2">📈</span> Top Gainers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-[#131722]/80 border-b border-gray-700/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Symbol</th>
                <th className="px-4 py-3 font-semibold text-right">Price</th>
                <th className="px-4 py-3 font-semibold text-right">Change</th>
                <th className="px-4 py-3 font-semibold text-center w-[120px]">Chart</th>
                <th className="px-4 py-3 font-semibold text-right">Signal</th>
              </tr>
            </thead>
            <tbody>
              {gainers.map((stock, i) => (
                <tr key={i} className="border-b border-gray-700/20 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/stock/${stock.symbol}`} className="font-bold text-white hover:text-tvGreen flex flex-col">
                      <span>{stock.symbol}</span>
                      <span className="text-xs text-gray-500 font-normal truncate max-w-[100px]">{stock.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-white">{formatCurrency(stock.price)}</td>
                  <td className="px-4 py-3 text-right font-medium text-tvGreen">+{formatPercent(stock.changePercent)}</td>
                  <td className="px-4 py-1 text-center w-[120px]">
                    <div className="inline-block pointer-events-none opacity-80">
                      <MiniChart data={getMockHistoricalData(stock.price).map(d => d.close).slice(-30)} isPositive={true} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <SignalBadge type={stock.signal.type} className="scale-90 origin-right" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Losers */}
      <div className="bg-[#1E222D] rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700/50 bg-[#131722]/50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-white flex items-center"><span className="text-tvRed mr-2">📉</span> Top Losers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-[#131722]/80 border-b border-gray-700/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Symbol</th>
                <th className="px-4 py-3 font-semibold text-right">Price</th>
                <th className="px-4 py-3 font-semibold text-right">Change</th>
                <th className="px-4 py-3 font-semibold text-center w-[120px]">Chart</th>
                <th className="px-4 py-3 font-semibold text-right">Signal</th>
              </tr>
            </thead>
            <tbody>
              {losers.map((stock, i) => (
                <tr key={i} className="border-b border-gray-700/20 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/stock/${stock.symbol}`} className="font-bold text-white hover:text-tvRed flex flex-col">
                      <span>{stock.symbol}</span>
                      <span className="text-xs text-gray-500 font-normal truncate max-w-[100px]">{stock.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-white">{formatCurrency(stock.price)}</td>
                  <td className="px-4 py-3 text-right font-medium text-tvRed">{formatPercent(stock.changePercent)}</td>
                  <td className="px-4 py-1 text-center w-[120px]">
                    <div className="inline-block pointer-events-none opacity-80">
                      <MiniChart data={getMockHistoricalData(stock.price).map(d => d.close).slice(-30)} isPositive={false} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <SignalBadge type={stock.signal.type} className="scale-90 origin-right" />
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
