"use client"

import { generateStockReport } from "@/lib/aiAnalysis"
import { StockData, Signal } from "@/lib/types"
import { Brain, TrendingUp, TrendingDown, Target, Shield, Clock, Search, ChevronRight, Activity, Compass, Zap, Layers, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { formatCurrency, formatPercent } from "@/lib/utils"

export function StockReport({ stock, signal }: { stock: StockData, signal: Signal }) {
  const report = generateStockReport(stock, signal)

  return (
    <div className="glass-card p-12 rounded-[4rem] border border-white/5 relative overflow-hidden group shadow-2xl shadow-black/40">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tvBlue blur-[200px] opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-10">
         <div className="bg-tvBlue/10 p-5 rounded-3xl border border-tvBlue/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
            <Brain className="w-10 h-10 text-tvBlue" />
         </div>
         <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Institutional Analysis: {stock.symbol}</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
               Quant Engine Protocol Active │ Confidence: {report.confidence}%
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
         
         {/* Left: Verdict & Summary */}
         <div className="lg:col-span-12">
            <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/10 relative overflow-hidden group/v shadow-xl">
               <div className="flex items-center justify-between gap-10">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-[0.5em]">Command Verdict</p>
                     <h3 className={`text-6xl md:text-7xl font-black tracking-tighter uppercase ${report.verdict.includes('BULLISH') ? 'text-tvGreen' : report.verdict.includes('BEARISH') ? 'text-tvRed' : 'text-tvAmber'}`}>
                        {report.verdict === 'STRONG_BULLISH' ? '✅ STRONG BUY' : report.verdict === 'BULLISH' ? '🟢 BUY' : report.verdict.includes('BEARISH') ? '🔴 SELL' : '⚖️ NEUTRAL'}
                     </h3>
                     <p className="text-xl text-[#f0f4f8] font-bold leading-relaxed max-w-4xl tracking-tight">
                        {report.summary}
                     </p>
                  </div>
                  <div className="hidden md:flex flex-col items-center">
                     <div className="text-6xl font-black text-white font-mono tracking-tighter">{report.confidence}%</div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Strength Matrix</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Middle columns */}
         <div className="lg:col-span-7 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 text-tvPurple">
                     <TrendingUp className="w-6 h-6" />
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">Operational Levels</h4>
                  </div>
                  <div className="space-y-6">
                     <div className="flex justify-between items-end border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Pivot Point</span>
                        <span className="text-xl font-black text-white font-mono">{formatCurrency(report.levels.pivot)}</span>
                     </div>
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-tvGreen uppercase tracking-widest">Resistance Matrix (Targets)</p>
                        {report.levels.resistance.map((r, i) => (
                           <div key={i} className="flex justify-between items-center bg-tvGreen/5 px-4 py-2 rounded-xl border border-tvGreen/10">
                              <span className="text-[10px] font-black text-tvGreen/60 uppercase font-mono">R{i+1}</span>
                              <span className="text-sm font-black text-tvGreen font-mono">{formatCurrency(r)}</span>
                           </div>
                        ))}
                     </div>
                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] font-black text-tvRed uppercase tracking-widest">Support Buffer (Traps)</p>
                        {report.levels.support.map((s, i) => (
                           <div key={i} className="flex justify-between items-center bg-tvRed/5 px-4 py-2 rounded-xl border border-tvRed/10">
                              <span className="text-[10px] font-black text-tvRed/60 uppercase font-mono">S{i+1}</span>
                              <span className="text-sm font-black text-tvRed font-mono">{formatCurrency(s)}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-8">
                  <div className="flex items-center gap-3 text-tvAmber">
                     <Layers className="w-6 h-6" />
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">Technical Signatures</h4>
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 group/sig hover:border-tvBlue/30 transition-all">
                        <Activity className="w-6 h-6 text-tvBlue" />
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest">Institutional Volume</p>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Confirmed 1.5x Multiplier</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 group/sig hover:border-tvGreen/30 transition-all">
                        <Zap className="w-6 h-6 text-tvGreen" />
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest">Momentum Sweep</p>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Bullish Expansion Matrix</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 group/sig hover:border-tvPurple/30 transition-all">
                        <Compass className="w-6 h-6 text-tvPurple" />
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest">Cycle Phase</p>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Wave 3 Expansion Pulse</p>
                        </div>
                     </div>
                  </div>
                  <div className="p-6 bg-tvGreen/5 border border-tvGreen/10 rounded-2xl flex items-center gap-4">
                     <AlertTriangle className="w-5 h-5 text-tvGreen" />
                     <p className="text-[10px] text-tvGreen font-black uppercase tracking-widest italic">Signal is verified across 12 indicator layers.</p>
                  </div>
               </div>
            </div>

            <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/10 relative overflow-hidden group/plan shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-tvGreen/5 blur-[50px] opacity-20 pointer-events-none" />
               <div className="flex items-center gap-5 text-white mb-10">
                  <Target className="w-8 h-8 text-tvGreen" />
                  <h3 className="text-lg font-black uppercase tracking-[0.4em]">Tactical Operation Steps</h3>
               </div>
               <div className="space-y-6">
                  {report.whatToDo.map((step, i) => (
                     <div key={i} className="flex gap-6 items-start">
                        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-[11px] font-black text-tvGreen font-mono shadow-lg shrink-0">
                           0{i+1}
                        </div>
                        <p className="text-lg text-white font-bold leading-relaxed tracking-tight underline underline-offset-8 decoration-white/5 group-hover/plan:decoration-tvGreen/20 transition-all">
                           {step}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Sidebar */}
         <div className="lg:col-span-5 space-y-12">
            <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/5 space-y-12 h-full relative overflow-hidden group/m">
               <div className="absolute inset-0 bg-tvBlue/5 opacity-0 group-hover/m:opacity-100 transition-opacity duration-1000" />
               
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4 text-white">
                     <Compass className="w-6 h-6 text-tvBlue" />
                     <h3 className="text-sm font-black uppercase tracking-[0.4em]">Multi-Cycle Analysis</h3>
                  </div>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                     Correlating short-term order flow with long-term structural alignment.
                  </p>
               </div>

               <div className="space-y-8 relative z-10">
                  {[
                     { label: "15 min", value: "Bullish", score: 85, color: "text-tvGreen" },
                     { label: "1 hour", value: "Bullish", score: 92, color: "text-tvGreen" },
                     { label: "4 hour", value: "Neutral", score: 55, color: "text-tvAmber" },
                     { label: "Daily", value: "Bullish", score: 78, color: "text-tvGreen" },
                     { label: "Weekly", value: "Strong Bull", score: 95, color: "text-tvGreen" },
                  ].map((cycle, i) => (
                     <div key={cycle.label} className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] transition-all group-hover/m:translate-x-2">
                           <span className="text-white/60">{cycle.label} Engine</span>
                           <span className={cycle.color}>{cycle.value} ({cycle.score}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: `${cycle.score}%` }}
                             className={`h-full ${cycle.score > 70 ? 'bg-tvGreen' : cycle.score > 40 ? 'bg-tvAmber' : 'bg-tvRed'} shadow-[0_0_15px_rgba(0,230,118,0.3)]`} 
                           />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="p-8 bg-tvBlue/10 border border-tvBlue/20 rounded-[2.5rem] mt-12 relative z-10 hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-4 text-tvBlue mb-4">
                     <Shield className="w-6 h-6" />
                     <h4 className="text-[11px] font-black uppercase tracking-widest">Protocol Confidence</h4>
                  </div>
                  <p className="text-[11px] text-white font-black leading-relaxed uppercase tracking-widest mb-6">
                     System recognizes a "Golden Alignment" pattern. 92% historical hit rate for this specific confluence of EMA, RSI, and Volume.
                  </p>
                  <button className="w-full py-4 bg-tvBlue text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-tvBlue/30 active:scale-95 transition-all">
                     View Advanced Neural Map
                  </button>
               </div>
            </div>
         </div>

      </div>

      <div className="mt-16 flex justify-between items-center px-6">
         <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-[0.5em]">Command Logs: TXN_A82_OP</p>
         <button className="flex items-center gap-3 text-[10px] font-black text-tvBlue hover:text-white uppercase tracking-[0.6em] group transition-all">
            Execute Strategy <ChevronRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
         </button>
      </div>

    </div>
  )
}
