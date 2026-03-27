"use client"

import { useEffect, useState, useMemo } from 'react'
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
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/FadeIn'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { PulseDot } from '@/components/ui/PulseDot'

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
  Sparkles,
  Shield,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { fetchMultipleQuotes } from '@/lib/api'

export default function DashboardPage() {
  const { selectedMarket, dashboardLayout, watchlist } = useStore()
  const { userName } = useUserProfile()
  const marketConfig = MARKETS[selectedMarket]
  const [data, setData] = useState<(StockData & { signal: Signal })[]>([])
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
        setData(quotes.map(q => ({ ...q, signal: { type: 'BULLISH', strength: 75, reasons: [], targets: [], entry: { min: 0, max: 0 }, stopLoss: 0 } as any })))
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
    return { total, watched }
  }, [data, watchlist])

  if (loading) {
     return <DashboardSkeleton />
  }

  const gainers = [...data].sort((a,b) => b.changePercent - a.changePercent).slice(0, 5)
  const losers = [...data].sort((a,b) => a.changePercent - b.changePercent).slice(0, 5)

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        {/* Personalized Header */}
        <div className="md:flex justify-between items-end gap-6 space-y-4 md:space-y-0">
          <div className="space-y-3">
             <div className="flex items-center space-x-2.5 text-[#00e676]">
                <PulseDot color="green" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Terminal Protocol Active</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
               {greeting}, <br className="md:hidden" />
               <span className="text-gradient bg-gradient-to-r from-[#00e676] to-[#00e5ff]">{userName}</span>
             </h1>
             <p className="text-[#8899a6] font-bold text-lg">System monitoring {marketConfig.name} liquidity in real-time.</p>
          </div>
          <div className="flex items-center space-x-4">
             <button 
               onClick={() => setShowCustomizer(true)}
               className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#f0f4f8] hover:bg-white/10 transition-all flex items-center gap-3 group"
             >
               <Settings2 className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Config Layout
             </button>
          </div>
        </div>

        {showCustomizer && <DashboardCustomizer onClose={() => setShowCustomizer(false)} />}

        {/* Top Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <StaggerItem>
             <StatCard 
                title="Monitored Assets" 
                value={stats.total} 
                subtitle="Live Liquidity Feed" 
                icon={<Activity className="w-6 h-6" />}
                gradient="from-[#7c4dff]"
                glow="rgba(124, 77, 255, 0.1)"
             />
           </StaggerItem>
           <StaggerItem>
             <StatCard 
                title="Probability Engine" 
                value={80} 
                suffix="%"
                subtitle="Confidence Alignment" 
                icon={<Shield className="w-6 h-6" />}
                gradient="from-[#00e676]"
                glow="rgba(0, 230, 118, 0.1)"
             />
           </StaggerItem>
           <StaggerItem>
             <StatCard 
                title="System Status" 
                value="Optimal" 
                isText
                subtitle="Engine V2 Online" 
                icon={<Zap className="w-6 h-6" />}
                gradient="from-[#00e5ff]"
                glow="rgba(0, 229, 255, 0.1)"
             />
           </StaggerItem>
           <StaggerItem>
             <StatCard 
                title="Pinned Targets" 
                value={stats.watched} 
                subtitle="Asset Watchlist" 
                icon={<Star className="w-6 h-6" />}
                gradient="from-[#ffab00]"
                glow="rgba(255, 171, 0, 0.1)"
             />
           </StaggerItem>
        </StaggerContainer>

        {/* Dynamic Sections Loop */}
        <div className="space-y-20">
          {dashboardLayout.filter(s => s.visible).map((section) => {
            switch (section.id) {
              case 'MARKET_OVERVIEW':
                return (
                  <section key={section.id} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
                         <div className="w-2 h-8 bg-gradient-to-b from-[#2979ff] to-[#1565c0] rounded-full" />
                         Market Indices
                      </h2>
                    </div>
                    <MarketOverview />
                  </section>
                )
              case 'WATCHLIST':
                return <div key={section.id}><PersonalizedFeed /></div>
              case 'LEARNING_TIPS':
                return <div key={section.id}><DailyTip /></div>
              case 'TOP_MOVERS':
                return <div key={section.id}><TopMovers gainers={gainers} losers={losers} /></div>
              case 'MARKET_CALENDAR':
                return <div key={section.id}><MarketStatusRow status={marketStatus} config={marketConfig} /></div>
              default:
                return null
            }
          })}
        </div>

      </div>
    </FadeIn>
  )
}

