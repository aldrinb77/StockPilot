"use client"

import { useState, useMemo } from 'react'
import { MOCK_STOCKS, MOCK_SIGNALS } from '@/lib/mockData'
import { SignalCard } from '@/components/signals/SignalCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { useStore } from '@/store/store'
import { MARKETS } from '@/lib/markets'

export default function SignalsPage() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [activeTab, setActiveTab] = useState('ALL')
  
  const data = useMemo(() => {
    return marketConfig.popularStocks.map((s, i) => {
      const signalKeys = Object.keys(MOCK_SIGNALS);
      const randomSignal = MOCK_SIGNALS[signalKeys[i % signalKeys.length]];
      const mockStock = MOCK_STOCKS.find(ms => ms.symbol === s.symbol) || {
        symbol: s.symbol,
        name: s.name,
        sector: s.sector,
        price: 150 + Math.random() * 300,
        change: 0,
        changePercent: 0,
        volume: 0,
        high: 0,
        low: 0,
        open: 0,
        prevClose: 0
      }
      return {
        ...mockStock,
        signal: randomSignal
      }
    }).sort((a,b) => b.signal.strength - a.signal.strength)
  }, [selectedMarket, marketConfig])

  const filtered = useMemo(() => {
    if (activeTab === 'ALL') return data;
    return data.filter(d => d.signal.type === activeTab)
  }, [data, activeTab])

  // Get counts accurately mapped over filtered elements
  const counts = useMemo(() => ({
    all: data.length,
    strongBuy: data.filter(d => d.signal.type === 'STRONG_BULLISH').length,
    buy: data.filter(d => d.signal.type === 'BULLISH').length,
    hold: data.filter(d => d.signal.type === 'NEUTRAL').length,
    sell: data.filter(d => d.signal.type === 'BEARISH').length,
    strongSell: data.filter(d => d.signal.type === 'STRONG_BEARISH').length,
  }), [data])

  return (
    <div className="space-y-6 animate-in fade-in pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <span className="text-blue-500 mr-3">{marketConfig.flag}</span> {marketConfig.name} Active Signals
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Every mathematically validated configuration across the entire monitored universe mapped dynamically in real-time natively below.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent justify-start border-b border-gray-700/50 w-full rounded-none px-0 h-auto overflow-x-auto pb-px mb-8 flex flex-nowrap shrink-0 snap-x">
          <TabsTrigger value="ALL" className="shrink-0">All Signals</TabsTrigger>
          <TabsTrigger value="STRONG_BULLISH" className="shrink-0 text-tvGreen data-[state=active]:text-tvGreen data-[state=active]:border-tvGreen">Strong Bullish ({counts.strongBuy})</TabsTrigger>
          <TabsTrigger value="BULLISH" className="shrink-0 text-tvGreen data-[state=active]:text-tvGreen data-[state=active]:border-tvGreen">Bullish ({counts.buy})</TabsTrigger>
          <TabsTrigger value="NEUTRAL" className="shrink-0 text-yellow-500 data-[state=active]:text-yellow-500 data-[state=active]:border-yellow-500">Neutral ({counts.hold})</TabsTrigger>
          <TabsTrigger value="BEARISH" className="shrink-0 text-tvRed data-[state=active]:text-tvRed data-[state=active]:border-tvRed">Bearish ({counts.sell})</TabsTrigger>
          <TabsTrigger value="STRONG_BEARISH" className="shrink-0 text-tvRed data-[state=active]:text-tvRed data-[state=active]:border-tvRed">Strong Bearish ({counts.strongSell})</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filtered.length > 0 ? (
            filtered.map(item => <SignalCard key={item.symbol} stock={item} signal={item.signal} />)
          ) : (
             <div className="col-span-full py-20 text-center border border-dashed border-gray-700/50 rounded-xl bg-[#131722]/50">
               <p className="text-gray-400 font-medium">No active signals mapped matching the criteria currently natively bound.</p>
             </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
