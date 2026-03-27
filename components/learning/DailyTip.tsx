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
    
    // Increment streak logic (simple version)
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
      case 'Risk Management': return 'bg-tvAmber/10 text-tvAmber border-tvAmber/20'
      case 'Technical Analysis': return 'bg-tvBlue/10 text-tvBlue border-tvBlue/20'
      case 'Trading Psychology': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      default: return 'bg-tvGreen/10 text-tvGreen border-tvGreen/20'
    }
  }

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
        case 'Risk Management': return <Shield className="w-3 h-3" />
        case 'Technical Analysis': return <TrendingUp className="w-3 h-3" />
        case 'Trading Psychology': return <Zap className="w-3 h-3" />
        default: return <Lightbulb className="w-3 h-3" />
      }
  }

  return (
    <div className="glass-card relative overflow-hidden group border border-white/5">
      <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
        <BookOpen className="w-20 h-20 text-tvGreen" />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-tvGreen/10 rounded-lg">
              <Lightbulb className="w-5 h-5 text-tvGreen animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Daily Learning</h3>
              <div className="flex items-center text-[10px] text-gray-500 font-bold space-x-2">
                <span className="flex items-center"><Clock className="w-2.5 h-2.5 mr-1" /> {tip.readTime} read</span>
                {streak > 0 && <span className="text-tvAmber flex items-center">🔥 {streak} Day Streak</span>}
              </div>
            </div>
          </div>
          <div className={`px-2 py-1 rounded border text-[8px] font-black uppercase tracking-tighter flex items-center gap-1.5 ${getCategoryColor(tip.category)}`}>
            {getCategoryIcon(tip.category)} {tip.category}
          </div>
        </div>

        <h4 className="text-xl font-black text-white mb-3 tracking-tight flex items-center">
          {tip.emoji} {tip.title}
        </h4>
        
        <p className="text-sm text-gray-400 leading-relaxed font-medium mb-6">
          {tip.tip}
        </p>

        <div className="flex items-center justify-between">
          <button 
            disabled={isRead}
            onClick={markAsRead}
            className={`flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              isRead ? 'bg-tvGreen/20 text-tvGreen' : 'bg-tvGreen text-white hover:scale-105 active:scale-95 shadow-lg shadow-tvGreen/20'
            }`}
          >
            {isRead ? (
              <><Check className="w-4 h-4 mr-2" /> Daily Tip Read</>
            ) : (
              'Mark as Read ✅'
            )}
          </button>
          <div className="flex space-x-2">
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
              <Share2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
