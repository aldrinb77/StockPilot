"use client"

import { TradeCalculator } from "@/components/tools/TradeCalculator"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"
import { Calculator, Sparkles, Terminal, Activity, ShieldCheck } from "lucide-react"

export default function CalculatorPage() {
  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10">
          <div className="space-y-4">
             <div className="flex items-center space-x-3 text-[#2979ff]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Operational Risk Protocol</span>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter flex items-center gap-6">
               <Terminal className="w-10 h-10 text-white/20" /> 
               Trade Planner
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl leading-relaxed">
               Surgical precision in position sizing and risk management. Protect your capital with strict mathematical adherence.
             </p>
          </div>
        </div>

        <TradeCalculator />
      </div>
    </FadeIn>
  )
}
