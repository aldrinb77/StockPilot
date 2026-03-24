"use client"

import { useStore } from "@/store/store"
import { PortfolioItem } from "@/lib/types"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { useState } from "react"
import { MOCK_STOCKS } from "@/lib/mockData"

export function PortfolioTable() {
  const { portfolio, removeFromPortfolio, selectedMarket } = useStore()
  
  if (portfolio.length === 0) return null
  
  // Hydrate LIVE prices (Mocked for MVP)
  const rows = portfolio.map(p => {
    const liveStock = MOCK_STOCKS.find(s => s.symbol === p.symbol) || { 
      symbol: p.symbol,
      price: p.buyPrice * (1 + (Math.random() * 0.1 - 0.05)), // Mock slight change
      name: p.name
    }
    const currentPrice = liveStock.price || p.buyPrice
    const totalValue = currentPrice * p.quantity
    const investment = p.buyPrice * p.quantity
    const pnl = totalValue - investment
    const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0
    
    return { ...p, currentPrice, totalValue, pnl, pnlPercent }
  })
  
  return (
    <div className="bg-[#1E222D] rounded-xl border border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-[#131722]/80 border-b border-gray-700/50">
            <tr>
              <th className="px-5 py-4 font-semibold">Symbol</th>
              <th className="px-5 py-4 font-semibold text-right">Shares</th>
              <th className="px-5 py-4 font-semibold text-right">Entry Price</th>
              <th className="px-5 py-4 font-semibold text-right">Current Price</th>
              <th className="px-5 py-4 font-semibold text-right">Total Value</th>
              <th className="px-5 py-4 font-semibold text-right">P&L</th>
              <th className="px-5 py-4 font-semibold text-center w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const profit = row.pnl >= 0
              return (
                <tr key={row.id} className="border-b border-gray-700/20 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-white text-base">{row.symbol}</div>
                    <div className="text-xs text-gray-500 font-normal truncate max-w-[120px]">{row.name}</div>
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-white">{row.quantity}</td>
                  <td className="px-5 py-4 text-right font-medium text-gray-400">{formatCurrency(row.buyPrice, selectedMarket)}</td>
                  <td className="px-5 py-4 text-right font-medium text-white">{formatCurrency(row.currentPrice, selectedMarket)}</td>
                  <td className="px-5 py-4 text-right font-medium text-white">{formatCurrency(row.totalValue, selectedMarket)}</td>
                  <td className={`px-5 py-4 text-right font-bold ${profit ? 'text-tvGreen' : 'text-tvRed'}`}>
                    <div className="flex flex-col items-end">
                      <span>{profit ? '+' : ''}{formatCurrency(row.pnl, selectedMarket)}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-white/5 mt-1 border border-white/5">
                        {profit ? '+' : ''}{row.pnlPercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button 
                      onClick={() => removeFromPortfolio(row.id)}
                      className="text-gray-500 hover:text-tvRed transition-colors p-2 rounded-md hover:bg-tvRed/10 border border-transparent hover:border-tvRed/20"
                      title="Remove position"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
