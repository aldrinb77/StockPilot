"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/store"
import { SignalCard } from "@/components/signals/SignalCard"
import Link from "next/link"
import { Search, Star, Trash2, ArrowRight, Sparkles, Terminal } from "lucide-react"
import { StockData, Signal } from "@/lib/types"
import { fetchMultipleQuotes } from "@/lib/api"
import { generateSignal } from "@/lib/signals"
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/FadeIn"
import { Skeleton } from "@/components/ui/skeleton"

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useStore()
  const [data, setData] = useState<(StockData & { signal: Signal })[]>([])
  const [loading, setLoading] = useState(true)
  
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

  if (loading) {
     return (
        <div className="space-y-12 animate-in fade-in px-6 max-w-7xl mx-auto">
           <Skeleton className="h-16 w-80 rounded-2xl shimmer" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => <Skeleton key={i} className="h-80 w-full rounded-3xl shimmer" />)}
           </div>
        </div>
     )
  }

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in px-6">
        <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/10 group hover:scale-110 transition-transform cursor-pointer">
           <Star className="w-16 h-16 text-[#ffab00] opacity-30 group-hover:opacity-100 transition-opacity" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Your Watchlist is Empty</h2>
        <p className="text-[#8899a6] mb-12 max-w-md font-bold leading-relaxed text-lg">Pin your favorite assets to track exact mathematically generated entries and targets in real-time.</p>
        <Link href="/screener" className="px-10 py-5 bg-gradient-to-r from-[#00e676] to-[#00c853] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#00e67620] flex items-center gap-3">
          <Search className="w-5 h-5" /> Browse Market →
        </Link>
        
        <div className="mt-20 w-full max-w-3xl border-2 border-dashed border-white/5 rounded-[2rem] p-12 opacity-50">
           <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-[0.4em]">Pinned Strategy Terminal</p>
        </div>
      </div>
    )
  }

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
             <div className="flex items-center space-x-2 text-[#ffab00]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pinned Strategy Feed</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
               <Terminal className="w-8 h-8 text-white/20" /> 
               Watchlist
             </h1>
             <p className="text-[#8899a6] font-bold text-lg">Tracking {watchlist.length} pinned configurations over the active market array.</p>
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map(item => (
            <StaggerItem key={item.symbol} className="relative group">
              <SignalCard stock={item} signal={item.signal} />
              
              {/* Quick Remove Wrapper */}
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromWatchlist(item.symbol); }}
                className="absolute top-4 right-4 p-2 bg-[#ff174410] hover:bg-[#ff1744] text-[#ff1744] hover:text-white rounded-xl z-[20] opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-[#ff174420] active:scale-90"
                title="Remove from Watchlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </FadeIn>
  )
}
