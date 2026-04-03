"use client"

import { StockData, Signal } from "@/lib/types"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { useStore } from "@/store/store"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Zap, BarChart3, TrendingUp, TrendingDown } from "lucide-react"

interface ScreenerTableProps {
  data: (StockData & { signal: Signal })[]
}

export function ScreenerTable({ data }: ScreenerTableProps) {
  const { selectedMarket } = useStore()

  return (
    <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left border-separate border-spacing-0">
          <thead className="text-[10px] text-[#5c6b7a] uppercase bg-white/[0.01] border-b border-white/5">
            <tr>
              <th className="px-8 py-6 font-black tracking-widest">Asset Hierarchy</th>
              <th className="px-8 py-6 font-black tracking-widest text-right">Market Price</th>
              <th className="px-8 py-6 font-black tracking-widest text-right">Variance</th>
              <th className="px-8 py-6 font-black tracking-widest text-right">Rel Strength</th>
              <th className="px-8 py-6 font-black tracking-widest text-center">Inference</th>
              <th className="px-8 py-6 font-black tracking-widest text-center">Target Efficiency</th>
              <th className="px-8 py-6 font-black tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const isUp = item.change >= 0
              const sigType = item.signal.type
              const isBullish = sigType.includes('BULLISH')
              const isBearish = sigType.includes('BEARISH')
              
              return (
                <tr key={item.symbol} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-white text-xs border border-white/10 group-hover:scale-110 group-hover:bg-tvBlue/10 group-hover:border-tvBlue/20 transition-all">
                          {item.symbol.slice(0, 2)}
                       </div>
                       <div>
                          <div className="font-black text-white text-lg tracking-tighter group-hover:text-tvBlue transition-colors">{item.symbol}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate max-w-[150px]">{item.name}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="font-black text-white font-mono text-base">{formatCurrency(item.price, selectedMarket)}</div>
                    <div className="text-[9px] text-[#5c6b7a] font-bold uppercase tracking-widest mt-1">LTP NODE</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className={`flex items-center justify-end font-black font-mono ${isUp ? 'text-tvGreen' : 'text-tvRed'}`}>
                      {isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {Math.abs(item.changePercent).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex flex-col items-end gap-1.5">
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                           <div 
                             className="h-full bg-tvBlue shadow-[0_0_8px_#2979ff]" 
                             style={{ width: `${item.signal.strength}%` }}
                           />
                        </div>
                        <span className="text-[9px] font-black text-[#8899a6] font-mono">{item.signal.strength}% STR</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      isBullish ? 'bg-tvGreen/10 border-tvGreen/20 text-tvGreen' : 
                      isBearish ? 'bg-tvRed/10 border-tvRed/20 text-tvRed' : 
                      'bg-white/5 border-white/10 text-gray-400'
                    }`}>
                      {isBullish && <TrendingUp className="w-3 h-3" />}
                      {isBearish && <TrendingDown className="w-3 h-3" />}
                      {sigType.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-[10px] font-black text-white font-mono tracking-tighter">RR {item.signal.riskReward}</span>
                       <div className="flex gap-0.5 mt-1.5">
                          {[1,2,3].map(z => (
                             <div key={z} className={`w-1.5 h-1.5 rounded-full ${z <= (item.signal.targets.length) ? 'bg-tvBlue' : 'bg-white/5'}`} />
                          ))}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <Link 
                      href={`/stock/${item.symbol}`}
                      className="inline-flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-tvBlue text-gray-400 hover:text-white rounded-xl border border-white/10 hover:border-tvBlue/30 transition-all active:scale-90"
                    >
                      <Zap className="w-4 h-4" />
                    </Link>
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
