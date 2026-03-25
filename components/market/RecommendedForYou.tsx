"use client"

import { useEffect, useState } from "react"
import { SignalCard } from "@/components/signals/SignalCard"
import { generateRecommendations, StockWithSignal } from "@/lib/recommendations"
import { MOCK_STOCKS } from "@/lib/mockData"
import { generateSignal } from "@/lib/signals"
import { Pin } from "lucide-react"

import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"

import { StockData, Signal } from "@/lib/types"

interface RecommendedForYouProps {
  data: (StockData & { signal: Signal; isMockData?: boolean })[]
}

export function RecommendedForYou({ data }: RecommendedForYouProps) {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [recommended, setRecommended] = useState<{ stocks: StockWithSignal[], reason: string } | null>(null)

  useEffect(() => {
    if (data.length === 0) return
    const recs = generateRecommendations(data as StockWithSignal[])
    setRecommended(recs)
  }, [data])

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
