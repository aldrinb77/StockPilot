"use client"

import { useEffect, useState, useMemo } from 'react'
import { MOCK_STOCKS, MOCK_SIGNALS } from '@/lib/mockData'
import { StockData, Signal } from '@/lib/types'
import { SignalCard } from '@/components/signals/SignalCard'
import { FilterPanel } from '@/components/screener/FilterPanel'
import { Skeleton } from '@/components/ui/skeleton'

import { useStore } from '@/store/store'
import { MARKETS } from '@/lib/markets'

export default function ScreenerPage() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [data, setData] = useState<(StockData & { signal: Signal })[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ signal: 'ALL', sector: 'ALL', price: 'ALL' })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const mapped = marketConfig.popularStocks.map(s => {
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
            ...mockStock as StockData,
            signal: MOCK_SIGNALS[s.symbol] || MOCK_SIGNALS['META']
          }
        })
        await new Promise(r => setTimeout(r, 600))
        setData(mapped)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedMarket, marketConfig])

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Signal
      if (filters.signal !== 'ALL' && !item.signal.type.includes(filters.signal)) return false;
      // Sector
      if (filters.sector !== 'ALL' && item.sector !== filters.sector) return false;
      // Price
      if (filters.price !== 'ALL') {
        if (filters.price === 'UNDER_50' && item.price >= 50) return false;
        if (filters.price === '50_TO_100' && (item.price < 50 || item.price >= 100)) return false;
        if (filters.price === '100_TO_500' && (item.price < 100 || item.price >= 500)) return false;
        if (filters.price === 'OVER_500' && item.price < 500) return false;
      }
      return true;
    }).sort((a,b) => b.signal.strength - a.signal.strength)
  }, [data, filters])

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{marketConfig.name} Stock Screener</h1>
          <p className="text-gray-400 mt-2 text-sm max-w-lg">Filter {marketConfig.exchangeName} exclusively using algorithmic, AI-free technical indicators to expose precise structural advantages.</p>
        </div>
      </div>

      <FilterPanel onFilterChange={setFilters} />

      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h2 className="text-lg font-bold text-white">Results</h2>
        <p className="text-sm font-medium text-gray-400">
          Showing <span className="text-tvGreen font-bold">{filteredData.length}</span> of {data.length} stocks
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-[350px] w-full rounded-xl" />)}
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-20 bg-[#1E222D] rounded-xl border border-gray-700/50">
          <span className="text-4xl mb-4 block">🔍</span>
          <h3 className="text-lg font-semibold text-white mb-2">No stocks match your exact filters</h3>
          <p className="text-gray-400 text-sm">Try broadening your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredData.map(item => (
            <SignalCard key={item.symbol} stock={item} signal={item.signal} />
          ))}
        </div>
      )}
    </div>
  )
}
