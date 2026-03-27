"use client"

import * as React from "react"
import { Sparkline } from "@/components/charts/Sparkline"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { motion } from "framer-motion"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { PulseDot } from "@/components/ui/PulseDot"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

import { useEffect, useState } from "react"
import { fetchMultipleQuotes } from "@/lib/api"
import { StockData } from "@/lib/types"

export function MarketOverview() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [data, setData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMarketData = async () => {
      setLoading(true)
      try {
        const symbols = marketConfig.indices.map(i => i.symbol)
        const quotes = await fetchMultipleQuotes(symbols)
        setData(quotes)
      } catch (err) {
        console.error('Market overview fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMarketData()
  }, [selectedMarket, marketConfig])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {marketConfig.indices.map((index, i) => {
        const stock = data.find(d => d.symbol === index.symbol)
        const price = stock?.price ?? 0
        const changePercent = stock?.changePercent ?? 0
        const isUp = changePercent >= 0
        const history = Array.from({length: 20}, (_, x) => price + Math.sin(x/3) * (price * 0.01))

        if (loading) {
           return <div key={index.symbol} className="glass-card h-40 w-full animate-pulse bg-white/5 border border-white/5 rounded-3xl" />
        }

        return (
          <motion.div 
            key={index.symbol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glass-card p-6 border border-white/5 group relative h-full flex flex-col justify-between overflow-hidden`}
          >
             {/* Gradient Accent */}
             <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity ${isUp ? 'bg-[#00e676]' : 'bg-[#ff1744]'}`} />
             
             <div className="flex justify-between items-start z-10">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-[0.2em]">{index.name}</p>
                   <h3 className="text-xl font-black text-white tracking-tighter uppercase">{index.displaySymbol}</h3>
                </div>
                <div className={cn(
                   "px-3 py-1.5 rounded-xl border flex items-center gap-2",
                   isUp ? "bg-[#00e67610] border-[#00e67620] text-[#00e676]" : "bg-[#ff174410] border-[#ff174420] text-[#ff1744]"
                )}>
                   {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                   <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                      {isUp ? '+' : ''}{changePercent.toFixed(2)}%
                   </span>
                </div>
             </div>

             <div className="mt-8 flex items-end justify-between z-10">
                <div className="space-y-1">
                   <div className="text-2xl font-black text-white font-mono tracking-tighter">
                      <AnimatedNumber value={price} prefix={marketConfig.currencySymbol} decimals={0} />
                   </div>
                   <div className="flex items-center gap-2">
                      <PulseDot color={isUp ? 'green' : 'red'} />
                      <span className="text-[9px] font-black text-[#8899a6] uppercase tracking-widest">LIVE DATA FEED</span>
                   </div>
                </div>
                <div className="w-[100px] h-[50px] opacity-20 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                   <Sparkline data={history} color={isUp ? "#00e676" : "#ff1744"} />
                </div>
             </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function cn(...classes: string[]) {
   return classes.filter(Boolean).join(' ')
}
