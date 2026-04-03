"use client"

import { useStore } from "@/store/store"
import { PortfolioItem } from "@/lib/types"
import { formatCurrency, formatPercent } from "@/lib/utils"

interface PortfolioTableProps {
  livePrices: Record<string, number>
}

export function PortfolioTable({ livePrices }: PortfolioTableProps) {
  const { portfolio, sellStock, selectedMarket } = useStore()
  
  if (portfolio.length === 0) return null
  
  const rows = portfolio.map(p => {
    const currentPrice = livePrices[p.symbol] || p.buyPrice
    const totalValue = currentPrice * p.quantity
    const investment = p.buyPrice * p.quantity
    const pnl = totalValue - investment
    const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0
    
    return { ...p, currentPrice, totalValue, pnl, pnlPercent }
  })
  
  return (
    <div className="bg-[#0b1120]/40 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left border-separate border-spacing-0">
          <thead className="text-[10px] text-gray-500 uppercase bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-8 py-6 font-black tracking-widest">Asset</th>
              <th className="px-8 py-6 font-black tracking-widest text-right">Shares</th>
              <th className="px-8 py-6 font-black tracking-widest text-right">Avg Entry</th>
              <th className="px-8 py-6 font-black tracking-widest text-right">Current Price</th>
              <th className="px-8 py-6 font-black tracking-widest text-right">Market Value</th>
              <th className="px-8 py-6 font-black tracking-widest text-right">P&L Status</th>
              <th className="px-8 py-6 font-black tracking-widest text-center">Execute Exit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const profit = row.pnl >= 0
              return (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-black text-white text-lg tracking-tighter group-hover:text-tvBlue transition-colors">{row.symbol}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate max-w-[150px]">{row.name}</div>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-white font-mono">{row.quantity.toFixed(2)}</td>
                  <td className="px-8 py-6 text-right font-black text-gray-500 font-mono">{formatCurrency(row.buyPrice, selectedMarket)}</td>
                  <td className="px-8 py-6 text-right font-black text-white font-mono">{formatCurrency(row.currentPrice, selectedMarket)}</td>
                  <td className="px-8 py-6 text-right font-black text-white font-mono">{formatCurrency(row.totalValue, selectedMarket)}</td>
                  <td className={`px-8 py-6 text-right font-black ${profit ? 'text-tvGreen' : 'text-tvRed'}`}>
                    <div className="flex flex-col items-end">
                      <span className="font-mono">{profit ? '+' : ''}{formatCurrency(row.pnl, selectedMarket)}</span>
                      <span className={cn("text-[9px] px-2 py-0.5 rounded-full mt-2 font-black tracking-widest", profit ? 'bg-tvGreen/10 border border-tvGreen/20' : 'bg-tvRed/10 border border-tvRed/20')}>
                        {profit ? '+' : ''}{row.pnlPercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => sellStock(row.id, row.currentPrice)}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-tvRed/20 hover:text-tvRed border border-white/10 hover:border-tvRed/30 rounded-xl transition-all active:scale-90"
                    >
                      Sell Asset
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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
