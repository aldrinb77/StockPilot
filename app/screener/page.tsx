"use client"

import { useEffect, useState, useMemo } from 'react'
import { StockData, Signal } from '@/lib/types'
import { SignalCard } from '@/components/signals/SignalCard'
import { FilterPanel } from '@/components/screener/FilterPanel'
import { Skeleton } from '@/components/ui/skeleton'
import { useStore } from '@/store/store'
import { MARKETS } from '@/lib/markets'
import { fetchMultipleQuotes } from '@/lib/api'
import { generateSignal } from '@/lib/signals'
import { Search, Sparkles, Filter, Terminal } from 'lucide-react'

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
        const symbols = marketConfig.popularStocks.map(s => s.symbol)
        const quotes = await fetchMultipleQuotes(symbols)
        
        const mapped = quotes.map(q => ({
          ...q,
          signal: generateSignal([] as any) 
        }))
        
        setData(mapped)
      } catch (err) {
        console.error('Screener fetch failed:', err)
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
    <div className="space-y-12 animate-in fade-in pb-20 max-w-7xl mx-auto px-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
           <div className="flex items-center space-x-2 text-tvGreen">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantum Filter</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
             <Terminal className="w-8 h-8 text-white/20" /> 
             Market Screener
           </h1>
           <p className="text-gray-500 font-medium max-w-xl">
             Filter the {marketConfig.name} universe exclusively using algorithmic indicators to expose precise structural advantages.
           </p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2rem] border border-white/5">
        <div className="flex items-center gap-3 mb-8">
           <Filter className="w-5 h-5 text-tvGreen" />
           <h3 className="text-sm font-black text-white uppercase tracking-widest">Configuration Panel</h3>
        </div>
        <FilterPanel onFilterChange={setFilters} />
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-tvGreen" />
              <h2 className="text-xl font-black text-white tracking-tight uppercase tracking-widest">System Results</h2>
           </div>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Identified <span className="text-tvGreen">{filteredData.length}</span> / {data.length} Assets
           </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80 w-full rounded-3xl shimmer" />)}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-32 glass-card rounded-[2.5rem] border-2 border-dashed border-white/5">
            <div className="text-4xl mb-6 opacity-30 cursor-pointer hover:scale-110 transition-transform">🔍</div>
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Zero Alignment Filtered</h3>
            <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">Try broadening your search criteria. Currently scanning with high-precision threshold.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
            {filteredData.map(item => (
              <SignalCard key={item.symbol} stock={item} signal={item.signal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
