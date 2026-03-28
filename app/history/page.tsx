"use client"

import { useStore } from "@/store/store"
import { motion, AnimatePresence } from "framer-motion"
import { History, TrendingUp, TrendingDown, Target, Shield, Clock, Search, ChevronRight, Activity, Filter, Download, Trash2, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"
import { MARKETS } from "@/lib/markets"
import { PulseDot } from "@/components/ui/PulseDot"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { useState, useMemo } from "react"

export default function HistoryPage() {
  const { tradeHistory, removeFromHistory, selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHistory = useMemo(() => {
    return tradeHistory.filter(h => 
      h.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [tradeHistory, searchTerm])

  const stats = useMemo(() => {
    const total = tradeHistory.length
    if (total === 0) return { winRate: 0, totalPnl: 0, avgProfit: 0 }
    
    // Mock PnL logic for display
    const winners = tradeHistory.filter(h => Math.random() > 0.4).length
    return {
      winRate: Math.round((winners / total) * 100),
      totalPnl: tradeHistory.length * 1500, // Dummy
      avgProfit: 2.4
    }
  }, [tradeHistory])

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tvPurple/10 blur-[100px] pointer-events-none" />
          <div className="space-y-3">
             <div className="flex items-center space-x-2 text-tvPurple">
                <History className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Operational Execution Log</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
               Trade <span className="text-tvPurple">History</span>
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl">
               Detailed record of all system commands and executive executions for post-trade analysis.
             </p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end border-r border-white/5 pr-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Database Sync</p>
                <div className="flex items-center gap-2">
                   <PulseDot color="green" />
                   <span className="text-xs font-black text-white uppercase tracking-tighter">LOCAL_VAULT_ACTIVE</span>
                </div>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#5c6b7a]">
                <Shield className="w-4 h-4" /> ZERO_TELEMETRY
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <HistoryStatCard title="Protocol Win Rate" value={`${stats.winRate}%`} label="Historical Accuracy" icon={<Target className="w-5 h-5 text-tvGreen" />} color="text-tvGreen" />
           <HistoryStatCard title="Net Cumulative Alpha" value={formatCurrency(stats.totalPnl)} label="Portfolio Growth" icon={<TrendingUp className="w-5 h-5 text-tvBlue" />} color="text-tvBlue" />
           <HistoryStatCard title="Avg. ROI per Node" value={`+${stats.avgProfit}%`} label="Efficiency Matrix" icon={<Activity className="w-5 h-5 text-tvPurple" />} color="text-tvPurple" />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-tvBlue transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH COMMAND LOGS..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-tvPurple transition-all"
              />
           </div>
           
           <div className="flex items-center gap-4">
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-3">
                 <Filter className="w-4 h-4" /> Filter Protocols
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-3">
                 <Download className="w-4 h-4" /> Export CSV
              </button>
           </div>
        </div>

        {/* Logs Table */}
        <div className="glass-card rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                       <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Timestamp</th>
                       <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset</th>
                       <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Execution</th>
                       <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Units</th>
                       <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Entry Price</th>
                       <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Result</th>
                       <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {filteredHistory.map((item, i) => (
                       <motion.tr 
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-white/[0.02] transition-colors group/row"
                       >
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-gray-600" />
                                <span className="text-[10px] font-mono text-gray-400 font-black">{new Date().toLocaleDateString()}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="space-y-1">
                                <p className="text-sm font-black text-white tracking-tighter group-hover/row:text-tvPurple transition-colors">{item.symbol}</p>
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{marketConfig.exchangeCode}</p>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className="px-3 py-1 bg-tvGreen/10 border border-tvGreen/20 text-tvGreen text-[9px] font-black uppercase tracking-widest rounded-full">BUY_RE-ENTRY</span>
                          </td>
                          <td className="px-10 py-8">
                             <span className="text-sm font-mono font-black text-white">{item.quantity} Units</span>
                          </td>
                          <td className="px-10 py-8">
                             <span className="text-sm font-mono font-black text-white">{formatCurrency(item.buyPrice)}</span>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex flex-col">
                                <span className="text-sm font-black text-tvGreen font-mono">+4.2%</span>
                                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Alpha Captured</span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-all">
                                   <Search className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => removeFromHistory(item.id)}
                                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-tvRed transition-all"
                                >
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           {filteredHistory.length === 0 && (
              <div className="py-40 text-center">
                 <History className="w-16 h-16 text-white/5 mx-auto mb-8" />
                 <p className="text-sm font-black text-gray-600 uppercase tracking-[0.4em]">No operational records found in local vault.</p>
                 <Link href="/dashboard" className="mt-8 inline-flex items-center gap-3 text-[10px] font-black text-tvPurple uppercase tracking-widest hover:underline">
                    Initialize First Execution <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>
           )}
        </div>

        {/* Advanced Journaling Tip */}
        <div className="p-10 bg-[#7c4dff08] border border-[#7c4dff20] rounded-[3.5rem] flex items-center gap-10 shadow-2xl">
           <div className="w-20 h-20 bg-[#7c4dff10] rounded-3xl flex items-center justify-center text-tvPurple shadow-xl">
              <Activity className="w-10 h-10" />
           </div>
           <div className="space-y-3">
              <h4 className="text-lg font-black text-white uppercase tracking-tighter">Machine Learning Tip: Post-Trade Review</h4>
              <p className="text-xs text-[#8899a6] font-bold leading-relaxed uppercase tracking-widest opacity-80">
                 System analysis indicates that operators who review their "RE-ENTRY" logs daily show 14% higher risk-alignment scores. Ensure your local notes are updated for each protocol execution.
              </p>
           </div>
        </div>

      </div>
    </FadeIn>
  )
}

function HistoryStatCard({ title, value, label, icon, color }: any) {
  return (
    <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] opacity-[0.05] pointer-events-none" />
        <div className="flex items-center gap-4 text-white mb-8">
           <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-xl">
              {icon}
           </div>
           <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8899a6]">{title}</h4>
        </div>
        <div className={`text-4xl font-black font-mono tracking-tighter mb-4 ${color}`}>
           {value}
        </div>
        <div className="flex items-center gap-2">
           <div className={cn("w-1.5 h-1.5 rounded-full", color.replace('text-', 'bg-'))} />
           <p className="text-[9px] text-[#5c6b7a] font-black uppercase tracking-widest leading-none">
              {label}
           </p>
        </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
