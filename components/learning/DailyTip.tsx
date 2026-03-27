"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Check, Lightbulb, Clock, Share2, TrendingUp, Shield, Zap } from 'lucide-react'
import { DAILY_TIPS, DailyTip as DailyTipType } from '@/data/dailyTips'

export function DailyTip() {
  const [tip, setTip] = useState<DailyTipType | null>(null)
  const [isRead, setIsRead] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Determine tip of the day
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const currentTip = DAILY_TIPS[dayOfYear % DAILY_TIPS.length]
    setTip(currentTip)

    // Check if read today
    const lastRead = localStorage.getItem('stoxpilot_last_tip_read')
    const todayStr = today.toDateString()
    if (lastRead === todayStr) setIsRead(true)

    // Get streak
    const storedStreak = localStorage.getItem('stoxpilot_learning_streak') || '0'
    setStreak(parseInt(storedStreak))
  }, [])

  const markAsRead = () => {
    const today = new Date().toDateString()
    localStorage.setItem('stoxpilot_last_tip_read', today)
    
    const lastRead = localStorage.getItem('stoxpilot_last_tip_read_internal')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    let newStreak = streak
    if (lastRead === yesterday.toDateString()) {
      newStreak += 1
    } else if (lastRead !== today) {
      newStreak = 1
    }
    
    localStorage.setItem('stoxpilot_learning_streak', newStreak.toString())
    localStorage.setItem('stoxpilot_last_tip_read_internal', today)
    setStreak(newStreak)
    setIsRead(true)
  }

  if (!tip) return null

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Risk Management': return 'bg-[#ffab0015] text-[#ffab00] border-[#ffab0020]'
      case 'Technical Analysis': return 'bg-[#2979ff15] text-[#2979ff] border-[#2979ff20]'
      case 'Trading Psychology': return 'bg-[#7c4dff15] text-[#7c4dff] border-[#7c4dff20]'
      default: return 'bg-[#00e67615] text-[#00e676] border-[#00e67620]'
    }
  }

  return (
    <div className="glass-card p-8 relative overflow-hidden group border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#2979ff] blur-[80px] opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-6 h-6 text-[#ffab00]" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.3em]">Today's Intelligence</h3>
            <div className="flex items-center gap-3 mt-1">
               <span className="flex items-center text-[10px] font-black text-white/40 uppercase tracking-widest"><Clock className="w-3 h-3 mr-1.5" /> {tip.readTime} read</span>
               <div className="h-1 w-1 rounded-full bg-white/10" />
               <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getCategoryColor(tip.category)}`}>
                  {tip.category}
               </div>
            </div>
          </div>
        </div>
        
        {streak > 0 && (
           <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ffab0010] border border-[#ffab0020] rounded-xl text-[#ffab00] text-[10px] font-black tracking-widest uppercase shadow-lg shadow-[#ffab000a]">
              🔥 {streak} DAY STREAK
           </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        <h4 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
           {tip.emoji} {tip.title}
        </h4>
        <p className="text-sm text-[#8899a6] leading-relaxed font-bold">
           {tip.tip}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <button 
          disabled={isRead}
          onClick={markAsRead}
          className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
            isRead ? 'bg-[#00e67620] text-[#00e676] border border-[#00e67630] cursor-default' : 'bg-gradient-to-r from-[#00e676] to-[#00c853] text-white shadow-xl shadow-[#00e67620] hover:scale-105 active:scale-95'
          }`}
        >
          {isRead ? (
            <span className="flex items-center"><Check className="w-4 h-4 mr-2" /> Protocol Acknowledged</span>
          ) : (
            'Mark as Read ✅'
          )}
        </button>
        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-[#8899a6] hover:text-white">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {isRead && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 text-[#00e676]"
          >
            <CheckCircle2 className="w-6 h-6 fill-[#00e67610]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CheckCircle2({ className }: { className?: string }) {
   return (
      <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
   )
}
