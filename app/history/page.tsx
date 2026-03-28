"use client"

import { TradeHistory } from "@/components/trade/TradeHistory"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"
import { History, Sparkles, Terminal, Activity, Trophy } from "lucide-react"

export default function HistoryPage() {
  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10">
          <div className="space-y-4">
             <div className="flex items-center space-x-3 text-[#00e676]">
                <Trophy className="w-5 h-5 shadow-[0_0_10px_#00e67640]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Historical Performance Analytics</span>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter flex items-center gap-6">
               <Terminal className="w-10 h-10 text-white/20" /> 
               Trade Journal
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl leading-relaxed">
               Document every execution with surgical detail. Measure win rates, profit factors, and psychological compliance over time.
             </p>
          </div>
        </div>

        <TradeHistory />
      </div>
    </FadeIn>
  )
}
