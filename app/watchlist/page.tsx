"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/store/store"
import { MOCK_STOCKS, MOCK_SIGNALS } from "@/lib/mockData"
import { SignalCard } from "@/components/signals/SignalCard"
import Link from "next/link"
import { Search } from "lucide-react"
import { StockData, Signal } from "@/lib/types"

import { fetchMultipleQuotes } from "@/lib/api"

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useStore()
  const [data, setData] = useState<(StockData & { signal: Signal; isMockData?: boolean })[]>([])
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
        
        const mapped = quotes.map(q => ({
          ...q,
          signal: MOCK_SIGNALS[q.symbol] || MOCK_SIGNALS['META']
        }))
        
        setData(mapped)
      } catch (err) {
        console.error('Watchlist fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [watchlist])

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in">
        <span className="text-6xl mb-6">⭐</span>
        <h2 className="text-2xl font-bold text-white mb-3">Your Watchlist is Empty</h2>
        <p className="text-gray-400 mb-8 max-w-md">Keep track of the exact mathematically generated entries and targets by actively pinning targets here from the Screener.</p>
        <Link href="/screener" className="px-6 py-3 bg-tvGreen text-white rounded-lg font-bold hover:bg-tvGreen/90 transition-colors shadow-lg shadow-tvGreen/20 flex items-center">
          <Search className="w-5 h-5 mr-2" /> Go to Screener
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center"><span className="text-yellow-500 mr-3">⭐</span> Watchlist</h1>
          <p className="text-gray-400 mt-2 text-sm">Tracking {watchlist.length} pinned configurations natively over the active market array.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(item => (
          <div key={item.symbol} className="relative group">
            <SignalCard stock={item} signal={item.signal} />
            
            {/* New Signal Pulse - If it's a Strong buy/sell we highlight to the user visually */}
            {item.signal.type.includes('STRONG') && (
              <div className="absolute -top-3 -right-3 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase rounded shadow-lg animate-pulse z-20 shadow-blue-600/50">
                New Signal
              </div>
            )}
            
            {/* Quick Remove Wrapper mapping directly over Card component space entirely securely */}
            <button 
              onClick={() => removeFromWatchlist(item.symbol)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-900/80 hover:bg-red-500/80 text-gray-300 hover:text-white rounded z-10 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm shadow border border-gray-700/50"
              title="Remove from Watchlist"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
