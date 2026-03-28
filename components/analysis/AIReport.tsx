"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/store"
import { generateDailyReport, AIReport as AIReportType } from "@/lib/aiAnalysis"
import { Brain, Sparkles, TrendingUp, TrendingDown, Target, Shield, Clock, RefreshCw, ChevronRight, Activity, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { useUserProfile } from "@/hooks/useUserProfile"
import { PulseDot } from "@/components/ui/PulseDot"

export function AIReport({ stocks }: { stocks: any[] }) {
  const { selectedMarket } = useStore()
  const { userName } = useUserProfile()
  const [report, setReport] = useState<AIReportType | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshReport = () => {
    setLoading(true)
    setTimeout(() => {
      const newReport = generateDailyReport(stocks as any, selectedMarket, userName)
      setReport(newReport)
      setLoading(false)
    }, 1200)
  }

  useEffect(() => {
    if (stocks.length > 0) {
      refreshReport()
    }
  }, [stocks, selectedMarket, userName])

  if (!report && loading) return (
    <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 h-[600px] flex flex-col items-center justify-center space-y-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-white/5 shimmer opacity-20" />
      <Brain className="w-20 h-20 text-tvBlue animate-pulse" />
      <p className="text-sm font-black text-white uppercase tracking-[0.4em] animate-pulse">Synthesizing Alpha Intelligence...</p>
    </div>
  )

  if (!report) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 rounded-[4rem] border border-white/5 relative overflow-hidden group shadow-2xl shadow-black/40"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tvBlue blur-[150px] opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-white/5 pb-12">
        <div className="space-y-4">
           <div className="flex items-center gap-4 text-tvBlue">
              <div className="bg-tvBlue/10 p-4 rounded-3xl border border-tvBlue/20 shadow-xl shadow-tvBlue/10 group-hover:scale-110 transition-transform duration-500">
                 <Brain className="w-8 h-8" />
              </div>
              <div>
                 <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em] leading-tight">AI Market Intelligence Report</h2>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Generated: {report.date} │ Protocol 4.2_ELITE
                 </p>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <button 
             onClick={refreshReport}
             disabled={loading}
             className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 disabled:opacity-50"
           >
             <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} /> {loading ? "SYNTHESIZING..." : "REFRESH REPORT"}
           </button>
           <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all shadow-xl">
             <Download className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Side: Sentiment & Summary */}
        <div className="lg:col-span-7 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black text-[#5c6b7a] uppercase tracking-[0.4em]">Current Sentiment Matrix</h3>
               <span className="text-[10px] font-mono text-gray-700 bg-white/5 px-2 py-0.5 rounded">0XFFF72</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-10">
               <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle cx="80" cy="80" r="70" className="stroke-white/5 fill-none" strokeWidth="12" />
                     <motion.circle 
                       initial={{ strokeDasharray: "0 440" }}
                       animate={{ strokeDasharray: `${(report.sentimentScore / 100) * 440} 440` }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       cx="80" cy="80" r="70" 
                       className={`fill-none ${report.sentiment.includes('BULLISH') ? 'stroke-tvGreen' : report.sentiment.includes('BEARISH') ? 'stroke-tvRed' : 'stroke-tvAmber'}`} 
                       strokeWidth="12"
                       strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-4xl font-black text-white font-mono tracking-tighter">{report.sentimentScore}%</span>
                     <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Confidence</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase ${report.sentiment.includes('BULLISH') ? 'text-tvGreen' : report.sentiment.includes('BEARISH') ? 'text-tvRed' : 'text-tvAmber'}`}>
                    {report.sentimentEmoji} {report.sentiment}
                  </h4>
                  <p className="text-xs text-[#8899a6] font-bold leading-relaxed max-w-sm uppercase tracking-widest italic">
                    {report.summary.split('. ')[0]}.
                  </p>
               </div>
            </div>
          </div>

          <div className="space-y-8 bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group/sum animate-stagger">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] opacity-[0.05] pointer-events-none" />
             <div className="flex items-center gap-4 text-white">
                <Target className="w-6 h-6 text-tvBlue" />
                <h3 className="text-sm font-black uppercase tracking-[0.4em]">AI Executive Summary</h3>
             </div>
             <p className="text-lg text-[#8899a6] font-bold leading-[1.8] italic">
               "{report.summary}"
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-3 text-tvAmber">
                   <Shield className="w-5 h-5" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8899a6]">Risk Assessment</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${report.riskAssessment.level === 'LOW' ? 'bg-tvGreen/10 text-tvGreen border-tvGreen/20' : report.riskAssessment.level === 'MEDIUM' ? 'bg-tvAmber/10 text-tvAmber border-tvAmber/20' : 'bg-tvRed/10 text-tvRed border-tvRed/20'}`}>
                        {report.riskAssessment.level} EXPOSURE
                      </span>
                   </div>
                   <p className="text-xs text-[#5c6b7a] font-bold leading-relaxed">{report.riskAssessment.description}</p>
                   <p className="text-xs text-white font-black uppercase tracking-wider bg-white/5 p-4 rounded-xl border border-white/5">{report.riskAssessment.suggestion}</p>
                </div>
             </div>

             <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-3 text-tvPurple">
                   <TrendingUp className="w-5 h-5" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8899a6]">Sector Momentum</h4>
                </div>
                <div className="space-y-4">
                   {report.sectorAnalysis.map(sector => (
                      <div key={sector.name} className="space-y-2">
                         <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                            <span className="text-white">{sector.name}</span>
                            <span className={sector.status === 'STRONG' ? 'text-tvGreen' : 'text-tvAmber'}>{sector.status}</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(sector.bullishCount / sector.totalCount) * 100}%` }}
                              className={`h-full ${sector.status === 'STRONG' ? 'bg-tvGreen' : 'bg-tvAmber'}`} 
                            />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Recommendations & Plan */}
        <div className="lg:col-span-5 space-y-16">
          <div className="space-y-8 animate-stagger">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                   <Target className="w-6 h-6 text-tvGreen" />
                   <h3 className="text-sm font-black uppercase tracking-[0.4em]">Tactical Recommendations</h3>
                </div>
                <span className="text-[10px] text-[#00e676] bg-[#00e67610] px-3 py-1 rounded-full font-black uppercase tracking-widest">Found: {report.topRecommendations.length}</span>
             </div>
             
             <div className="space-y-6">
                {report.topRecommendations.map((rec, i) => (
                   <motion.div 
                      key={rec.symbol}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-8 rounded-[2.5rem] border-l-[10px] border-l-tvGreen border-white/5 hover:scale-[1.02] transition-all relative overflow-hidden group shadow-xl"
                   >
                      <div className="absolute top-4 right-4 text-[10px] font-black text-gray-500 font-mono tracking-tighter">CONFIDENCE: {rec.confidence}%</div>
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h4 className="text-2xl font-black text-white tracking-tighter group-hover:text-tvGreen transition-colors">{rec.symbol}</h4>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{rec.type.replace('_', ' ')}</span>
                         </div>
                         <div className="text-right">
                            <p className="text-xl font-black text-white font-mono tracking-tighter">{formatCurrency(rec.price)}</p>
                            <span className="text-[9px] text-tvGreen font-black uppercase tracking-widest">Entry Zone</span>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                            <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Target</p>
                            <p className="text-sm font-black text-white">{formatCurrency(rec.target)}</p>
                         </div>
                         <div className="bg-[#ff174405] p-4 rounded-2xl border border-[#ff174410] text-center">
                            <p className="text-[8px] text-tvRed font-black uppercase tracking-widest mb-1">Stop Loss</p>
                            <p className="text-sm font-black text-tvRed">{formatCurrency(rec.stopLoss)}</p>
                         </div>
                      </div>
                      <p className="text-[11px] text-[#8899a6] font-bold leading-relaxed italic uppercase tracking-widest">
                        "{rec.reason}"
                      </p>
                   </motion.div>
                ))}
             </div>
          </div>

          <div className="space-y-10 bg-white/[0.01] p-10 rounded-[4rem] border border-white/5 relative overflow-hidden group/plan shadow-xl">
             <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/5 blur-[50px] opacity-10 pointer-events-none" />
             <div className="flex items-center gap-4 text-white">
                <Clock className="w-6 h-6 text-tvBlue" />
                <h3 className="text-sm font-black uppercase tracking-[0.4em]">Daily Command Protocol</h3>
             </div>
             
             <div className="relative space-y-12 pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                {report.tradingPlan.map((step, i) => (
                   <div key={i} className="relative group/step">
                      <div className="absolute left-[-24px] top-1 w-[12px] h-[12px] rounded-full bg-[#0b1120] border-2 border-tvBlue z-10 group-hover/step:scale-125 transition-transform" />
                      <div className="flex gap-4">
                         <span className="text-[10px] font-black text-tvBlue font-mono w-16">{step.time}</span>
                         <div className="flex-1 space-y-1">
                            <p className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 group-hover/step:text-tvBlue transition-colors">
                               {step.emoji} {step.action}
                            </p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

      </div>

      <div className="mt-16 flex justify-center">
         <button className="flex items-center gap-3 text-[10px] font-black text-[#5c6b7a] hover:text-white uppercase tracking-[0.6em] group/full transition-all">
            Open Advanced Neural Logs <ChevronRight className="w-4 h-4 group-hover/full:translate-x-3 transition-transform" />
         </button>
      </div>

    </motion.div>
  )
}
