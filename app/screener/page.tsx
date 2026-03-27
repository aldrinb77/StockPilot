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
import { Search, Sparkles, Filter, Terminal, Activity, Database } from 'lucide-react'
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/FadeIn'
import { PulseDot } from '@/components/ui/PulseDot'

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
        setData(quotes.map(q => ({ ...q, signal: generateSignal([] as any) })))
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
      if (filters.signal !== 'ALL' && !item.signal.type.includes(filters.signal)) return false;
      if (filters.sector !== 'ALL' && item.sector !== filters.sector) return false;
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
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
             <div className="flex items-center space-x-2 text-[#00e676]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantum Market Filter</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
               <Terminal className="w-8 h-8 text-white/20" /> 
               Asset Screener
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl">
               Expose precise structural advantages across the {marketConfig.name} universe using multifaceted algorithmic filters.
             </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
             <PulseDot color="green" />
             <p className="text-[10px] font-black uppercase text-white/60 tracking-widest">Scanning {data.length} Nodes</p>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-48 h-48 bg-[#00e676] blur-[100px] opacity-[0.03] pointer-events-none" />
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[#00e676]">
                    <Filter className="w-5 h-5" />
                 </div>
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Filter Configuration</h3>
              </div>
              <div className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl">
                 Institutional Logic 2.1
              </div>
           </div>
           <FilterPanel onFilterChange={setFilters} />
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-[#00e676] rounded-full" />
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase transition-all">Command Results</h2>
             </div>
             <div className="flex items-center gap-6">
                <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">
                   IDENTIFIED: <span className="text-[#00e676]">{filteredData.length}</span> / {data.length} OPERATIONAL TARGETS
                </p>
             </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-96 w-full rounded-3xl shimmer" />)}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-40 glass-card rounded-[3rem] border-2 border-dashed border-white/5 space-y-8">
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto opacity-20">
                 <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">Zero Correlation Detected</h3>
                 <p className="text-[#8899a6] font-bold max-w-sm mx-auto">Try broadening your search parameters. No assets currently align with your strict mathematical threshold.</p>
              </div>
              <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Clear All Filters</button>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
              {filteredData.map(item => (
                <StaggerItem key={item.symbol}>
                   <SignalCard stock={item} signal={item.signal} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </div>
    </FadeIn>
  )
}
