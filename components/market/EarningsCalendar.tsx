"use client"

import { EARNINGS_DATA, EarningsEvent } from "@/data/earnings"
import { useStore } from "@/store/store"
import { MARKETS } from "@/lib/markets"
import { 
  Calendar as CalendarIcon, 
  Bell, 
  AlertTriangle, 
  Info, 
  CloudRain, 
  Zap,
  ArrowRight
} from "lucide-react"
import { useMemo } from "react"
import Link from "next/link"

export function EarningsCalendar() {
  const { selectedMarket, watchlist } = useStore()
  const marketConfig = MARKETS[selectedMarket]
  
  const events = useMemo(() => {
    // Sort by date proximity
    return [...EARNINGS_DATA].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [])

  const grouped = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    
    return {
      today: events.filter(e => e.date === today),
      tomorrow: events.filter(e => e.date === tomorrow),
      upcoming: events.filter(e => e.date > tomorrow && e.date < new Date(Date.now() + 604800000).toISOString().split('T')[0])
    }
  }, [events])

  return (
    <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffab00] blur-[100px] opacity-[0.03]" />
      <div className="flex items-center justify-between mb-10">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[#ffab00]">
               <CalendarIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Temporal Events Protocol</h3>
         </div>
         <Link href="/calendar" className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
            Full Calendar <ArrowRight className="w-3 h-3" />
         </Link>
      </div>

      <div className="space-y-12">
        {/* TODAY Section */}
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#ff1744] shadow-[0_0_8px_#ff1744]" />
              <h4 className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">Active Today</h4>
           </div>
           {grouped.today.length > 0 ? (
              grouped.today.map(event => <EventCard key={event.symbol} event={event} highlighted />)
           ) : (
              <p className="text-[10px] text-[#5c6b7a] font-bold uppercase tracking-widest ml-5">No Primary Volatility Events</p>
           )}
        </div>

        {/* TOMORROW Section */}
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#ffab00]" />
              <h4 className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">Immediate Horizon (Tomorrow)</h4>
           </div>
           {grouped.tomorrow.length > 0 ? (
              grouped.tomorrow.map(event => <EventCard key={event.symbol} event={event} />)
           ) : (
              <p className="text-[10px] text-[#5c6b7a] font-bold uppercase tracking-widest ml-5">Standard Market Session</p>
           )}
        </div>

        {/* THIS WEEK Section */}
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#2979ff]" />
              <h4 className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest">Weekly Strategic Windows</h4>
           </div>
           <div className="space-y-3">
              {grouped.upcoming.map(event => (
                 <div key={event.symbol} className="flex items-center justify-between ml-5">
                    <span className="text-xs font-black text-white">{event.name}</span>
                    <span className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest">
                       {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                 </div>
              ))}
           </div>
        </div>

        <div className="p-6 bg-[#ffab0010] border border-[#ffab0020] rounded-2xl flex items-start gap-4">
           <AlertTriangle className="w-5 h-5 text-[#ffab00] shrink-0" />
           <p className="text-[10px] leading-relaxed text-[#ffab00] font-bold uppercase tracking-widest">
              Strategic Warning: High volatility expected during quarterly results. Avoid entering new positions 48h prior to reporting.
           </p>
        </div>
      </div>
    </div>
  )
}

function EventCard({ event, highlighted = false }: { event: EarningsEvent, highlighted?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${highlighted ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5'} transition-all hover:bg-white/5`}>
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-3">
            <Bell className={`w-4 h-4 ${highlighted ? 'text-[#ff1744]' : 'text-[#8899a6]'}`} />
            <span className="text-sm font-black text-white uppercase tracking-tighter">{event.symbol} — {event.type} Disclosure</span>
         </div>
         {highlighted && <Zap className="w-4 h-4 text-[#ffab00]" />}
      </div>
      <div className="text-[10px] font-black text-[#8899a6] uppercase tracking-widest ml-7">
        Timing: {event.time} {event.expectedEPS && `| Est: ${event.expectedEPS}`}
      </div>
      {highlighted && (
        <div className="mt-4 flex items-center gap-2 ml-7 text-[8px] font-black uppercase text-[#ff1744] tracking-[0.2em] animate-pulse">
           ⚠️ High Structural Volatility Alert
        </div>
      )}
    </div>
  )
}
