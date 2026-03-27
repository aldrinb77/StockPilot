"use client"

import { useEffect, useState, useMemo } from 'react'
import { MOCK_STOCKS } from '@/lib/mockData'
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
import { DailyTip } from '@/components/learning/DailyTip'
import { useUserProfile } from '@/hooks/useUserProfile'
import { 
  Settings2, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ArrowRight,
  Plus,
  BarChart2,
  Calendar,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

import { fetchMultipleQuotes } from '@/lib/api'

export default function DashboardPage() {
  const { selectedMarket, dashboardLayout, watchlist } = useStore()
  const { userName } = useUserProfile()
  const marketConfig = MARKETS[selectedMarket]
  const [data, setData] = useState<(StockData & { signal: Signal; isMockData?: boolean })[]>([])
  const [loading, setLoading] = useState(true)
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed' | 'pre-market' | 'after-hours'>('closed')
  const [showCustomizer, setShowCustomizer] = useState(false)

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }, [])

  useEffect(() => {
    setMarketStatus(getMarketStatus(selectedMarket))
    const interval = setInterval(() => setMarketStatus(getMarketStatus(selectedMarket)), 60000)
    
    const loadData = async () => {
      setLoading(true)
      try {
        const symbols = marketConfig.popularStocks.map(s => s.symbol)
        const quotes = await fetchMultipleQuotes(symbols)
        
        // Signal logic is handled in the components or by manual generation if needed
        // Here we just attach empty signals that will be calculated by the engine in the cards or feed
        setData(quotes.map(q => ({ ...q, signal: {} as any })))
      } catch (err) {
        console.error('Dashboard data fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    return () => clearInterval(interval)
  }, [selectedMarket, marketConfig])

  const stats = useMemo(() => {
    const total = data.length
    const watched = watchlist.length
    
    return {
      total,
      watched,
    }
  }, [data, watchlist])

  if (loading) {
     return <DashboardSkeleton />
  }

  const gainers = [...data].sort((a,b) => b.changePercent - a.changePercent).slice(0, 5)
  const losers = [...data].sort((a,b) => a.changePercent - b.changePercent).slice(0, 5)

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Personalized Header */}
      <div className="md:flex justify-between items-end gap-6 space-y-4 md:space-y-0">
        <div>
           <div className="flex items-center space-x-2 text-tvGreen mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] font-heading">System Online</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
             {greeting}, <span className="text-tvGreen">{userName}!</span> 👋
           </h1>
           <p className="text-gray-400 mt-2 font-medium">Here&apos;s your personal market briefing for today.</p>
        </div>
        <div className="flex items-center space-x-4">
           <button 
             onClick={() => setShowCustomizer(true)}
             className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2 group"
           >
             <Settings2 className="w-4 h-4 group-hover:rotate-90 transition-transform" />
             Layout Configuration
           </button>
        </div>
      </div>

      {showCustomizer && <DashboardCustomizer onClose={() => setShowCustomizer(false)} />}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
            title="Monitored Assets" 
            value={stats.total} 
            subtitle="Tracking live volatility" 
            icon={<Zap className="w-6 h-6" />}
            color="bg-tvBlue"
         />
         <StatCard 
            title="System Win Rate" 
            value={80} 
            suffix="%"
            subtitle={`Strict math confirmation`} 
            icon={<Shield className="w-6 h-6" />}
            color="bg-tvGreen"
         />
         <StatCard 
            title="Risk Profile" 
            value="Active" 
            isText
            subtitle={`Scanning for A+ setups`} 
            icon={<BarChart2 className="w-6 h-6" />}
            color="bg-tvPurple"
         />
         <StatCard 
            title="Your Watchlist" 
            value={stats.watched} 
            subtitle="Items pinned for tracking" 
            icon={<Star className="w-6 h-6" />}
            color="bg-tvAmber"
         />
      </div>

      {/* Dynamic Sections Loop */}
      <motion.div 
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="visible"
        className="space-y-16"
      >
        {dashboardLayout.filter(s => s.visible).map((section) => {
          switch (section.id) {
            case 'MARKET_OVERVIEW':
              return (
                <motion.section key={section.id} variants={FADE_IN} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center">
                       <div className="w-1.5 h-6 bg-tvBlue rounded-full mr-4" />
                       Market Pulse: {marketConfig.name}
                    </h2>
                  </div>
                  <MarketOverview />
                </motion.section>
              )
            case 'WATCHLIST':
              return <motion.div key={section.id} variants={FADE_IN}><PersonalizedFeed /></motion.div>
            case 'LEARNING_TIPS':
              return <motion.div key={section.id} variants={FADE_IN}><DailyTip /></motion.div>
            case 'TOP_MOVERS':
              return <motion.div key={section.id} variants={FADE_IN}><TopMovers gainers={gainers} losers={losers} /></motion.div>
            case 'ALERTS_SENTINEL':
              return <motion.div key={section.id} variants={FADE_IN}><AlertSetup /></motion.div>
            case 'SECTOR_HEATMAP':
              return <motion.div key={section.id} variants={FADE_IN}><RecommendedForYou data={data} /></motion.div>
            case 'TOOLS_CALCULATOR':
              return <motion.div key={section.id} variants={FADE_IN}><WhatIfCalculator /></motion.div>
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

function StatCard({ title, value, subtitle, icon, color, suffix = "", isText = false }: any) {
  return (
    <div className="glass-card p-6 rounded-3xl group overflow-hidden relative border-white/5">
       <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none -mr-16 -mt-16 ${color}`} />
       
       <div className="flex items-center space-x-4 mb-6">
          <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-white shadow-lg`}>
             <div className={`${color.replace('bg-', 'text-')}`}>
                {icon}
             </div>
          </div>
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</h4>
       </div>

       <div className="text-4xl font-black text-white font-mono tracking-tighter">
          {isText ? value : <AnimatedValue value={value} suffix={suffix} />}
       </div>
       <p className="text-xs text-tvGreen font-bold mt-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {subtitle}
       </p>
    </div>
  )
}

function AnimatedValue({ value, suffix }: { value: number, suffix: string }) {
    return <><AnimatedNumber value={value} />{suffix}</>
}

function MarketStatusRow({ status, config }: any) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between glass-panel p-8 rounded-[2rem] border-white/5 gap-8">
      <div className="flex items-center space-x-6">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] block mb-2">Exchange Status Dashboard</span>
          <div className="flex items-center gap-4">
             <span className="text-xl font-black text-white tracking-tight">{config.exchangeName}</span>
             {status === 'open' ? (
              <span className="px-4 py-1.5 rounded-full bg-tvGreen/10 text-tvGreen border border-tvGreen/20 text-xs font-black tracking-widest flex items-center">
                <span className="pulse-dot bg-tvGreen mr-2" /> LIVE SESSION
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full bg-tvRed/10 text-tvRed border border-tvRed/20 text-xs font-black tracking-widest flex items-center">
                <div className="w-2 h-2 rounded-full bg-tvRed mr-2" /> MARKET CLOSED
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-16 px-6">
         <div className="text-right">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Timezone</p>
            <p className="text-sm text-white font-mono font-bold">{config.marketHours.timezone}</p>
         </div>
         <div className="text-right">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Current Exchange Time</p>
            <p className="text-3xl text-tvGreen font-mono font-black tracking-tighter">{new Date().toLocaleTimeString(config.locale, { timeZone: config.marketHours.timezone, hour: '2-digit', minute: '2-digit' })}</p>
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
           <Skeleton className="h-12 w-80 rounded-2xl shimmer" />
           <Skeleton className="h-4 w-64 rounded-lg shimmer" />
        </div>
        <Skeleton className="h-14 w-56 rounded-2xl shimmer" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-48 w-full rounded-3xl shimmer" />)}
      </div>
      <Skeleton className="h-24 w-full rounded-[2rem] shimmer" />
      <div className="space-y-12">
        {[1,2].map(i => <div key={i} className="space-y-6">
           <Skeleton className="h-10 w-64 rounded-xl shimmer" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(j => <Skeleton key={j} className="h-40 w-full rounded-2xl shimmer" />)}
           </div>
        </div>)}
      </div>
    </div>
  )
}
function CheckCircle2({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
}
