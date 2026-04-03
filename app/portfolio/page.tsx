"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/store/store"
import { PortfolioTable } from "@/components/portfolio/PortfolioTable"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { Plus, PieChart, TrendingUp, TrendingDown, DollarSign, Wallet, Activity, Sparkles, Terminal } from "lucide-react"
import { fetchMultipleQuotes } from "@/lib/api"
import { StockData } from "@/lib/types"
import { AnimatedNumber } from "@/components/ui/AnimatedNumber"
import { PulseDot } from "@/components/ui/PulseDot"
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/FadeIn"
import { Skeleton } from "@/components/ui/skeleton"

export default function PortfolioPage() {
  const { portfolio, paperBalance, buyStock, sellStock, tradeHistory, resetPaperAccount, selectedMarket } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ symbol: '', quantity: '', price: '' })
  const [livePrices, setLivePrices] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (portfolio.length === 0) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const symbols = portfolio.map(p => p.symbol)
        const quotes = await fetchMultipleQuotes(symbols)
        const priceMap = quotes.reduce((acc, q) => {
          acc[q.symbol] = q.price
          return acc
        }, {} as Record<string, number>)
        setLivePrices(priceMap)
      } catch (err) {
        console.error('Portfolio lookup failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [portfolio])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.symbol || !form.quantity || !form.price) return
    
    buyStock(
      form.symbol.toUpperCase(),
      `${form.symbol.toUpperCase()} Stock`,
      Number(form.price),
      Number(form.quantity)
    )
    
    setForm({ symbol: '', quantity: '', price: '' })
    setShowAdd(false)
  }

  let totalInvested = 0
  let currentValue = 0
  
  portfolio.forEach(p => {
    const livePrice = livePrices[p.symbol] || p.buyPrice
    totalInvested += p.quantity * p.buyPrice
    currentValue += p.quantity * livePrice
  })

  const totalAccountValue = paperBalance + currentValue
  const totalPnl = currentValue - totalInvested
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0
  const isProfit = totalPnl >= 0

  if (loading && portfolio.length > 0) {
     return (
        <div className="space-y-12 animate-in fade-in px-6 max-w-7xl mx-auto">
           <Skeleton className="h-16 w-80 rounded-2xl shimmer" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-3xl shimmer" />)}
           </div>
           <Skeleton className="h-96 w-full rounded-[2.5rem] shimmer" />
        </div>
     )
  }

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
             <div className="flex items-center space-x-2 text-tvBlue">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Capital Allocation Monitor</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
               <Wallet className="w-8 h-8 text-white/20" /> 
               Virtual Vault
             </h1>
             <p className="text-[#8899a6] font-bold text-lg leading-tight uppercase tracking-tight">Paper Trading Protocol Active</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { if(confirm("Reset entire paper account?")) resetPaperAccount() }}
              className="px-6 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-tvRed hover:bg-tvRed/10 hover:border-tvRed/20 transition-all"
            >
              Reset Protocol
            </button>
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="px-8 py-4 bg-gradient-to-r from-tvGreen to-[#00c853] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-tvGreen/20 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" /> Execute Order
            </button>
          </div>
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="glass-card p-8 rounded-[2rem] border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-tvGreen" />
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest px-1">Symbol Ticker</label>
              <input 
                type="text" required placeholder="e.g. RELIANCE" 
                value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-tvGreen focus:ring-4 focus:ring-tvGreen/10 transition-all font-mono" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest px-1">Quantity/Shares</label>
              <input 
                type="number" required min="0.1" step="0.1" placeholder="10.00"
                value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-tvGreen focus:ring-4 focus:ring-tvGreen/10 transition-all font-mono" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest px-1">Avg Execution Price</label>
              <input 
                type="number" required min="1" step="0.01" placeholder="0.00"
                value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-tvGreen focus:ring-4 focus:ring-tvGreen/10 transition-all font-mono" 
              />
            </div>
            <button type="submit" className="w-full py-4 bg-tvBlue hover:bg-tvBlue/90 text-white font-black rounded-2xl transition-all shadow-xl shadow-tvBlue/20 uppercase text-[11px] tracking-widest">
              Confirm Transaction
            </button>
          </form>
        )}

        <StaggerContainer className="space-y-12">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem className="glass-card p-8 rounded-3xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tvBlue blur-[70px] opacity-10 pointer-events-none" />
              <p className="text-[11px] font-black text-[#8899a6] uppercase tracking-[0.2em] mb-4">Total Account Value</p>
              <h2 className="text-5xl font-black text-white font-mono tracking-tighter leading-none mb-6">
                 <AnimatedNumber value={totalAccountValue} prefix="₹" />
              </h2>
              <div className="flex items-center gap-2">
                 <PulseDot color="blue" />
                 <p className="text-xs text-tvBlue font-black uppercase tracking-widest">Reserved Cash: {formatCurrency(paperBalance)}</p>
              </div>
            </StaggerItem>
            
            <StaggerItem className={cn("glass-card p-8 rounded-3xl group overflow-hidden relative border-l-4", isProfit ? 'border-tvGreen' : 'border-tvRed')}>
              <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[70px] opacity-10 pointer-events-none", isProfit ? 'bg-tvGreen' : 'bg-tvRed')} />
              <p className="text-[11px] font-black text-[#8899a6] uppercase tracking-[0.2em] mb-4">Unrealized Performance</p>
              <h2 className={cn("text-5xl font-black font-mono tracking-tighter leading-none mb-6", isProfit ? 'text-tvGreen' : 'text-tvRed')}>
                 {isProfit ? '+' : ''}<AnimatedNumber value={totalPnl} prefix="₹" />
              </h2>
              <div className="flex items-center gap-3">
                 <div className={cn("px-2 py-1 rounded text-[10px] font-black tracking-widest", isProfit ? 'bg-tvGreen/20' : 'bg-tvRed/20')}>
                    {isProfit ? '+' : ''}{totalPnlPercent.toFixed(2)}% ALPHA
                 </div>
                 <p className="text-[10px] text-[#5c6b7a] font-black uppercase tracking-widest">Equity Momentum</p>
              </div>
            </StaggerItem>

            <StaggerItem className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden text-center group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-tvPurple blur-[70px] opacity-10 pointer-events-none" />
               <div className="w-20 h-20 rounded-full border-[8px] border-tvPurple/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <PieChart className="w-8 h-8 text-tvPurple" />
               </div>
               <p className="mt-4 text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Allocation Profile</p>
               <p className="text-xl font-black text-white tracking-tighter mt-1">{portfolio.length} ACTIVE ASSETS</p>
            </StaggerItem>
          </div>

          {/* Holdings Section */}
          <StaggerItem className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                   <Activity className="w-6 h-6 text-tvBlue" /> Asset Monitor
                </h3>
             </div>
             {portfolio.length === 0 ? (
                <div className="glass-card p-20 rounded-[3rem] text-center border-dashed border-white/10">
                   <p className="text-gray-500 font-black uppercase tracking-widest">No active positions deployed.</p>
                </div>
             ) : (
                <PortfolioTable livePrices={livePrices} />
             )}
          </StaggerItem>

          {/* Trade History Section */}
          {tradeHistory.length > 0 && (
            <StaggerItem className="space-y-6">
               <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-gray-500" /> Operational History
               </h3>
               <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5">
                  <div className="overflow-x-auto custom-scrollbar">
                     <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-gray-500 uppercase bg-white/[0.02] border-b border-white/5">
                           <tr>
                              <th className="px-8 py-5 font-black tracking-widest">Symbol</th>
                              <th className="px-8 py-5 font-black tracking-widest text-right">Shares</th>
                              <th className="px-8 py-5 font-black tracking-widest text-right">Buy Price</th>
                              <th className="px-8 py-5 font-black tracking-widest text-right">Sell Price</th>
                              <th className="px-8 py-5 font-black tracking-widest text-right">Net P&L</th>
                              <th className="px-8 py-5 font-black tracking-widest text-right">Timestamp</th>
                           </tr>
                        </thead>
                        <tbody>
                           {tradeHistory.map((h: any, i: number) => {
                              const pnl = (h.sellPrice - h.buyPrice) * h.quantity
                              const profit = pnl >= 0
                              return (
                                 <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                    <td className="px-8 py-5 font-black text-white">{h.symbol}</td>
                                    <td className="px-8 py-5 text-right font-bold text-gray-400 font-mono">{h.quantity}</td>
                                    <td className="px-8 py-5 text-right font-bold text-gray-400 font-mono">{formatCurrency(h.buyPrice, selectedMarket)}</td>
                                    <td className="px-8 py-5 text-right font-bold text-white font-mono">{formatCurrency(h.sellPrice, selectedMarket)}</td>
                                    <td className={cn("px-8 py-5 text-right font-black font-mono", profit ? 'text-tvGreen' : 'text-tvRed')}>
                                       {profit ? '+' : ''}{formatCurrency(pnl, selectedMarket)}
                                    </td>
                                    <td className="px-8 py-5 text-right text-[10px] text-gray-600 font-bold uppercase">
                                       {new Date(h.sellDate).toLocaleDateString()}
                                    </td>
                                 </tr>
                              )
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </StaggerItem>
          )}
        </StaggerContainer>
      </div>
    </FadeIn>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
