"use client"

import { useEffect, useState, useMemo } from 'react'
import { MOCK_STOCKS, MOCK_SIGNALS } from '@/lib/mockData'
import { StockData, Signal } from '@/lib/types'
import { MarketOverview } from '@/components/market/MarketOverview'
import { TopMovers } from '@/components/market/TopMovers'
import { SignalCard } from '@/components/signals/SignalCard'
import { getMarketStatus } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { RecommendedForYou } from '@/components/market/RecommendedForYou'
import { useStore } from '@/store/store'
import { MARKETS } from '@/lib/markets'
import { motion, AnimatePresence } from 'framer-motion'
import { STAGGER_CONTAINER, FADE_IN } from '@/lib/animations'

import { PersonalizedFeed } from '@/components/dashboard/PersonalizedFeed'
import { DashboardCustomizer } from '@/components/dashboard/DashboardCustomizer'
import { WhatIfCalculator } from '@/components/tools/WhatIfCalculator'
import { AlertSetup } from '@/components/alerts/AlertSetup'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { 
  Settings2, 
  AlertTriangle, 
  Lightbulb, 
  Calendar, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ArrowRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { selectedMarket, dashboardLayout, watchlist } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  const [data, setData] = useState<(StockData & { signal: Signal })[]>([])
  const [loading, setLoading] = useState(true)
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed' | 'pre-market' | 'after-hours'>('closed')
  const [showCustomizer, setShowCustomizer] = useState(false)

  useEffect(() => {
    setMarketStatus(getMarketStatus(selectedMarket))
    const interval = setInterval(() => setMarketStatus(getMarketStatus(selectedMarket)), 60000)
    
    const loadData = async () => {
      setLoading(true)
      try {
        const mapped = marketConfig.popularStocks.map(s => {
          const mockStock = MOCK_STOCKS.find(ms => ms.symbol === s.symbol) || {
            symbol: s.symbol,
            name: s.name,
            sector: s.sector,
            price: 100 + Math.random() * 500,
            change: (Math.random() * 20) - 10,
            changePercent: (Math.random() * 4) - 2,
            volume: 1000000,
            high: 110,
            low: 90,
            open: 100,
            prevClose: 100
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
    return () => clearInterval(interval)
  }, [selectedMarket, marketConfig])

  const stats = useMemo(() => {
    const total = data.length
    const bullish = data.filter(s => s.signal.type.includes('BUY')).length
    const bearish = data.filter(s => s.signal.type.includes('SELL')).length
    const watched = watchlist.length
    
    return {
      total,
      bullish,
      bearish,
      watched,
      bullishPercent: (bullish / (total || 1)) * 100,
      bearishPercent: (bearish / (total || 1)) * 100,
    }
  }, [data, watchlist])

  if (loading) {
     return <DashboardSkeleton />
  }

  const buySignals = data.filter(s => s.signal.type.includes('BUY')).sort((a,b) => b.signal.strength - a.signal.strength).slice(0, 5)
  const sellSignals = data.filter(s => s.signal.type.includes('SELL')).sort((a,b) => b.signal.strength - a.signal.strength).slice(0, 5)
  const gainers = [...data].sort((a,b) => b.changePercent - a.changePercent).slice(0, 5)
  const losers = [...data].sort((a,b) => a.changePercent - b.changePercent).slice(0, 5)

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header with Customizer Toggle */}
      <div className="flex justify-between items-center bg-[#131722]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        <div>
           <h1 className="text-2xl font-black text-white tracking-tight">Market Intelligence</h1>
           <p className="text-xs text-gray-400 font-medium">Localized tracking for {marketConfig.name} exchange.</p>
        </div>
        <button 
          onClick={() => setShowCustomizer(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white hover:bg-white/10 transition-all group ripple"
        >
          <Settings2 className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          <span>Customize Dashboard</span>
        </button>
      </div>

      {showCustomizer && <DashboardCustomizer onClose={() => setShowCustomizer(false)} />}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
            title="Total Active Signals" 
            value={stats.total} 
            subtitle="+5 identifies since yesterday" 
            icon={<Zap className="w-6 h-6" />}
            color="bg-tvBlue"
         />
         <StatCard 
            title="Math Bullish" 
            value={stats.bullish} 
            suffix=""
            subtitle={`${stats.bullishPercent.toFixed(0)}% of total reads`} 
            icon={<TrendingUp className="w-6 h-6" />}
            color="bg-tvGreen"
         />
         <StatCard 
            title="Math Bearish" 
            value={stats.bearish} 
            suffix=""
            subtitle={`${stats.bearishPercent.toFixed(0)}% of total reads`} 
            icon={<TrendingDown className="w-6 h-6" />}
            color="bg-tvRed"
         />
         <StatCard 
            title="Your Watchlist" 
            value={stats.watched} 
            subtitle="2 items with new signals" 
            icon={<Star className="w-6 h-6" />}
            color="bg-tvAmber"
         />
      </div>

      <div className="w-full bg-tvAmber/10 border border-tvAmber/30 text-tvAmber px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center">
        <AlertTriangle className="w-4 h-4 mr-3" />
        Signals are based on technical indicator reading alignment only. No investment advice provided.
      </div>

      {/* Dynamic Sections Loop */}
      <motion.div 
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {dashboardLayout.filter(s => s.visible).map((section) => {
          switch (section.id) {
            case 'MARKET_OVERVIEW':
              return (
                <motion.section key={section.id} variants={FADE_IN} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white font-heading tracking-tight">Global Indices Health</h2>
                    <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      <div className="pulse-dot bg-tvGreen" />
                      <span>Live Technical Extraction</span>
                    </div>
                  </div>
                  <MarketOverview />
                </motion.section>
              )
            case 'WATCHLIST':
              return <motion.div key={section.id} variants={FADE_IN}><PersonalizedFeed /></motion.div>
            case 'ALERTS_SENTINEL':
              return <motion.div key={section.id} variants={FADE_IN}><AlertSetup /></motion.div>
            case 'BULLISH_SIGNALS':
              return (
                <motion.section key={section.id} variants={FADE_IN}>
                  <h2 className="text-xl font-bold text-white mb-8 flex items-center justify-between">
                     <div className="flex items-center"><span className="text-tvGreen mr-3 text-2xl">🟢</span> Bullish Alpha Readings</div>
                     <Link href="/signals" className="text-xs font-bold text-tvBlue hover:underline flex items-center">View All <ArrowRight className="w-4 h-4 ml-1"/></Link>
                  </h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {buySignals.length > 0 ? buySignals.map(item => (
                      <SignalCard key={item.symbol} stock={item} signal={item.signal} />
                    )) : <EmptyState emoji="📊" title="Quiet Market Horizon" desc="No strong bullish alignments identified in the current популяр stocks set." />}
                  </div>
                </motion.section>
              )
            case 'BEARISH_SIGNALS':
              return (
                <motion.section key={section.id} variants={FADE_IN}>
                   <h2 className="text-xl font-bold text-white mb-8 flex items-center justify-between">
                      <div className="flex items-center"><span className="text-tvRed mr-3 text-2xl">🔴</span> Bearish Alpha Readings</div>
                      <Link href="/signals" className="text-xs font-bold text-tvBlue hover:underline flex items-center">View All <ArrowRight className="w-4 h-4 ml-1"/></Link>
                   </h2>
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {sellSignals.length > 0 ? sellSignals.map(item => (
                      <SignalCard key={item.symbol} stock={item} signal={item.signal} />
                    )) : <EmptyState emoji="📉" title="Support Is Holding" desc="No significant bearish indicator confluence detected in your selected market region." />}
                  </div>
                </motion.section>
              )
            case 'TOP_MOVERS':
              return <motion.div key={section.id} variants={FADE_IN}><TopMovers gainers={gainers} losers={losers} /></motion.div>
            case 'SECTOR_HEATMAP':
              return <motion.div key={section.id} variants={FADE_IN}><RecommendedForYou /></motion.div>
            case 'TOOLS_CALCULATOR':
              return <motion.div key={section.id} variants={FADE_IN}><WhatIfCalculator /></motion.div>
            case 'LEARNING_TIPS':
              return <motion.div key={section.id} variants={FADE_IN}><LearningTip /></motion.div>
            case 'MARKET_CALENDAR':
              return <motion.div key={section.id} variants={FADE_IN}><MarketStatusRow status={marketStatus} config={marketConfig} /></motion.div>
            default:
              return null
          }
        })}
      </motion.div>

    </div>
  )
}

function StatCard({ title, value, subtitle, icon, color, suffix = "" }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl group overflow-hidden relative">
       <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-30 pointer-events-none -mr-16 -mt-16 ${color}`} />
       
       <div className="flex items-center space-x-4 mb-6">
          <div className={`p-3 rounded-2xl ${color}/10 border border-${color}/20 text-white shadow-lg`}>
             {icon}
          </div>
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</h4>
       </div>

       <div className="text-4xl font-black text-white font-mono tracking-tighter">
          <AnimatedNumber value={value} suffix={suffix} />
       </div>
       <p className="text-xs text-tvGreen font-bold mt-2 flex items-center">
          {subtitle}
       </p>
    </div>
  )
}

function EmptyState({ emoji, title, desc }: { emoji: string, title: string, desc: string }) {
  return (
    <div className="p-12 text-center rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02] col-span-full">
       <div className="text-5xl mb-6">{emoji}</div>
       <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
       <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">{desc}</p>
       <button className="premium-button flex items-center mx-auto space-x-2">
          <Plus className="w-4 h-4" />
          <span>Browse All Assets</span>
       </button>
    </div>
  )
}

function LearningTip() {
  return (
    <div className="glass-card p-8 rounded-3xl border-tvPurple/20 bg-tvPurple/5 flex items-start space-x-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-tvPurple/5 blur-[100px] pointer-events-none" />
      <div className="p-4 bg-tvPurple/20 text-tvPurple rounded-2xl shadow-xl shadow-tvPurple/10 group-hover:scale-110 transition-transform">
        <Lightbulb className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-black text-white text-xl tracking-tight mb-2">Quant Intelligence Tip</h3>
        <p className="text-sm text-gray-400 leading-relaxed font-medium">
          The <strong>Relative Strength Index (RSI)</strong> measures the speed and change of price movements. 
          Readings above 70 indicate potential overbought conditions, while below 30 suggest oversold levels. 
          Use this to identify potential exhaustion before a technical indicator reversal.
        </p>
      </div>
    </div>
  )
}

function MarketStatusRow({ status, config }: any) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between glass-panel p-6 rounded-3xl border-white/5 gap-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
          <Calendar className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Exchange Sentinel</span>
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-white">{config.exchangeName}</span>
             {status === 'open' ? (
              <span className="px-3 py-1 rounded-full bg-tvGreen/10 text-tvGreen border border-tvGreen/20 text-[9px] font-black tracking-[0.2em] flex items-center">
                <span className="pulse-dot bg-tvGreen mr-2" /> ACTIVE
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-tvRed/10 text-tvRed border border-tvRed/20 text-[9px] font-black tracking-[0.2em] flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-tvRed mr-2" /> RESTING
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-12 px-6">
         <div className="text-right">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Timezone</p>
            <p className="text-xs text-white font-mono font-bold">{config.marketHours.timezone}</p>
         </div>
         <div className="text-right">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Exchange Time</p>
            <p className="text-lg text-tvGreen font-mono font-black tracking-tighter">{new Date().toLocaleTimeString(config.locale, { timeZone: config.marketHours.timezone, hour: '2-digit', minute: '2-digit' })}</p>
         </div>
      </div>
    </section>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-12 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
           <Skeleton className="h-8 w-64 rounded-xl shimmer" />
           <Skeleton className="h-4 w-48 rounded-lg shimmer" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl shimmer" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl shimmer" />)}
      </div>
      <Skeleton className="h-20 w-full rounded-2xl shimmer" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1,2].map(i => <div key={i} className="space-y-4">
           <Skeleton className="h-8 w-48 rounded-lg shimmer" />
           <Skeleton className="h-[400px] w-full rounded-3xl shimmer" />
        </div>)}
      </div>
    </div>
  )
}


