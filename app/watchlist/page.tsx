"use client"

import { useEffect, useState, useMemo } from "react"
import { useStore } from "@/store/store"
import { SignalCard } from "@/components/signals/SignalCard"
import Link from "next/link"
import { 
  Search, 
  Star, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  LayoutGrid, 
  Layers, 
  Plus, 
  Filter, 
  ArrowUpDown,
  Bell,
  CheckSquare,
  Square,
  BarChart2
} from "lucide-react"
import { StockData, Signal } from "@/lib/types"
import { fetchMultipleQuotes } from "@/lib/api"
import { generateSignal } from "@/lib/signals"
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/FadeIn"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, watchlistGroups, setWatchlistGroups, alerts } = useStore()
  const [data, setData] = useState<(StockData & { signal: Signal })[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change' | 'strength'>('name')
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])
  
  useEffect(() => {
    const loadData = async () => {
      if (watchlist.length === 0) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const symbols = watchlist.map(w => w.symbol)
        const quotes = await fetchMultipleQuotes(symbols)
        
        setData(quotes.map(q => ({
          ...q,
          signal: generateSignal([] as any) 
        })))
      } catch (err) {
        console.error('Watchlist fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [watchlist])

  const filteredData = useMemo(() => {
    let result = [...data]
    
    // Group filter
    if (activeGroup !== 'all') {
      const group = watchlistGroups.find(g => g.id === activeGroup)
      if (group) result = result.filter(d => group.symbols.includes(d.symbol))
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.symbol.localeCompare(b.symbol)
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'change') return b.changePercent - a.changePercent
      if (sortBy === 'strength') return b.signal.strength - a.signal.strength
      return 0
    })

    return result
  }, [data, activeGroup, sortBy, watchlistGroups])

  const stats = useMemo(() => {
    const buys = data.filter(d => d.signal.type.includes('BULLISH')).length
    const sells = data.filter(d => d.signal.type.includes('BEARISH')).length
    const holds = data.filter(d => d.signal.type === 'NEUTRAL').length
    return { buys, sells, holds, total: data.length }
  }, [data])

  const toggleSelect = (sym: string) => {
    setSelectedSymbols(curr => curr.includes(sym) ? curr.filter(s => s !== sym) : [...curr, sym])
  }

  const createGroup = () => {
    const name = prompt("Enter Protocol Group Name:")
    if (name) {
      setWatchlistGroups([...watchlistGroups, { id: Math.random().toString(36).substr(2, 9), name, symbols: [] }])
    }
  }

  if (loading) return <WatchlistSkeleton />

  if (watchlist.length === 0) return <EmptyWatchlist />

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="space-y-10">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-4">
                 <div className="flex items-center space-x-2 text-[#ffab00]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Watch Array</span>
                 </div>
                 <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-6">
                   Watchlist
                   <div className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-[#8899a6]">
                      {stats.total} ASSETS TRACKED
                   </div>
                 </h1>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="glass-card px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-6">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-[#00e676] uppercase tracking-widest">{stats.buys} BUY</span>
                       <div className="w-full h-1 bg-[#00e67620] rounded-full mt-1"><div className="h-full bg-[#00e676]" style={{ width: `${(stats.buys/stats.total)*100}%` }} /></div>
                    </div>
                    <div className="w-px h-6 bg-white/5" />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-[#ff1744] uppercase tracking-widest">{stats.sells} SELL</span>
                       <div className="w-full h-1 bg-[#ff174420] rounded-full mt-1"><div className="h-full bg-[#ff1744]" style={{ width: `${(stats.sells/stats.total)*100}%` }} /></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Toolbar */}
           <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-2 bg-white/5 border border-white/10 rounded-[2rem]">
              <div className="flex flex-wrap items-center gap-2 p-1">
                 <button 
                   onClick={() => setActiveGroup('all')}
                   className={cn("px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeGroup === 'all' ? "bg-white text-black" : "text-[#8899a6] hover:bg-white/5 hover:text-white")}
                 >
                    All Assets
                 </button>
                 {watchlistGroups.map(g => (
                   <button 
                     key={g.id}
                     onClick={() => setActiveGroup(g.id)}
                     className={cn("px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeGroup === g.id ? "bg-white text-black" : "text-[#8899a6] hover:bg-white/5 hover:text-white")}
                   >
                      {g.name}
                   </button>
                 ))}
                 <button onClick={createGroup} className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white hover:bg-white/10"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center gap-4 px-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest border-r border-white/10 pr-6">
                    <ArrowUpDown className="w-4 h-4" />
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent border-none outline-none appearance-none cursor-pointer text-white hover:text-[#00e676]"
                    >
                       <option value="name">Sort by Name</option>
                       <option value="price">Sort by Price</option>
                       <option value="change">Sort by Volatility</option>
                       <option value="strength">Sort by Probability</option>
                    </select>
                 </div>
                 <Link 
                   href={selectedSymbols.length >= 2 ? `/compare?symbols=${selectedSymbols.join(',')}` : '#'}
                   className={cn(
                     "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                     selectedSymbols.length >= 2 ? "bg-[#2979ff] text-white" : "bg-white/5 text-gray-600 cursor-not-allowed"
                   )}
                 >
                   <BarChart2 className="w-4 h-4" /> Compare Matrix ({selectedSymbols.length})
                 </Link>
              </div>
           </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map(item => {
            const hasAlert = alerts.some(a => a.symbol === item.symbol && !a.triggered)
            const isSelected = selectedSymbols.includes(item.symbol)
            return (
              <StaggerItem key={item.symbol} className="relative group">
                {/* Selection Checkbox Overlay */}
                <button 
                   onClick={() => toggleSelect(item.symbol)}
                   className={cn(
                     "absolute top-4 left-4 p-2 rounded-xl z-[20] transition-all border",
                     isSelected ? "bg-[#2979ff] border-transparent text-white" : "bg-white/5 border-white/10 text-white/20 hover:text-white group-hover:opacity-100 opacity-0"
                   )}
                >
                   {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </button>

                <SignalCard stock={item} signal={item.signal} />
                
                {/* Alert Indicator */}
                {hasAlert && (
                   <div className="absolute top-4 right-16 px-2.5 py-1 bg-[#00e67610] border border-[#00e67630] rounded-lg text-[#00e676] flex items-center gap-1.5 z-20">
                      <Bell className="w-3 h-3 fill-current" />
                      <span className="text-[9px] font-black">SENTINEL ACTIVE</span>
                   </div>
                )}

                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromWatchlist(item.symbol); }}
                  className="absolute top-4 right-4 p-2.5 bg-[#ff174410] hover:bg-[#ff1744] text-[#ff1744] hover:text-white rounded-xl z-[20] opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-[#ff174420] active:scale-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </FadeIn>
  )
}

function WatchlistSkeleton() {
  return (
    <div className="space-y-12 animate-in fade-in px-6 max-w-7xl mx-auto">
       <Skeleton className="h-16 w-80 rounded-2xl shimmer" />
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <Skeleton key={i} className="h-80 w-full rounded-3xl shimmer" />)}
       </div>
    </div>
  )
}

function EmptyWatchlist() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in px-6">
      <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/10 group hover:scale-110 transition-transform cursor-pointer">
         <Star className="w-16 h-16 text-[#ffab00] opacity-30 group-hover:opacity-100 transition-opacity" />
      </div>
      <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Your Watchlist is Empty</h2>
      <p className="text-[#8899a6] mb-12 max-w-md font-bold leading-relaxed text-lg text-center">Pin your favorite assets to track exact mathematically generated entries and targets in real-time.</p>
      <Link href="/screener" className="px-10 py-5 bg-gradient-to-r from-[#00e676] to-[#00c853] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#00e67620] flex items-center gap-3">
        <Search className="w-5 h-5" /> Browse Market Array →
      </Link>
    </div>
  )
}
