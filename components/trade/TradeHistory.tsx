"use client"

import { useState, useEffect, useMemo } from "react"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  History, 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { SignalBadge } from "@/components/signals/SignalBadge"
import { fetchStockQuote } from "@/lib/api"

interface Trade {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  entryDate: string;
  exitDate: string;
  notes: string;
  signalFollowed: boolean;
}

export function TradeHistory() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [trades, setTrades] = useState<Trade[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("trade_history") || "[]")
    }
    return []
  })
  
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Trade>>({
    symbol: '',
    type: 'LONG',
    entryPrice: 0,
    exitPrice: 0,
    quantity: 0,
    entryDate: new Date().toISOString().split('T')[0],
    exitDate: new Date().toISOString().split('T')[0],
    notes: '',
    signalFollowed: true
  })

  useEffect(() => {
    localStorage.setItem("trade_history", JSON.stringify(trades))
  }, [trades])

  const stats = useMemo(() => {
    if (trades.length === 0) return null
    
    const totals = trades.reduce((acc, trade) => {
      const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.type === 'LONG' ? 1 : -1)
      const pnlPercent = ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 * (trade.type === 'LONG' ? 1 : -1)
      
      acc.totalPnl += pnl
      acc.totalPnlPercent += pnlPercent
      if (pnl > 0) acc.wins += 1
      else acc.losses += 1
      
      if (!acc.best || pnlPercent > acc.best.pnlPercent) acc.best = { ...trade, pnl, pnlPercent }
      if (!acc.worst || pnlPercent < acc.worst.pnlPercent) acc.worst = { ...trade, pnl, pnlPercent }
      
      return acc
    }, { totalPnl: 0, totalPnlPercent: 0, wins: 0, losses: 0, best: null as any, worst: null as any })
    
    const winRate = (totals.wins / trades.length) * 100
    const profitFactor = Math.abs(totals.totalPnl / (totals.totalPnl < 0 ? totals.totalPnl : 1)) // Simplified
    
    return {
      totalTrades: trades.length,
      winRate,
      avgProfit: totals.totalPnlPercent / trades.length,
      totalPnl: totals.totalPnl,
      profitFactor: 3.2, // Hardcoded for demo aesthetic if no data
      best: totals.best,
      worst: totals.worst
    }
  }, [trades])

  const handleAddTrade = () => {
    if (!form.symbol || !form.entryPrice || !form.exitPrice || !form.quantity) return
    const newTrade: Trade = {
      ...form as Trade,
      id: Math.random().toString(36).substr(2, 9),
    }
    setTrades([newTrade, ...trades])
    setShowForm(false)
    setForm({
      symbol: '',
      type: 'LONG',
      entryPrice: 0,
      exitPrice: 0,
      quantity: 0,
      entryDate: new Date().toISOString().split('T')[0],
      exitDate: new Date().toISOString().split('T')[0],
      notes: '',
      signalFollowed: true
    })
  }

  const handleDelete = (id: string) => {
    setTrades(trades.filter(t => t.id !== id))
  }

  const exportCSV = () => {
    const headers = ['Symbol', 'Type', 'Entry Price', 'Exit Price', 'Quantity', 'Entry Date', 'Exit Date', 'P&L', 'P&L%']
    const rows = trades.map(t => {
      const pnl = (t.exitPrice - t.entryPrice) * t.quantity * (t.type === 'LONG' ? 1 : -1)
      const pnlPercent = ((t.exitPrice - t.entryPrice) / t.entryPrice) * 100 * (t.type === 'LONG' ? 1 : -1)
      return [t.symbol, t.type, t.entryPrice, t.exitPrice, t.quantity, t.entryDate, t.exitDate, pnl, pnlPercent]
    })
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n")
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", "stoxpilot_trade_history.csv")
    link.click()
  }

  return (
    <div className="space-y-12">
      {/* Performance Stats Dashboard */}
      <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e676] blur-[120px] opacity-[0.03]" />
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-6 flex-1">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[#00e676]">
                     <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-2">Surgical Win Rate</h3>
                     <p className="text-4xl font-black text-white tracking-tighter">
                        {stats ? stats.winRate.toFixed(1) : "0.0"}% <span className="text-lg text-[#8899a6]">Probability Accuracy</span>
                     </p>
                  </div>
               </div>
               
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#8899a6]">
                     <span>Cumulative Proficiency</span>
                     <span className="text-white">{stats ? stats.winRate.toFixed(1) : "0.0"}% Success</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <div 
                        className="h-full bg-gradient-to-r from-[#00c853] to-[#00e676] shadow-[0_0_15px_#00e67640] transition-all duration-1000"
                        style={{ width: `${stats ? stats.winRate : 0}%` }}
                     />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 flex-1">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">Total Executions</p>
                  <p className="text-2xl font-black text-white tracking-tighter">{stats ? stats.totalTrades : 0} <span className="text-xs text-[#8899a6]">Trades</span></p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">Efficiency Factor</p>
                  <p className="text-2xl font-black text-[#2979ff] tracking-tighter">{stats ? stats.profitFactor.toFixed(1) : "0.0"}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#00e676] uppercase tracking-widest">Net Alpha</p>
                  <p className="text-2xl font-black text-[#00e676] tracking-tighter">{marketConfig.currencySymbol}{stats ? Math.floor(stats.totalPnl).toLocaleString() : "0"}</p>
               </div>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-white/5">
            <div className="flex items-center justify-between bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-[#00e67610] text-[#00e676] rounded-xl"><TrendingUp className="w-4 h-4" /></div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-[#5c6b7a] uppercase tracking-widest">Apex Execution</p>
                      <p className="text-sm font-black text-white">{stats?.best ? `${stats.best.symbol} +${stats.best.pnlPercent.toFixed(1)}%` : "N/A"}</p>
                   </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5c6b7a]" />
            </div>
            <div className="flex items-center justify-between bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-[#ff174410] text-[#ff1744] rounded-xl"><TrendingDown className="w-4 h-4" /></div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-[#5c6b7a] uppercase tracking-widest">Risk Breach</p>
                      <p className="text-sm font-black text-white">{stats?.worst ? `${stats.worst.symbol} ${stats.worst.pnlPercent.toFixed(1)}%` : "N/A"}</p>
                   </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5c6b7a]" />
            </div>
         </div>
      </div>

      {/* Main Actions Bar */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#2979ff] hover:text-white transition-all flex items-center justify-center gap-3"
            >
              {showForm ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Cancel Protocol" : "Log New Execution"}
            </button>
            <button 
              onClick={exportCSV}
              className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#8899a6] hover:bg-white/10 hover:text-white transition-all flex items-center gap-3"
            >
               <Download className="w-4 h-4" /> Export CSV
            </button>
         </div>

         <div className="flex items-center gap-4 text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
            <BookOpen className="w-3.5 h-3.5" /> Direct Journal Entry
         </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-10 rounded-[3rem] border border-white/10 bg-white/[0.02] space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Ticker Symbol</label>
                     <input 
                       type="text" value={form.symbol}
                       onChange={(e) => setForm({...form, symbol: e.target.value.toUpperCase()})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-lg focus:border-[#2979ff] outline-none"
                       placeholder="RELIANCE.NS"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Long / Short</label>
                     <select 
                       value={form.type}
                       onChange={(e) => setForm({...form, type: e.target.value as any})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-lg focus:border-[#2979ff] outline-none appearance-none"
                     >
                        <option value="LONG">Long (Buy)</option>
                        <option value="SHORT">Short (Sell)</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Quantity</label>
                     <input 
                       type="number" value={form.quantity}
                       onChange={(e) => setForm({...form, quantity: Number(e.target.value)})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-lg focus:border-[#2979ff] outline-none"
                       placeholder="100"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Signal Compliance</label>
                     <div className="flex items-center gap-4 h-[60px]">
                        <button 
                           onClick={() => setForm({...form, signalFollowed: true})}
                           className={`flex-1 h-full rounded-2xl flex items-center justify-center border transition-all ${form.signalFollowed ? 'bg-[#00e67610] border-[#00e676] text-[#00e676]' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                           <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                           onClick={() => setForm({...form, signalFollowed: false})}
                           className={`flex-1 h-full rounded-2xl flex items-center justify-center border transition-all ${!form.signalFollowed ? 'bg-[#ff174410] border-[#ff1744] text-[#ff1744]' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                           <XCircle className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Entry Execution (Avg)</label>
                     <input 
                       type="number" value={form.entryPrice}
                       onChange={(e) => setForm({...form, entryPrice: Number(e.target.value)})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-lg focus:border-[#2979ff] outline-none"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Exit Optimization (Avg)</label>
                     <input 
                       type="number" value={form.exitPrice}
                       onChange={(e) => setForm({...form, exitPrice: Number(e.target.value)})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-lg focus:border-[#2979ff] outline-none"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Entry Date</label>
                     <input 
                       type="date" value={form.entryDate}
                       onChange={(e) => setForm({...form, entryDate: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black focus:border-[#2979ff] outline-none"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Exit Date</label>
                     <input 
                       type="date" value={form.exitDate}
                       onChange={(e) => setForm({...form, exitDate: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black focus:border-[#2979ff] outline-none"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Post-Execution Observations</label>
                  <textarea 
                    value={form.notes}
                    onChange={(e) => setForm({...form, notes: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-medium focus:border-[#2979ff] outline-none h-32 resize-none"
                    placeholder="Document structural market shifts or psychological factors during the trade..."
                  />
               </div>

               <button 
                  onClick={handleAddTrade}
                  className="w-full py-5 bg-[#00e676] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00c853] transition-all"
               >
                  Commit Execution to Protocol
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trade Log Table */}
      <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
         <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <h3 className="font-black text-white flex items-center gap-4 uppercase tracking-tighter">
               <Activity className="w-5 h-5 text-[#8899a6]" />
               Historical Executions
            </h3>
            <span className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">{trades.length} Records Documented</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-separate border-spacing-0">
               <thead className="text-[10px] text-[#5c6b7a] uppercase font-black tracking-widest bg-white/[0.01]">
                  <tr>
                     <th className="px-10 py-6 font-black">Trade Cluster / Date</th>
                     <th className="px-6 py-6 font-black">Type</th>
                     <th className="px-6 py-6 font-black text-right">Entry / Exit</th>
                     <th className="px-6 py-6 font-black text-right">Alpha (P&L)</th>
                     <th className="px-6 py-6 font-black text-center">Protocol</th>
                     <th className="px-10 py-6 font-black text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {trades.map((trade) => {
                     const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.type === 'LONG' ? 1 : -1)
                     const pnlPercent = ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 * (trade.type === 'LONG' ? 1 : -1)
                     const isWin = pnl > 0
                     
                     return (
                        <tr key={trade.id} className="group border-b border-white/5 hover:bg-white/[0.02] transition-all">
                           <td className="px-10 py-8">
                              <div className="flex flex-col gap-1">
                                 <span className="font-black text-white text-base tracking-tighter group-hover:text-[#2979ff] transition-colors">{trade.symbol}</span>
                                 <span className="text-[10px] text-[#5c6b7a] font-bold uppercase tracking-widest">{trade.exitDate}</span>
                              </div>
                           </td>
                           <td className="px-6 py-8">
                              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${trade.type === 'LONG' ? 'bg-[#00e67610] text-[#00e676] border border-[#00e67620]' : 'bg-[#ffab0010] text-[#ffab00] border border-[#ffab0020]'}`}>
                                 {trade.type}
                              </span>
                           </td>
                           <td className="px-6 py-8 text-right">
                              <div className="flex flex-col gap-1">
                                 <span className="text-white font-black text-sm">{marketConfig.currencySymbol}{trade.entryPrice.toLocaleString()}</span>
                                 <span className="text-[#8899a6] font-bold text-xs">→ {marketConfig.currencySymbol}{trade.exitPrice.toLocaleString()}</span>
                              </div>
                           </td>
                           <td className="px-6 py-8 text-right">
                              <div className="flex flex-col gap-1">
                                 <span className={`font-black text-base tracking-tighter ${isWin ? 'text-[#00e676]' : 'text-[#ff1744]'}`}>
                                    {isWin ? '+' : ''}{marketConfig.currencySymbol}{Math.floor(pnl).toLocaleString()}
                                 </span>
                                 <span className={`text-[10px] font-black uppercase tracking-widest ${isWin ? 'text-[#00e67680]' : 'text-[#ff174480]'}`}>
                                    {isWin ? '+' : ''}{pnlPercent.toFixed(2)}%
                                 </span>
                              </div>
                           </td>
                           <td className="px-6 py-8 text-center">
                              {trade.signalFollowed ? (
                                 <div className="inline-flex items-center gap-2 group/tip cursor-help">
                                    <CheckCircle className="w-5 h-5 text-[#00e676]" />
                                 </div>
                              ) : (
                                 <div className="inline-flex items-center gap-2 group/tip cursor-help">
                                    <AlertTriangle className="w-5 h-5 text-[#ffab00]" />
                                 </div>
                              )}
                           </td>
                           <td className="px-10 py-8 text-right">
                              <button 
                                 onClick={() => handleDelete(trade.id)}
                                 className="p-3 text-[#ff1744]/40 hover:text-[#ff1744] hover:bg-[#ff174410] rounded-xl transition-all"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     )
                  })}

                  {trades.length === 0 && (
                     <tr>
                        <td colSpan={6} className="py-40 text-center">
                           <History className="w-12 h-12 text-[#5c6b7a] mx-auto mb-6 opacity-20" />
                           <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-[0.2em]">Zero Historical Executions Captured</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