function StatCard({ title, value, subtitle, icon, gradient, glow, suffix = "", isText = false }: any) {
  return (
    <div className="glass-card p-8 rounded-3xl group overflow-hidden relative border border-white/5">
       <div 
         className={cn("absolute top-0 right-0 w-40 h-40 blur-[80px] opacity-10 transition-shadow group-hover:opacity-20 pointer-events-none -mr-20 -mt-20 bg-gradient-to-br", gradient)} 
       />
       
       <div className="flex items-center space-x-4 mb-8">
          <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10 text-white shadow-xl transition-transform group-hover:scale-110", gradient.replace('from-', 'text-'))}>
             {icon}
          </div>
          <h4 className="text-[11px] font-black text-[#8899a6] uppercase tracking-[0.2em]">{title}</h4>
       </div>

       <div className="text-5xl font-black text-white font-mono tracking-tighter mb-4">
          {isText ? value : <AnimatedNumber value={value} suffix={suffix} decimals={0} />}
       </div>
       <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
          <p className="text-xs text-[#00e676] font-black uppercase tracking-widest">
             {subtitle}
          </p>
       </div>
    </div>
  )
}

function MarketStatusRow({ status, config }: any) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between glass-card p-10 rounded-[2.5rem] border border-white/5 gap-10">
      <div className="flex items-center space-x-8">
        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 shadow-2xl relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#2979ff] to-[#00e5ff] rounded-2xl blur opacity-20" />
          <Calendar className="w-10 h-10 text-white relative z-10" />
        </div>
        <div>
          <span className="text-[10px] text-[#8899a6] font-black uppercase tracking-[0.3em] block mb-3">System Exchange Gateway</span>
          <div className="flex items-center gap-6">
             <span className="text-3xl font-black text-white tracking-tighter">{config.exchangeName}</span>
             {status === 'open' ? (
              <span className="px-5 py-2 rounded-full bg-[#00e67610] text-[#00e676] border border-[#00e67620] text-[10px] font-black tracking-widest flex items-center shadow-lg shadow-[#00e6760a]">
                <PulseDot color="green" /> <span className="ml-3">LIVE SESSION ACTIVE</span>
              </span>
            ) : (
              <span className="px-5 py-2 rounded-full bg-[#ff174410] text-[#ff1744] border border-[#ff174420] text-[10px] font-black tracking-widest flex items-center shadow-lg shadow-[#ff17440a]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff1744] mr-3" /> MARKET DISCONNECTED
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-16 px-10">
         <div className="text-right space-y-2">
            <p className="text-[10px] text-[#5c6b7a] font-black uppercase tracking-[0.3em]">Temporal Zone</p>
            <p className="text-sm text-[#f0f4f8] font-mono font-black">{config.marketHours.timezone}</p>
         </div>
         <div className="text-right space-y-2">
            <p className="text-[10px] text-[#5c6b7a] font-black uppercase tracking-[0.3em]">Internal System Time</p>
            <p className="text-4xl text-[#00e676] font-mono font-black tracking-tighter">
               {new Date().toLocaleTimeString(config.locale, { timeZone: config.marketHours.timezone, hour: '2-digit', minute: '2-digit', hour12: false })}
            </p>
         </div>
      </div>
    </section>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-12 animate-in fade-in px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-4">
           <Skeleton className="h-16 w-96 rounded-2xl shimmer" />
           <Skeleton className="h-6 w-80 rounded-lg shimmer" />
        </div>
        <Skeleton className="h-16 w-64 rounded-2xl shimmer" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-56 w-full rounded-3xl shimmer" />)}
      </div>
      <Skeleton className="h-28 w-full rounded-[2.5rem] shimmer" />
      <div className="space-y-20">
        {[1,2].map(i => (
          <div key={i} className="space-y-8">
             <Skeleton className="h-12 w-72 rounded-xl shimmer" />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(j => <Skeleton key={j} className="h-80 w-full rounded-[2rem] shimmer" />)}
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
