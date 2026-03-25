"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { MOCK_STOCKS, MOCK_SIGNALS } from "@/lib/mockData"
import { StockData, Signal } from "@/lib/types"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { GitCompareArrows, Search, TrendingUp, TrendingDown, Target, Info, CheckCircle, Zap } from "lucide-react"
import Link from "next/link"
import { SignalBadge } from "@/components/signals/SignalBadge"
import { useEffect } from 'react'
import { fetchMultipleQuotes } from "@/lib/api"
import TradingViewWidget from "@/components/charts/TradingViewWidget"
import { toTradingViewSymbol } from "@/lib/utils"

export default function ComparisonPage() {
  const { selectedMarket } = useStore()
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [stocks, setStocks] = useState<(StockData & { signal: Signal; isMockData?: boolean })[]>([])
  const [loading, setLoading] = useState(false)

  const marketConfig = MARKETS[selectedMarket]
  const suggestions = search ? marketConfig.popularStocks.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()) && !selectedSymbols.includes(s.symbol)).slice(0, 5) : []

  useEffect(() => {
    const loadData = async () => {
      if (selectedSymbols.length === 0) {
        setStocks([])
        return
      }
      setLoading(true)
      try {
        const quotes = await fetchMultipleQuotes(selectedSymbols)
        const mapped = quotes.map(q => ({
          ...q,
          signal: MOCK_SIGNALS[q.symbol] || MOCK_SIGNALS['META']
        }))
        setStocks(mapped)
      } catch (err) {
        console.error('Comparison fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedSymbols])

  const findWinner = (key: keyof typeof MOCK_STOCKS[0] | 'signalStrength', higherIsBetter: boolean = true) => {
    if (stocks.length < 2) return null
    let winner = stocks[0]
    stocks.forEach(s => {
      const val = key === 'signalStrength' ? s.signal.strength : (s[key] as number)
      const currentWinVal = key === 'signalStrength' ? winner.signal.strength : (winner[key] as number)
      if (higherIsBetter ? val > currentWinVal : val < currentWinVal) {
        winner = s
      }
    })
    return winner.symbol
  }

  const winners = {
    price: findWinner('price'),
    change: findWinner('changePercent'),
    marketCap: findWinner('marketCap'),
    signal: findWinner('signalStrength'),
    volatility: findWinner('pe', false)
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
          <GitCompareArrows className="w-8 h-8 text-tvBlue mr-4" /> Multi-Stock Comparison
        </h1>
        <p className="text-gray-400 mt-1">Select up to 4 assets to analyze technical alignment side-by-side.</p>
      </div>

      {/* Asset Selector */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-grow w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
             type="text" 
             placeholder="Search and add stocks (e.g. AAPL, BTC)..." 
             value={search}
             onChange={e => setSearch(e.target.value)}
             disabled={selectedSymbols.length >= 4}
             className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-4 pl-12 pr-6 text-white focus:border-tvBlue outline-none transition-all"
          />
          {suggestions.length > 0 && (
             <div className="absolute top-full left-0 w-full mt-2 bg-[#111827] border border-gray-700 rounded-xl overflow-hidden z-[50] shadow-2xl">
                {suggestions.map(s => (
                   <button 
                     key={s.symbol} 
                     onClick={() => { setSelectedSymbols([...selectedSymbols, s.symbol]); setSearch(""); }}
                     className="w-full flex items-center justify-between p-4 hover:bg-white/5 text-left border-b border-gray-800 last:border-0"
                   >
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-white">{s.symbol}</span>
                        <span className="text-xs text-gray-500">{s.name}</span>
                      </div>
                      <Plus className="w-4 h-4 text-tvBlue" />
                   </button>
                ))}
             </div>
          )}
        </div>
        
        <div className="flex space-x-2">
           {selectedSymbols.map(sym => (
              <div key={sym} className="flex items-center space-x-2 bg-tvBlue/10 border border-tvBlue/30 px-3 py-1.5 rounded-lg">
                 <span className="text-xs font-bold text-tvBlue">{sym}</span>
                 <button onClick={() => setSelectedSymbols(selectedSymbols.filter(s => s !== sym))} className="text-tvBlue hover:text-white"><X className="w-4 h-4"/></button>
              </div>
           ))}
           {selectedSymbols.length === 0 && <span className="text-sm text-gray-600 italic">No assets selected.</span>}
        </div>
      </div>

      {stocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {stocks.map(stock => {
            const isWinner = (key: keyof typeof winners) => winners[key] === stock.symbol
            return (
              <div key={stock.symbol} className="flex flex-col space-y-4 animate-in zoom-in-95 duration-300">
                 {/* Header Column Card */}
                 <div className="glass-card p-6 rounded-2xl border-t-4 border-tvBlue flex flex-col items-center text-center">
                    <h3 className="text-2xl font-black text-white">{stock.symbol}</h3>
                    <p className="text-xs text-gray-500 truncate w-full mb-4">{stock.name}</p>
                    <SignalBadge type={stock.signal.type} />
                    <div className="mt-4 w-full h-[180px] rounded-lg overflow-hidden border border-white/5">
                       <TradingViewWidget symbol={toTradingViewSymbol(stock.symbol, selectedMarket)} height={180} />
                    </div>
                 </div>

                 {/* Comparison Metrics */}
                 <div className="space-y-3">
                    <MetricCard label="Current Price" value={formatCurrency(stock.price, selectedMarket)} winner={isWinner('price')} />
                    <MetricCard label="24h Change" value={`${stock.changePercent > 0 ? '+' : ''}${formatPercent(stock.changePercent)}`} isPositive={stock.changePercent > 0} winner={isWinner('change')} />
                    <MetricCard label="Signal Strength" value={`${Math.round(stock.signal.strength)}%`} winner={isWinner('signal')} />
                    <MetricCard label="Market Cap" value={`$${(stock.marketCap! / 1e9).toFixed(1)}B`} winner={isWinner('marketCap')} />
                    <MetricCard label="P/E Ratio" value={stock.pe?.toFixed(1) || 'N/A'} winner={isWinner('volatility')} />
                 </div>

                 {/* Indicators Summary */}
                 <div className="glass-panel p-6 rounded-2xl space-y-4 flex-grow">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center">
                       <Zap className="w-3 h-3 mr-2 text-tvAmber" /> Technical Readings
                    </h4>
                    <div className="space-y-3">
                       {stock.signal.indicators.slice(0, 4).map((ind: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                             <span className="text-gray-400 font-medium">{ind.name}</span>
                             <span className={`font-bold uppercase ${ind.verdict === 'bullish' ? 'text-tvGreen' : ind.verdict === 'bearish' ? 'text-tvRed' : 'text-gray-500'}`}>
                               {ind.verdict}
                             </span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <Link href={`/stock/${stock.symbol}`} className="w-full py-3 bg-white/5 border border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 text-center transition-all">
                    Detail View Screen
                 </Link>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-40 text-center glass-panel rounded-3xl border-dashed border-2 border-gray-800">
           <GitCompareArrows className="w-16 h-16 text-gray-800 mx-auto mb-6" />
           <h2 className="text-2xl font-bold text-gray-500">Add two or more assets to calculate variances.</h2>
           <p className="text-gray-600 mt-2">Compare mathematical alignments and indicator confluence side-by-side.</p>
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, isPositive, winner }: { label: string, value: string, isPositive?: boolean, winner?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${winner ? 'bg-tvBlue/5 border-tvBlue shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-black/20 border-gray-800/50'}`}>
       <div className="flex justify-between items-center mb-1">
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
          {winner && <CheckCircle className="w-3 h-3 text-tvBlue" />}
       </div>
       <p className={`text-lg font-bold ${isPositive === true ? 'text-tvGreen' : isPositive === false ? 'text-tvRed' : 'text-white'} font-mono`}>{value}</p>
    </div>
  )
}

function Plus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  )
}
