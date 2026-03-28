"use client"

import { Heatmap } from "@/components/market/Heatmap"
import { motion } from "framer-motion"
import { Grid3X3, ArrowLeft, ArrowRight, Activity, Database, TrendingUp } from "lucide-react"
import Link from "next/link"
import { FadeIn } from "@/components/ui/FadeIn"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { PulseDot } from "@/components/ui/PulseDot"

export default function HeatmapPage() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e67610] blur-[100px] pointer-events-none" />
          <div className="space-y-3">
             <div className="flex items-center space-x-2 text-tvGreen">
                <Grid3X3 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Multi-Sector Liquidity Matrix</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
               Market <span className="text-tvGreen">Heatmap</span>
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl">
               Real-time visual distribution of {marketConfig.name} equity momentum across all major sectors.
             </p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end border-r border-white/5 pr-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Active</p>
                <div className="flex items-center gap-2">
                   <PulseDot color="green" />
                   <span className="text-xs font-black text-white uppercase tracking-tighter">{marketConfig.exchangeCode} GATEWAY</span>
                </div>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#5c6b7a]">
                <Activity className="w-4 h-4" /> LOCAL_SYNC_OPTIMAL
             </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
              <button className="px-6 py-2 bg-tvGreen text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-tvGreen/20 transition-all">Equity</button>
              <button className="px-6 py-2 text-gray-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Crypto</button>
              <button className="px-6 py-2 text-gray-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Forex</button>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-tvGreen rounded-sm" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">+3% Bulls</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-tvRed rounded-sm" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">-3% Bears</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-[#1a2332] rounded-sm" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Neutral Zone</span>
              </div>
           </div>
        </div>

        {/* Heatmap Grid */}
        <div className="glass-card p-12 rounded-[4rem] border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tvGreen blur-[150px] opacity-[0.03] pointer-events-none" />
           <Heatmap />
        </div>

        {/* Legend / Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 opacity-60">
           <div className="space-y-4">
              <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10 text-tvGreen">
                 <Database className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Data Integrity</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest">
                 Information is aggregated across 14 institutional liquidity providers. Caching policy: 60s TTL.
              </p>
           </div>
           <div className="space-y-4">
              <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10 text-tvBlue">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Momentum Tracking</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest">
                 Relative strength is calculated based on rolling 24-hour volume-weighted average price (VWAP).
              </p>
           </div>
           <div className="space-y-4">
              <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10 text-tvPurple">
                 <Grid3X3 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Visual Logic</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest">
                 The size of the nodes currently represents sector weight within the {marketConfig.exchangeCode} composite.
              </p>
           </div>
        </div>

      </div>
    </FadeIn>
  )
}
