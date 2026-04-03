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
import { StrategyBuilder } from '@/components/screener/StrategyBuilder'

import { ScreenerTable } from '@/components/screener/ScreenerTable'
import { LayoutGrid, List } from 'lucide-react'

export default function ScreenerPage() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [data, setData] = useState<(StockData & { signal: Signal })[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ signal: 'ALL', sector: 'ALL', price: 'ALL' })
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('TABLE')
  const [sortBy, setSortBy] = useState<'STRENGTH' | 'PRICE' | 'CHANGE'>('STRENGTH')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const symbols = marketConfig.popularStocks.map(s => s.symbol)
        const quotes = await fetchMultipleQuotes(symbols)
        setData(quotes.map(q => ({ 
          ...q, 
          signal: generateSignal([] as any) 
        })))
      } catch (err) {
        console.error('Screener fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedMarket, marketConfig])

  const filteredData = useMemo(() => {
    let result = data.filter(item => {
      if (filters.signal !== 'ALL' && !item.signal.type.includes(filters.signal)) return false;
      if (filters.sector !== 'ALL' && item.sector !== filters.sector) return false;
      if (filters.price !== 'ALL') {
        if (filters.price === 'UNDER_50' && item.price >= 50) return false;
        if (filters.price === '50_TO_100' && (item.price < 50 || item.price >= 100)) return false;
        if (filters.price === '100_TO_500' && (item.price < 100 || item.price >= 500)) return false;
        if (filters.price === 'OVER_500' && item.price < 500) return false;
      }
      return true;
    })

    if (sortBy === 'STRENGTH') result.sort((a,b) => b.signal.strength - a.signal.strength)
    else if (sortBy === 'PRICE') result.sort((a,b) => b.price - a.price)
    else if (sortBy === 'CHANGE') result.sort((a,b) => b.changePercent - a.changePercent)

    return result
  }, [data, filters, sortBy])

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
             <div className="flex items-center space-x-2 text-tvBlue">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantum Market Filter</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
               <Terminal className="w-8 h-8 text-white/20" /> 
               Market Screener
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl leading-tight uppercase tracking-tight">Multi-Dimensional Asset Evaluation</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
             <PulseDot color="green" />
             <p className="text-[10px] font-black uppercase text-white/60 tracking-widest font-mono">SCANNING {data.length} NODES</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
           {/* Filters Sidebar/Top */}
           <div className="lg:col-span-1 space-y-10">
              <div className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group h-fit">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e676] blur-[70px] opacity-[0.03] pointer-events-none" />
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-tvGreen shadow-xl shadow-tvGreen/5">
                       <Filter className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Logic Toggles</h3>
                 </div>
                 <FilterPanel onFilterChange={setFilters} />
              </div>

              <div className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#2979ff] blur-[70px] opacity-[0.03] pointer-events-none" />
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-tvBlue shadow-xl shadow-tvBlue/5">
                       <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Sorting Node</h3>
                 </div>
                 <div className="space-y-4">
                    {(['STRENGTH', 'PRICE', 'CHANGE'] as const).map(s => (
                       <button
                         key={s}
                         onClick={() => setSortBy(s)}
                         className={`w-full py-4 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest border transition-all flex justify-between items-center ${
                           sortBy === s ? 'bg-tvBlue/10 border-tvBlue/30 text-tvBlue shadow-xl shadow-tvBlue/5' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                         }`}
                       >
                         {s} INFERENCE {sortBy === s && <div className="w-1.5 h-1.5 rounded-full bg-tvBlue shadow-[0_0_8px_#2979ff]" />}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Results Area */}
           <div className="lg:col-span-3 space-y-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-tvBlue rounded-full shadow-[0_0_10px_#2979ff]" />
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Intelligence Output</h2>
                 </div>
                 <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/10">
                    <button 
                      onClick={() => setViewMode('TABLE')}
                      className={`p-3 rounded-xl transition-all ${viewMode === 'TABLE' ? 'bg-tvBlue text-white shadow-xl shadow-tvBlue/10' : 'text-gray-600 hover:text-white'}`}
                    >
                       <List className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('GRID')}
                      className={`p-3 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-tvBlue text-white shadow-xl shadow-tvBlue/10' : 'text-gray-600 hover:text-white'}`}
                    >
                       <LayoutGrid className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-96 w-full rounded-3xl shimmer" />)}
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-40 glass-card rounded-[3rem] border-2 border-dashed border-white/5 space-y-8">
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto opacity-20">
                     <Database className="w-8 h-8 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">No Matched Correlates</h3>
                     <p className="text-[#8899a6] font-bold max-w-sm mx-auto uppercase text-[11px] tracking-widest">Mathematical thresholds too strict for current market phase.</p>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                   {viewMode === 'GRID' ? (
                      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {filteredData.map(item => (
                          <StaggerItem key={item.symbol}>
                             <SignalCard stock={item} signal={item.signal} />
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                   ) : (
                      <ScreenerTable data={filteredData} />
                   )}
                </div>
              )}
           </div>
        </div>

        <StrategyBuilder onApply={() => {}} />
      </div>
    </FadeIn>
  )
}
