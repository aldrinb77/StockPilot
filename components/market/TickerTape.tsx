"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { fetchMultipleQuotes } from "@/lib/api"
import { StockData } from "@/lib/types"
import Link from "next/link"

export function TickerTape() {
  const { selectedMarket } = useStore()
  const [data, setData] = useState<StockData[]>([])
  const marketConfig = MARKETS[selectedMarket]

  useEffect(() => {
    const loadData = async () => {
      try {
        const symbols = marketConfig.popularStocks.slice(0, 15).map(s => s.symbol)
        const quotes = await fetchMultipleQuotes(symbols)
        setData(quotes)
      } catch (err) {
        console.error("Ticker fetch failed:", err)
      }
    }
    loadData()
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [selectedMarket, marketConfig])

  if (data.length === 0) return null

  // Duplicate data for seamless loop
  const displayData = [...data, ...data]

  return (
    <div className="w-full h-9 overflow-hidden bg-black/40 backdrop-blur-md border-b border-white/5 relative z-50 flex items-center">
      <div className="flex whitespace-nowrap animate-ticker group">
        {displayData.map((stock, i) => {
          const isUp = stock.change >= 0
          return (
            <Link 
              key={`${stock.symbol}-${i}`}
              href={`/stock/${stock.symbol}`}
              className="flex items-center px-8 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest mr-3">
                {stock.symbol}
              </span>
              <span className="text-xs font-black text-white mr-3">
                {marketConfig.currencySymbol}{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-[10px] font-black ${isUp ? "text-[#00e676]" : "text-[#ff1744]"}`}>
                {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
              </span>
              <span className="mx-8 text-white/10 text-xs">|</span>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
