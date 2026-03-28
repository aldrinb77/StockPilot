"use client"

import TradeCalculator from "@/components/tools/TradeCalculator"
import { motion } from "framer-motion"
import { Calculator, ArrowLeft, ArrowRight, Shield, Target, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { FadeIn } from "@/components/ui/FadeIn"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { PulseDot } from "@/components/ui/PulseDot"

export default function CalculatorPage() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tvBlue/10 blur-[100px] pointer-events-none" />
          <div className="space-y-3">
             <div className="flex items-center space-x-2 text-tvBlue">
                <Calculator className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic Position Sizing Engine</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
               Trade <span className="text-tvBlue">Calculator</span>
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl">
               Mathematical execution protocols to ensure zero emotional bias in position allocation.
             </p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end border-r border-white/5 pr-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Active</p>
                <div className="flex items-center gap-2">
                   <PulseDot color="green" />
                   <span className="text-xs font-black text-white uppercase tracking-tighter">SECURED_GATEWAY</span>
                </div>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#5c6b7a]">
                <Shield className="w-4 h-4" /> LOCAL_ENCRYPTION_MODE
             </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
              <button className="px-6 py-2 bg-tvBlue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-tvBlue/20 transition-all">Conservative (1%)</button>
              <button className="px-6 py-2 text-gray-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Standard (2%)</button>
              <button className="px-6 py-2 text-gray-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Aggressive (5%)</button>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <Target className="w-4 h-4 text-tvGreen" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Entry: Optimized</span>
              </div>
              <div className="flex items-center gap-3">
                 <Shield className="w-4 h-4 text-tvRed" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Protect: Active</span>
              </div>
              <div className="flex items-center gap-3">
                 <Zap className="w-4 h-4 text-tvAmber" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Speed: Real-time</span>
              </div>
           </div>
        </div>

        {/* Calculator Grid */}
        <TradeCalculator />

        {/* Instructional / Learn Section */}
        <div className="glass-card p-12 rounded-[4rem] border border-white/5 relative overflow-hidden group/learn shadow-2xl">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tvGreen blur-[200px] opacity-[0.03] pointer-events-none" />
           <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="w-full lg:w-1/2 space-y-10">
                 <div className="space-y-4">
                    <span className="text-[10px] font-black text-tvGreen uppercase tracking-[0.5em]">The Professional's Rulebook</span>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Why Position <br /> <span className="text-tvGreen">Sizing Matters</span></h2>
                 </div>
                 
                 <div className="space-y-10">
                    <FeatureLine title="Avoid Ruin" text="No single trade should ruin your portfolio. risking 1-2% ensures you can stay in the game even after 10 consecutive losses." />
                    <FeatureLine title="Emotional Decoupling" text="When you know exactly what you'll lose if a trade hits the stop loss, the fear disappears. You trade like a machine." />
                    <FeatureLine title="Compound Growth" text="Standardized position sizing allows your balance to grow exponentially as your win rate stabilizes." />
                 </div>
              </div>
              <div className="w-full lg:w-1/2">
                 <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/5 space-y-8 relative overflow-hidden group/v shadow-xl">
                    <div className="flex items-center gap-4 text-white mb-6">
                       <TrendingUp className="w-6 h-6 text-tvGreen" />
                       <h3 className="text-sm font-black uppercase tracking-[0.4em]">Elite Tip: Risk-Reward Alignment</h3>
                    </div>
                    <p className="text-xl text-white font-black leading-relaxed italic mb-8">
                       "A 1:3 reward-risk ratio means you only need to be right 30% of the time to remain highly profitable. Institutional edges are built on R:R, not just win rate."
                    </p>
                    <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                       <Zap className="w-6 h-6 text-tvAmber" />
                       <span className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.3em]">System detected high-conviction entry on 14 monitored assets.</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </FadeIn>
  )
}

function FeatureLine({ title, text }: { title: string, text: string }) {
   return (
      <div className="flex gap-6 group">
         <div className="mt-1">
            <div className="w-2.5 h-10 bg-tvGreen rounded-full shadow-[0_0_15px_rgba(0,230,118,0.4)] transition-transform group-hover:scale-y-110" />
         </div>
         <div className="space-y-1">
            <h4 className="text-lg font-black text-white uppercase tracking-tighter transition-colors group-hover:text-tvGreen">{title}</h4>
            <p className="text-xs text-gray-500 font-bold leading-relaxed uppercase tracking-widest">{text}</p>
         </div>
      </div>
   )
}
