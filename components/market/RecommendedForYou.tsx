"use client"

import { useEffect, useState } from "react"
import { SignalCard } from "@/components/signals/SignalCard"
import { generateRecommendations, StockWithSignal } from "@/lib/recommendations"
import { MOCK_STOCKS } from "@/lib/mockData"
import { generateSignal } from "@/lib/signals"
import { Pin } from "lucide-react"

import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"

export function RecommendedForYou() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [recommended, setRecommended] = useState<{ stocks: StockWithSignal[], reason: string } | null>(null)

  useEffect(() => {
    const mapped = marketConfig.popularStocks.map(s => {
      const mockStock = MOCK_STOCKS.find(ms => ms.symbol === s.symbol) || {
        ...MOCK_STOCKS[0],
        symbol: s.symbol,
        name: s.name,
        price: 150 + Math.random() * 500
      }
      
      const mockOHLCV = []
      let p = mockStock.price * 0.8
      for(let i=0; i<30; i++) {
        p = p * (1 + (Math.random() - 0.45) * 0.05)
        mockOHLCV.push({ time: i, open: p, high: p*1.02, low: p*0.98, close: p, volume: 10000 })
      }
      return { ...mockStock, signal: generateSignal(mockOHLCV) }
    })
    
    setTimeout(() => {
      const recs = generateRecommendations(mapped)
      setRecommended(recs)
    }, 500)
  }, [marketConfig, selectedMarket])

  if (!recommended || recommended.stocks.length === 0) return null

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-tvPurple/10 flex items-center justify-center border border-tvPurple/30">
          <Pin className="w-4 h-4 text-tvPurple" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Recommended For You</h2>
          <p className="text-sm text-gray-400">{recommended.reason}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommended.stocks.map(stock => (
          <SignalCard 
            key={stock.symbol}
            symbol={stock.symbol}
            name={stock.name}
            price={stock.price}
            signal={stock.signal}
          />
        ))}
      </div>
    </section>
  )
}
