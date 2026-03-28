"use client"

import { useEffect, useState, useMemo } from "react"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { fetchMultipleQuotes } from "@/lib/api"
import { StockData } from "@/lib/types"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Activity } from "lucide-react"

export function Heatmap() {
  const { selectedMarket } = useStore()
  const [data, setData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const marketConfig = MARKETS[selectedMarket]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const symbols = marketConfig.popularStocks.map(s => s.symbol)
        const quotes = await fetchMultipleQuotes(symbols)
        setData(quotes)
      } catch (err) {
        console.error("Heatmap fetch failed:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedMarket, marketConfig])

  const sectors = useMemo(() => {
    const map: Record<string, StockData[]> = {}
    data.forEach(stock => {
      const sector = stock.sector || "Other"
      if (!map[sector]) map[sector] = []
      map[sector].push(stock)
    })
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length)
  }, [data])

  const getColor = (change: number) => {
    if (change >= 3) return "bg-[#00e676]"      // Deep Green
    if (change >= 1) return "bg-[#00e67680]"   // Light Green
    if (change <= -3) return "bg-[#ff1744]"     // Deep Red
    if (change <= -1) return "bg-[#ff174480]"    // Light Red
    return "bg-[#1a2332]"                      // Elevated Gray
  }

  const getOpacity = (change: number) => {
    const abs = Math.abs(change)
    if (abs >= 5) return 1
    if (abs >= 3) return 0.9
    if (abs >= 1) return 0.7
    return 0.5
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-lg border border-white/5" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-20">
      {sectors.map(([sector, stocks]) => (
        <div key={sector} className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#2979ff] rounded-full" />
             <h3 className="text-sm font-black text-white uppercase tracking-widest">{sector}</h3>
             <span className="text-[10px] text-gray-500 font-black">{stocks.length} Assets</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {stocks.map((stock) => (
              <Link 
                key={stock.symbol}
                href={`/stock/${stock.symbol}`}
                className={`relative group aspect-[4/3] rounded-2xl border border-white/10 hover:border-white/40 transition-all overflow-hidden flex flex-col items-center justify-center text-center p-4 ${getColor(stock.changePercent)}`}
                style={{ opacity: getOpacity(stock.changePercent) }}
              >
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-black text-white group-hover:scale-110 transition-transform">{stock.symbol}</span>
                <span className="text-[10px] font-black text-white/90">
                  {stock.changePercent > 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                </span>
                
                {/* Micro Tooltip */}
                <div className="absolute bottom-2 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <span className="text-[8px] font-black uppercase text-white tracking-widest whitespace-nowrap bg-black/40 px-2 py-1 rounded-full">
                     {marketConfig.currencySymbol}{stock.price.toFixed(2)}
                   </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="py-40 text-center glass-card border-2 border-dashed border-white/5 rounded-[3rem]">
           <Activity className="w-12 h-12 text-white/20 mx-auto mb-6" />
           <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No liquidity data available for heatmap</p>
        </div>
      )}
    </div>
  )
}
