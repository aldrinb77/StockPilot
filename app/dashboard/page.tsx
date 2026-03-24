"use client"

import { useEffect, useState } from 'react'
import { MOCK_STOCKS, MOCK_SIGNALS } from '@/lib/mockData'
import { StockData, Signal } from '@/lib/types'
import { MarketOverview } from '@/components/market/MarketOverview'
import { TopMovers } from '@/components/market/TopMovers'
import { SignalCard } from '@/components/signals/SignalCard'
import { getMarketStatus } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { RecommendedForYou } from '@/components/market/RecommendedForYou'

export default function DashboardPage() {
  const [data, setData] = useState<(StockData & { signal: Signal })[]>([])
  const [loading, setLoading] = useState(true)
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed' | 'pre-market' | 'after-hours'>('closed')

  useEffect(() => {
    setMarketStatus(getMarketStatus())
    const interval = setInterval(() => setMarketStatus(getMarketStatus()), 60000)
    
    // Simulate purely client side fetch for MVP utilizing mocked arrays mapped cleanly
    const loadData = async () => {
      try {
        // Normally this handles batch API logic hitting proxy API. 
        // For safe fallback MVP, map defaults tightly.
        const mapped = MOCK_STOCKS.map(s => ({
          ...s,
          signal: MOCK_SIGNALS[s.symbol] || MOCK_SIGNALS['META'] // fallback to generic hold
        }))
        
        // Wait 800ms to mock network delay
        await new Promise(r => setTimeout(r, 800))
        setData(mapped)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
        </div>
        <Skeleton className="h-6 w-full max-w-sm rounded-sm" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-8 w-48 mb-4 bg-tvGreen/20" />
            <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-[350px] w-full rounded-xl" />)}</div>
          </div>
          <div>
            <Skeleton className="h-8 w-48 mb-4 bg-tvRed/20" />
            <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-[350px] w-full rounded-xl" />)}</div>
          </div>
        </div>
      </div>
    )
  }

  const buySignals = data.filter(s => s.signal.type.includes('BUY')).sort((a,b) => b.signal.strength - a.signal.strength).slice(0, 5)
  const sellSignals = data.filter(s => s.signal.type.includes('SELL')).sort((a,b) => b.signal.strength - a.signal.strength).slice(0, 5)
  
  const gainers = [...data].sort((a,b) => b.changePercent - a.changePercent).slice(0, 5)
  const losers = [...data].sort((a,b) => a.changePercent - b.changePercent).slice(0, 5)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Disclaimer Banner */}
      <div className="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-center">
        ⚠️ Signals are based on mathematical technical indicators only. This is not financial advice.
      </div>

      <RecommendedForYou />

      {/* ROW 1: Market Overview */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Market Overview</h2>
        <MarketOverview />
      </section>

      {/* ROW 2: Market Status */}
      <section className="flex items-center space-x-3 bg-[#131722] p-3 rounded-md border border-gray-800">
        <span className="text-sm text-gray-400 font-medium">Market Status:</span>
        {marketStatus === 'open' ? (
          <span className="px-2.5 py-1 rounded bg-tvGreen/20 text-tvGreen border border-tvGreen/30 text-xs font-bold uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 rounded-full bg-tvGreen mr-2 animate-pulse" /> OPEN
          </span>
        ) : marketStatus === 'closed' ? (
          <span className="px-2.5 py-1 rounded bg-tvRed/20 text-tvRed border border-tvRed/30 text-xs font-bold uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 rounded-full bg-tvRed mr-2" /> CLOSED
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 text-xs font-bold uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse" /> {marketStatus.replace('-', ' ')}
          </span>
        )}
        <span className="text-xs text-gray-500 ml-auto bg-gray-800 px-2 py-1 rounded">{new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' })}</span>
      </section>

      {/* ROW 3: Top Signals */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center"><span className="text-tvGreen mr-2">🟢</span> Top BUY Signals</h2>
          <div className="space-y-4">
            {buySignals.length > 0 ? buySignals.map(item => (
              <SignalCard key={item.symbol} stock={item} signal={item.signal} />
            )) : <div className="p-8 text-center text-gray-500 bg-[#1E222D] rounded-xl border border-gray-700/50">No strong buy signals right now</div>}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center"><span className="text-tvRed mr-2">🔴</span> Top SELL Signals</h2>
          <div className="space-y-4">
            {sellSignals.length > 0 ? sellSignals.map(item => (
              <SignalCard key={item.symbol} stock={item} signal={item.signal} />
            )) : <div className="p-8 text-center text-gray-500 bg-[#1E222D] rounded-xl border border-gray-700/50">No strong sell signals right now</div>}
          </div>
        </div>
      </section>

      {/* ROW 4: Top Movers */}
      <section className="pt-4">
        <TopMovers gainers={gainers} losers={losers} />
      </section>

    </div>
  )
}
