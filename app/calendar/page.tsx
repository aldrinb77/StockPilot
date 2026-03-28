"use client"

import { EarningsCalendar } from "@/components/market/EarningsCalendar"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"
import { Calendar, Sparkles, Terminal, Activity, Zap } from "lucide-react"

export default function CalendarPage() {
  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10">
          <div className="space-y-4">
             <div className="flex items-center space-x-3 text-[#ffab00]">
                <Zap className="w-5 h-5 fill-[#ffab00] shadow-[0_0_10px_#ffab0040]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Event Horizon Monitoring</span>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter flex items-center gap-6">
               <Terminal className="w-10 h-10 text-white/20" /> 
               Event Protocol
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl leading-relaxed">
               Track quarterly disclosures and macroeconomic shifts. Volatility management requires mapping temporal events.
             </p>
          </div>
        </div>

        <EarningsCalendar />
      </div>
    </FadeIn>
  )
}
