"use client"

import * as React from "react"
import { Sparkline } from "@/components/charts/Sparkline"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { motion } from "framer-motion"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

export function MarketOverview() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {marketConfig.indices.map((index, i) => {
        const price = 5000 + (Math.sin(i) * 2000) + 10000 
        const changePercent = (Math.sin(Date.now() / 10000 + i) * 2) 
        const history = Array.from({length: 20}, (_, x) => price + Math.sin(x/3) * 100)
        const isUp = changePercent >= 0

        return (
          <motion.div 
            key={index.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`glass-card relative overflow-hidden p-6 group cursor-pointer border border-white/5`}
          >
            {/* Sentiment Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity ${isUp ? 'bg-tvGreen' : 'bg-tvRed'}`} />
            
            <div className="flex flex-col h-full justify-between">
              <div>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{index.name}</span>
                    <div className={`p-1.5 rounded-lg ${isUp ? 'bg-tvGreen/10 text-tvGreen' : 'bg-tvRed/10 text-tvRed'} border border-white/5`}>
                       {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    </div>
                 </div>
                 <h3 className="text-2xl font-black text-white tracking-tighter flex items-center">
                    {index.displaySymbol}
                    <Activity className="w-3 h-3 ml-2 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </h3>
              </div>

              <div className="mt-8 flex items-end justify-between">
                 <div>
                    <div className="text-xl font-mono font-black text-white tracking-tighter mb-1">
                       <AnimatedNumber value={price} prefix={marketConfig.currencySymbol} decimals={0} />
                    </div>
                    <p className={`text-[10px] font-black tracking-widest uppercase flex items-center ${isUp ? 'text-tvGreen' : 'text-tvRed'}`}>
                       {isUp ? '+' : ''}<AnimatedNumber value={changePercent} suffix="%" decimals={2} />
                    </p>
                 </div>
                 <div className="w-[80px] h-[40px] opacity-40 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Sparkline data={history} color={isUp ? "#10B981" : "#ef4444"} />
                 </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

