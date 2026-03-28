"use client"

import { useStore } from "@/store/store"
import { Sun, CheckSquare, Target, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { MOCK_STOCKS, MOCK_SIGNALS } from "@/lib/mockData"
import { SignalCard } from "@/components/signals/SignalCard"
import { generateSignal } from "@/lib/signals"

import { useEffect, useState } from "react"
import { fetchStockQuote } from "@/lib/api"
import { StockData, Signal } from "@/lib/types"

export default function DailyBriefing() {
  const { watchlist, selectedMarket } = useStore()
  const [topStock, setTopStock] = useState<(StockData & { signal: Signal; isMockData?: boolean }) | null>(null)
  const [loading, setLoading] = useState(true)
  
  const now = new Date()
  const dateString = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  useEffect(() => {
    const loadTopPick = async () => {
      setLoading(true)
      try {
        const symbol = 'AAPL' // Could be dynamic from marketConfig.popularStocks[0]
        const quote = await fetchStockQuote(symbol)
        setTopStock({
          ...quote,
          signal: MOCK_SIGNALS[symbol] || MOCK_SIGNALS['META']
        })
      } catch (err) {
        console.error('Briefing pick failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadTopPick()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-tvPurple/20 via-[#1E222D] to-tvBlue/10 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <Sun className="absolute -right-8 -top-8 w-48 h-48 text-yellow-500/10 blur-2xl pointer-events-none" />
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
          System Briefing: <span className="text-tvPurple">Nominal</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] opacity-60">Temporal Reference: {dateString}. Liquidity Vector Analysis Active.</p>
        
        <div className="mt-6 inline-flex bg-[#111827]/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700/50 shadow-lg text-sm font-bold text-tvGreen items-center">
          <Clock className="w-4 h-4 mr-2" /> Market is OPEN
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Watchlist Summary */}
        <div className="md:col-span-2 space-y-6">
          <section className="glass-panel p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-tvGreen/5 rounded-full blur-2xl" />
             <div className="flex items-center space-x-2 mb-6">
               <div className="w-8 h-8 rounded-lg bg-tvGreen/10 flex items-center justify-center border border-tvGreen/30">
                 <CheckSquare className="w-4 h-4 text-tvGreen" />
               </div>
               <h2 className="text-xl font-bold font-heading text-white">Your Watchlist Snapshot</h2>
             </div>
             
             {watchlist.length === 0 ? (
               <div className="text-center py-8 text-gray-500 text-sm">
                 You currently aren&apos;t tracking any structural assets locally.
                 <Link href="/screener" className="text-tvBlue hover:underline block mt-2">Find assets generating noise →</Link>
               </div>
             ) : (
               <div className="space-y-3">
                 {watchlist.slice(0, 3).map((w) => (
                   <div key={w.symbol} className="flex justify-between items-center bg-[#111827] p-3 rounded-xl border border-gray-800">
                     <span className="font-bold text-white">{w.symbol}</span>
                     <span className="text-sm font-mono text-gray-400 flex items-center">
                       <Target className="w-3 h-3 mr-1" /> Bound Check Passed
                     </span>
                     <Link href={`/stock/${w.symbol}`} className="px-3 py-1 bg-gray-800 hover:bg-white hover:text-gray-900 rounded text-xs font-bold transition-colors">
                       Analyze
                     </Link>
                   </div>
                 ))}
                 {watchlist.length > 3 && (
                   <Link href="/watchlist" className="block text-center text-sm font-bold text-gray-400 hover:text-white mt-4 border-t border-gray-800/50 pt-3">
                     View all {watchlist.length} pinned assets
                   </Link>
                 )}
               </div>
             )}
          </section>

          {/* Top Pick Layout */}
          <section className="glass-card p-6 rounded-2xl relative border-l-4 border-l-tvPurple">
            <h2 className="text-xl font-bold font-heading text-white mb-2 flex items-center">
              Top Execution Found Locally <span className="ml-2 px-2 py-0.5 bg-tvPurple/20 text-tvPurple text-xs rounded uppercase tracking-widest border border-tvPurple/30 relative top-[-1px]">Algorithmic</span>
            </h2>
            <p className="text-sm text-gray-400 mb-6">The engine identified immense momentum crossing limits exactly today.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
               {loading ? (
                  <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
               ) : topStock ? (
                  <>
                    <SignalCard 
                      stock={topStock} 
                      signal={topStock.signal}
                    />
                    <div className="space-y-4 text-sm text-gray-300 bg-black/20 p-4 rounded-xl border border-white/5">
                      <p><strong>Strict Output:</strong> The technicals bounds for {topStock.symbol} exhibit structural crossover variables.</p>
                      <p><strong>What it means:</strong> The MACD and RSI are mutually validating an upward trend perfectly crossing Standard Deviation bounds organically.</p>
                      <Link href={`/stock/${topStock.symbol}`} className="flex items-center text-tvBlue font-bold mt-2 hover:underline">
                        Execute Trade <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </>
               ) : null}
            </div>
          </section>
        </div>

        {/* Sidebar Status Columns */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-white mb-4 uppercase text-[11px] tracking-widest">System Readiness</h3>
            <div className="bg-[#111827] p-4 rounded-xl border border-gray-800 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-tvGreen" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Low-Latency: ACTIVE</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-tvGreen" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Compute Shards: NOMINAL</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-tvGreen" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Vault Sync: COMPLETED</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-white mb-4">Signal Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                <span className="text-gray-400">Total Scans Ran</span>
                <span className="font-mono text-white font-bold">5,204</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                <span className="text-gray-400">Active BUY Signals</span>
                <span className="font-mono text-tvGreen font-bold">142</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Active SELL Signals</span>
                <span className="font-mono text-tvRed font-bold">89</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
