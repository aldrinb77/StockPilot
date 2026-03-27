"use client"

import { useState, useMemo, useEffect } from 'react'
import { SignalCard } from '@/components/signals/SignalCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from '@/store/store'
import { MARKETS } from '@/lib/markets'
import { fetchMultipleQuotes } from '@/lib/api'
import { StockData, Signal } from '@/lib/types'
import { generateSignal } from '@/lib/signals'
import { Sparkles, TrendingUp, Filter, Search as SearchIcon, Terminal, Activity, Zap } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/FadeIn'
import { PulseDot } from '@/components/ui/PulseDot'

export default function SignalsPage() {
  const { selectedMarket } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [activeTab, setActiveTab] = useState('ALL')
  const [data, setData] = useState<(StockData & { signal: Signal })[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const symbols = marketConfig.popularStocks.map(s => s.symbol)
        const quotes = await fetchMultipleQuotes(symbols)
        setData(quotes.map(q => ({ ...q, signal: generateSignal([] as any) })))
      } catch (err) {
        console.error('Signals fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedMarket, marketConfig])

  const filtered = useMemo(() => {
    let result = data;
    if (activeTab !== 'ALL') {
      result = result.filter(d => {
        if (activeTab === 'BUY') return d.signal.type.includes('BUY')
        if (activeTab === 'SELL') return d.signal.type.includes('SELL')
        return d.signal.type === activeTab
      })
    }
    if (search) {
      result = result.filter(d => d.symbol.toLowerCase().includes(search.toLowerCase()) || d.name.toLowerCase().includes(search.toLowerCase()))
    }
    return result.sort((a,b) => b.signal.strength - a.signal.strength)
  }, [data, activeTab, search])

  const counts = useMemo(() => ({
    all: data.length,
    buy: data.filter(d => d.signal.type.includes('BUY')).length,
    sell: data.filter(d => d.signal.type.includes('SELL')).length,
    hold: data.filter(d => d.signal.type === 'HOLD').length,
  }), [data])

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10">
          <div className="space-y-4">
             <div className="flex items-center space-x-3 text-[#ffab00]">
                <Zap className="w-5 h-5 fill-[#ffab00]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Operational Alpha Scanner</span>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter flex items-center gap-6">
               <Terminal className="w-10 h-10 text-white/20" /> 
               Active Execution Signals
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl leading-relaxed">
               Strict formula-validated technical extraction across {marketConfig.name} markets. Confluence mapping requiring 80% threshold alignment.
             </p>
          </div>
          
          <div className="relative w-full md:w-[400px] group">
             <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5c6b7a] group-focus-within:text-[#00e676] transition-colors" />
             <input 
               type="text" 
               placeholder="Search protocol signals..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-6 py-5 text-base text-white focus:border-[#00e676] focus:ring-4 focus:ring-[#00e67610] transition-all outline-none font-bold placeholder:text-[#5c6b7a]"
             />
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
                <TabsList className="bg-white/5 border border-white/10 p-2 rounded-[2rem] h-auto flex flex-wrap lg:flex-nowrap gap-2">
                  <TabsTrigger value="ALL" className="rounded-2xl px-8 py-3.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all">All Nodes ({counts.all})</TabsTrigger>
                  <TabsTrigger value="BUY" className="rounded-2xl px-8 py-3.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#00e676] data-[state=active]:text-white transition-all text-[#00e676]">Primary Buys ({counts.buy})</TabsTrigger>
                  <TabsTrigger value="SELL" className="rounded-2xl px-8 py-3.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#ff1744] data-[state=active]:text-white transition-all text-[#ff1744]">Surgical Sells ({counts.sell})</TabsTrigger>
                  <TabsTrigger value="HOLD" className="rounded-2xl px-8 py-3.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#ffab00] data-[state=active]:text-white transition-all text-[#ffab00]">Neutral ({counts.hold})</TabsTrigger>
                </TabsList>
             </Tabs>
             
             <div className="flex items-center gap-4 text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                <PulseDot color="green" />
                Live Engine Feed: {counts.all} Assets Scanned
             </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-96 w-full rounded-[2.5rem] shimmer" />)}
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
              {filtered.length > 0 ? (
                filtered.map(item => (
                  <StaggerItem key={item.symbol}>
                    <SignalCard stock={item} signal={item.signal} />
                  </StaggerItem>
                ))
              ) : (
                <div className="col-span-full py-40 text-center glass-card rounded-[3rem] border-2 border-dashed border-white/5 space-y-8">
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto opacity-20">
                     <Activity className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">Zero Correlation Detected</h3>
                    <p className="text-[#8899a6] font-bold max-w-sm mx-auto">No assets currently match the strict 80% multi-indicator confirmation protocol for this category.</p>
                  </div>
                  <button onClick={() => setActiveTab('ALL')} className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Reset Scanner Protocol</button>
                </div>
              )}
            </StaggerContainer>
          )}
        </div>
      </div>
    </FadeIn>
  )
}
