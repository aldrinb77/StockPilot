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
  const { portfolio, addToPortfolio, selectedMarket } = useStore()
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
    
    addToPortfolio({
      id: Date.now().toString(),
      symbol: form.symbol.toUpperCase(),
      name: `${form.symbol.toUpperCase()} Stock`,
      quantity: Number(form.quantity),
      buyPrice: Number(form.price),
      buyDate: Date.now()
    })
    
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

  const totalPnl = currentValue - totalInvested
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0
  const isProfit = totalPnl >= 0

  if (loading) {
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
             <div className="flex items-center space-x-2 text-[#2979ff]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Capital Allocation Monitor</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
               <Terminal className="w-8 h-8 text-white/20" /> 
               Portfolio Guard
             </h1>
             <p className="text-[#8899a6] font-bold text-lg">Live simulation of your active holdings tracking real-time fluctuations.</p>
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="px-8 py-4 bg-gradient-to-r from-[#00e676] to-[#00c853] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#00e67620] flex items-center gap-3"
          >
            <Plus className="w-5 h-5" /> Open Position
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="glass-card p-8 rounded-[2rem] border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00e676]" />
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest px-1">Symbol Ticker</label>
              <input 
                type="text" required placeholder="e.g. RELIANCE" 
                value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-[#00e676] focus:ring-4 focus:ring-[#00e67610] transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest px-1">Quantity/Shares</label>
              <input 
                type="number" required min="0.1" step="0.1" placeholder="10.00"
                value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-[#00e676] focus:ring-4 focus:ring-[#00e67610] transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest px-1">Avg Execution Price</label>
              <input 
                type="number" required min="1" step="0.01" placeholder="0.00"
                value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-[#00e676] focus:ring-4 focus:ring-[#00e67610] transition-all" 
              />
            </div>
            <button type="submit" className="w-full py-4 bg-[#2979ff] hover:bg-[#2979ff]/90 text-white font-black rounded-2xl transition-all shadow-xl shadow-[#2979ff20] uppercase text-[11px] tracking-widest">
              Confirm Transaction
            </button>
          </form>
        )}

        {portfolio.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed border-white/5 rounded-[3rem] px-8">
            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8">
               <DollarSign className="w-12 h-12 text-[#5c6b7a] opacity-30" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Portfolio Inactive</h2>
            <p className="text-[#8899a6] mb-10 max-w-md font-bold text-lg leading-relaxed">Your simulated holdings will appear here. Start by adding your active positions above.</p>
            <button onClick={() => setShowAdd(true)} className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
               Start Tracking Now
            </button>
          </div>
        ) : (
          <StaggerContainer className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StaggerItem className="glass-card p-8 rounded-3xl group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2979ff] blur-[70px] opacity-10 pointer-events-none" />
                <p className="text-[11px] font-black text-[#8899a6] uppercase tracking-[0.2em] mb-4">Total Liquidation Value</p>
                <h2 className="text-5xl font-black text-white font-mono tracking-tighter leading-none mb-6">
                   <AnimatedNumber value={currentValue} prefix="₹" />
                </h2>
                <div className="flex items-center gap-2">
                   <PulseDot color="green" />
                   <p className="text-xs text-[#00e676] font-black uppercase tracking-widest">Invested: {formatCurrency(totalInvested)}</p>
                </div>
              </StaggerItem>
              
              <StaggerItem className={cn("glass-card p-8 rounded-3xl group overflow-hidden relative border-l-4", isProfit ? 'border-[#00e676]' : 'border-[#ff1744]')}>
                <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[70px] opacity-10 pointer-events-none", isProfit ? 'bg-[#00e676]' : 'bg-[#ff1744]')} />
                <p className="text-[11px] font-black text-[#8899a6] uppercase tracking-[0.2em] mb-4">Unrealized P&L</p>
                <h2 className={cn("text-5xl font-black font-mono tracking-tighter leading-none mb-6", isProfit ? 'text-[#00e676]' : 'text-[#ff1744]')}>
                   {isProfit ? '+' : ''}<AnimatedNumber value={totalPnl} prefix="₹" />
                </h2>
                <div className="flex items-center gap-3">
                   <div className={cn("px-2 py-1 rounded text-[10px] font-black tracking-widest", isProfit ? 'bg-[#00e67620]' : 'bg-[#ff174420]')}>
                      {isProfit ? '+' : ''}{totalPnlPercent.toFixed(2)}% ROI
                   </div>
                   <p className="text-[10px] text-[#5c6b7a] font-black uppercase tracking-widest">Market Variance</p>
                </div>
              </StaggerItem>

              <StaggerItem className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden text-center group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c4dff] blur-[70px] opacity-10 pointer-events-none" />
                 <div className="w-20 h-20 rounded-full border-[8px] border-[#7c4dff20] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <PieChart className="w-8 h-8 text-[#7c4dff]" />
                 </div>
                 <p className="mt-4 text-[10px] font-black text-[#8899a6] uppercase tracking-widest">Allocation Profile</p>
                 <p className="text-xl font-black text-white tracking-tighter mt-1">{portfolio.length} ACTIVE ASSETS</p>
              </StaggerItem>
            </div>

            <StaggerItem className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
               <div className="p-8 border-b border-white/5 flex items-center gap-4">
                  <Activity className="w-6 h-6 text-[#2979ff]" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Live Monitor</h3>
               </div>
               <PortfolioTable livePrices={livePrices} />
            </StaggerItem>
          </StaggerContainer>
        )}
      </div>
    </FadeIn>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
