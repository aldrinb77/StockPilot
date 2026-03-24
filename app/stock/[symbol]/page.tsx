"use client"

import { useEffect, useState } from 'react'
import { StockData, Signal, OHLCV } from '@/lib/types'
import { MOCK_STOCKS, MOCK_SIGNALS, getMockHistoricalData } from '@/lib/mockData'
import { StockChart } from '@/components/charts/StockChart'
import { SignalCard } from '@/components/signals/SignalCard'
import { IndicatorBreakdown } from '@/components/signals/IndicatorBreakdown'
import { calcSupportResistance } from '@/lib/indicators'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Share, Star } from 'lucide-react'
import { useStore } from '@/store/store'

export default function StockDetailPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase()
  
  const [stock, setStock] = useState<StockData | null>(null)
  const [signal, setSignal] = useState<Signal | null>(null)
  const [history, setHistory] = useState<OHLCV[]>([])
  const [loading, setLoading] = useState(true)

  const { watchlist, addToWatchlist, removeFromWatchlist } = useStore()
  const inWatchlist = watchlist.some(w => w.symbol === symbol)

  useEffect(() => {
    // Mock simulation
    setTimeout(() => {
      const mockStock = MOCK_STOCKS.find(s => s.symbol === symbol) || {
        ...MOCK_STOCKS[0],
        symbol,
        name: `${symbol} Corporation`,
      }
      setStock(mockStock)
      
      const mockSignal = MOCK_SIGNALS[symbol] || MOCK_SIGNALS['AAPL']
      setSignal(mockSignal)
      
      const hist = getMockHistoricalData(mockStock.price)
      setHistory(hist)
      
      setLoading(false)
    }, 1000)
  }, [symbol])

  if (loading || !stock || !signal) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="flex flex-col xl:flex-row gap-6">
          <Skeleton className="h-[500px] flex-grow rounded-xl" />
          <Skeleton className="h-[500px] w-full xl:w-[400px] rounded-xl" />
        </div>
      </div>
    )
  }

  // Calc S&R
  const closes = history.map(h => h.close)
  const highs = history.map(h => h.high)
  const lows = history.map(h => h.low)
  const { supports, resistances } = calcSupportResistance(highs, lows, closes)
  const pivot = (highs[highs.length-1] + lows[lows.length-1] + closes[closes.length-1]) / 3

  const isUp = stock.change >= 0

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      
      {/* Header */}
      <div className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">{stock.symbol}</h1>
            <span className="text-lg text-gray-400 font-medium">{stock.name}</span>
            <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">{stock.sector}</span>
          </div>
          <div className="flex items-center space-x-3 mt-2">
            <span className="text-3xl font-bold text-white">{formatCurrency(stock.price)}</span>
            <span className={`text-lg font-semibold flex items-center ${isUp ? 'text-tvGreen' : 'text-tvRed'}`}>
              {isUp ? '+' : ''}{formatCurrency(stock.change)} ({isUp ? '+' : ''}{formatPercent(stock.changePercent)})
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={() => inWatchlist ? removeFromWatchlist(symbol) : addToWatchlist({ symbol, name: stock.name || symbol, addedAt: Date.now() })}
            className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-md font-medium text-sm transition-colors border ${inWatchlist ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20' : 'bg-[#131722] text-white border-gray-700 hover:bg-gray-800'}`}
          >
            <Star className={`w-4 h-4 ${inWatchlist ? 'fill-yellow-500' : ''}`} />
            <span>{inWatchlist ? 'Saved' : 'Watchlist'}</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-md font-medium text-sm bg-tvGreen text-white hover:bg-tvGreen/90 transition-colors">
            <Share className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Main Chart Column */}
        <div className="flex-grow space-y-6">
          <div className="h-[500px] w-full bg-[#1E222D] rounded-xl border border-gray-700/50 overflow-hidden shadow-sm flex flex-col">
            <StockChart symbol={symbol} data={history} />
          </div>

          <div className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 mb-4">Key Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Market Cap" value={`$${(stock.marketCap! / 1e9).toFixed(2)}B`} />
              <StatCard label="P/E Ratio" value={stock.pe?.toFixed(2) || 'N/A'} />
              <StatCard label="EPS" value={`$${stock.eps?.toFixed(2)}` || 'N/A'} />
              <StatCard label="Volatility" value="Medium" />
              <StatCard label="52-Week High" value={formatCurrency(stock.week52High || stock.high)} />
              <StatCard label="52-Week Low" value={formatCurrency(stock.week52Low || stock.low)} />
              <StatCard label="Avg Volume" value={`${(stock.volume / 1000000).toFixed(1)}M`} />
              <StatCard label="Yield" value="1.2%" />
            </div>
          </div>

          <div className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 mb-4">Support & Resistance Levels</h3>
            <div className="relative pt-6 pb-2 px-4 max-w-2xl mx-auto">
              {/* Level visualize */}
              <LevelLine label="Resistance 2" value={resistances[1]} color="text-tvRed" border="border-tvRed/50" />
              <LevelLine label="Resistance 1" value={resistances[0]} color="text-red-400" border="border-red-400/50" />
              <div className="relative py-2 my-2 border-l-2 border-gray-700 pl-4">
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 shadow-[0_0_10px_currentColor] rounded-full bg-white text-white"></span>
                <div className="flex justify-between text-sm text-white font-bold">
                  <span>Current Price</span>
                  <span>{formatCurrency(stock.price)}</span>
                </div>
              </div>
              <LevelLine label="Pivot Point" value={pivot} color="text-yellow-500" border="border-yellow-500/50" />
              <LevelLine label="Support 1" value={supports[0]} color="text-emerald-400" border="border-emerald-400/50" />
              <LevelLine label="Support 2" value={supports[1]} color="text-tvGreen" border="border-tvGreen/50" />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="w-full xl:w-[400px] flex-shrink-0 space-y-6">
          <SignalCard stock={stock} signal={signal} />
          <IndicatorBreakdown indicators={signal.indicators} />
          
          <div className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800 pb-2 mb-4">Performance</h3>
            <div className="space-y-3">
              <PerfRow label="1 Day" value={1.5} />
              <PerfRow label="1 Week" value={-2.4} />
              <PerfRow label="1 Month" value={5.2} />
              <PerfRow label="3 Months" value={12.8} />
              <PerfRow label="6 Months" value={28.4} />
              <PerfRow label="1 Year" value={45.2} />
              <PerfRow label="YTD" value={22.5} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-[#131722] p-3 rounded-lg border border-gray-700/30">
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function LevelLine({ label, value, color, border }: { label: string, value: number, color: string, border: string }) {
  return (
    <div className={`flex justify-between items-center py-2 relative border-b border-dashed ${border}`}>
      <span className={`text-xs font-semibold uppercase ${color} bg-[#1E222D] pr-4`}>{label}</span>
      <span className={`text-sm font-bold ${color} bg-[#1E222D] pl-4`}>{formatCurrency(Math.max(0, value))}</span>
    </div>
  )
}

function PerfRow({ label, value }: { label: string, value: number }) {
  const isUp = value >= 0
  return (
    <div className="flex justify-between items-center bg-[#131722] px-3 py-2 rounded-md">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <span className={`text-sm font-semibold px-2 py-0.5 rounded ${isUp ? 'bg-tvGreen/10 text-tvGreen' : 'bg-tvRed/10 text-tvRed'}`}>
        {isUp ? '+' : ''}{value}%
      </span>
    </div>
  )
}
