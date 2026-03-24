"use client"

import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { SignalBadge } from "@/components/signals/SignalBadge"
import { TrendingUp, Volume2, Compass, History, Activity, Sparkles, ChevronRight, ArrowUpRight, Star } from "lucide-react"
import Link from "next/link"
import { MOCK_STOCKS, getMockHistoricalData } from "@/lib/mockData"
import { getTopSectors } from "@/lib/userBehavior"
import { motion } from "framer-motion"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { Sparkline } from "@/components/charts/Sparkline"
import { STAGGER_CONTAINER, FADE_IN } from "@/lib/animations"

export function PersonalizedFeed() {
  const { selectedMarket, watchlist, viewHistory, browsedSectors } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  // Market Pulse Mock Logic
  const bullishCount = Math.floor(Math.random() * 20) + 10
  const bearishCount = Math.floor(Math.random() * 20) + 5
  const sentiment = bullishCount > bearishCount + 5 ? "Bullish" : bearishCount > bullishCount + 5 ? "Bearish" : "Neutral"

  const topSectors = getTopSectors()
  const sectorStocks = MOCK_STOCKS.slice(0, 5) 

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      
      {/* Header & Market Pulse */}
      <motion.div variants={FADE_IN} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
            {greeting}, <span className="text-tvBlue">Trader</span> 👋
          </h1>
          <p className="text-sm text-gray-500 font-medium tracking-wide">Analysis protocol initialized for {marketConfig.name} liquidity zones.</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl border-l-[6px] border-tvGreen flex items-center space-x-6 max-w-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tvGreen/10 blur-[50px] pointer-events-none" />
          <div className="p-3 bg-tvGreen/20 text-tvGreen rounded-2xl shadow-lg ring-1 ring-tvGreen/30 group-hover:scale-110 transition-transform">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Market Sentinel</p>
            <p className="text-sm text-white leading-relaxed font-bold">
              📊 {marketConfig.name} identifying <span className="text-tvGreen">Bullish Confluence</span>.
              Sentiment extraction: <span className="text-tvGreen">{sentiment}</span>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Watchlist Section */}
        {watchlist.length > 0 && (
          <motion.div variants={FADE_IN} className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-black text-white flex items-center tracking-tight">
                 <Star className="w-5 h-5 mr-3 text-tvAmber fill-tvAmber/20" /> Active Watchlist
               </h2>
               <Link href="/watchlist" className="text-[10px] font-black text-tvBlue hover:underline uppercase tracking-widest">Manage All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {watchlist.slice(0, 4).map(w => {
                const stock = MOCK_STOCKS.find(s => s.symbol === w.symbol) || MOCK_STOCKS[0]
                const isUp = stock.change >= 0
                return (
                  <Link href={`/stock/${w.symbol}`} key={w.symbol} className="glass-card p-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all group border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                         <span className="font-black text-white text-lg tracking-tight group-hover:text-tvBlue transition-colors">{w.symbol}</span>
                         <span className="text-[9px] text-gray-500 font-bold uppercase truncate max-w-[80px]">{stock.name}</span>
                      </div>
                      <SignalBadge type={isUp ? 'STRONG_BULLISH' : 'NEUTRAL'} className="scale-75 origin-right font-black" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-xl font-black text-white font-mono tracking-tighter">
                         <AnimatedNumber value={stock.price} prefix={marketConfig.currencySymbol} decimals={2} />
                      </div>
                      <div className={`text-xs font-black ${isUp ? 'text-tvGreen' : 'text-tvRed'} bg-${isUp ? 'tvGreen' : 'tvRed'}/10 px-2 py-0.5 rounded border border-white/5`}>
                        {isUp ? '+' : ''}<AnimatedNumber value={stock.changePercent} suffix="%" decimals={2} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Recently Viewed */}
        {viewHistory.length > 0 && (
          <motion.div variants={FADE_IN} className="space-y-6">
            <h2 className="text-xl font-black text-white flex items-center tracking-tight">
              <History className="w-5 h-5 mr-3 text-tvBlue" /> Retrieval History
            </h2>
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
              {viewHistory.slice(0, 5).map((h, i) => (
                <Link href={`/stock/${h.symbol}`} key={h.symbol} className="flex items-center justify-between p-4 hover:bg-white/[0.03] transition-all group border-b border-white/5 last:border-0 relative overflow-hidden">
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-400 border border-white/5 group-hover:scale-110 transition-transform">
                       {h.symbol}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white leading-tight group-hover:text-tvBlue transition-colors">{h.symbol}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[150px]">{h.name}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Trending */}
        <motion.div variants={FADE_IN} className="space-y-6">
          <h2 className="text-xl font-black text-white flex items-center tracking-tight">
            <Volume2 className="w-5 h-5 mr-3 text-tvAmber" /> Trending in {marketConfig.name}
          </h2>
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
             {marketConfig.popularStocks.slice(0, 5).map((s, i) => (
                <div key={s.symbol} className="flex items-center justify-between p-5 hover:bg-white/[0.03] transition-all group border-b border-white/5 last:border-0">
                   <div className="flex items-center space-x-6">
                      <span className="text-xs font-black text-gray-700 font-mono tracking-tighter">0{i+1}</span>
                      <div className="flex flex-col">
                         <Link href={`/stock/${s.symbol}`} className="font-black text-white group-hover:text-tvAmber transition-colors tracking-tight">{s.symbol}</Link>
                         <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest hidden sm:block">{s.name}</span>
                      </div>
                   </div>
                   <div className="flex items-center space-x-4">
                      <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                         <Sparkline data={getMockHistoricalData(100).map(d => d.close).slice(-15)} color="#F59E0B" />
                      </div>
                      <span className="text-[10px] font-black text-tvAmber border border-tvAmber/20 bg-tvAmber/10 px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap">High Volume</span>
                   </div>
                </div>
             ))}
          </div>
        </motion.div>

        {/* Sectors */}
        <motion.div variants={FADE_IN} className="space-y-6">
           <h2 className="text-xl font-black text-white flex items-center tracking-tight">
            <Compass className="w-5 h-5 mr-3 text-tvPurple" /> 
            {topSectors.length > 0 ? `Sector Focus: ${topSectors[0]}` : "Quantum Explorations"}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {sectorStocks.map(s => (
              <Link href={`/stock/${s.symbol}`} key={s.symbol} className="glass-panel p-5 rounded-2xl flex items-center justify-between group hover:border-tvPurple/30 transition-all border border-white/5 relative overflow-hidden active:scale-[0.98]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tvPurple/5 blur-[40px] pointer-events-none" />
                <div className="flex items-center space-x-5 relative z-10">
                  <div className="p-3 rounded-2xl bg-tvPurple/10 text-tvPurple border border-tvPurple/20 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg ring-1 ring-white/5">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base font-black text-white leading-tight group-hover:text-tvPurple transition-colors tracking-tight">{s.symbol}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{s.sector}</p>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-lg font-black text-white font-mono tracking-tighter">
                     <AnimatedNumber value={s.price} prefix={marketConfig.currencySymbol} decimals={2} />
                  </p>
                  <p className="text-[10px] text-tvGreen font-black uppercase tracking-widest">Trending Zone</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>

    </motion.div>
  )
}

