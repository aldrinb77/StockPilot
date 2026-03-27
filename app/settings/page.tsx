"use client"

import { useState } from "react"
import { useStore } from "@/store/store"
import { useTheme } from "@/components/ThemeProvider"
import { Moon, Sun, Bell, Trash2, ShieldAlert, Settings2, Monitor, Zap, Terminal, Sparkles, Activity, ShieldCheck } from "lucide-react"
import { useAppMode } from "@/hooks/useAppMode"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { isGodMode } = useAppMode()
  const { watchlist, portfolio, appearance, setAppearance } = useStore()
  
  const handleClearWatchlist = () => {
    if (confirm("Are you sure you want to completely clear your watchlist?")) {
      useStore.setState({ watchlist: [] })
    }
  }

  const handleClearPortfolio = () => {
    if (confirm("Are you sure you want to completely clear your active portfolio?")) {
      useStore.setState({ portfolio: [] })
    }
  }

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-5xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
             <div className="flex items-center space-x-2 text-[#8899a6]">
                <Settings2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Hardware Configuration</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
               <Terminal className="w-8 h-8 text-white/20" /> 
               System Settings
             </h1>
             <p className="text-[#8899a6] font-bold text-lg">Fine-tune the mathematical engine and terminal visualization parameters.</p>
          </div>
        </div>

        <StaggerContainer className="space-y-12">
          {/* Appearance Settings */}
          <StaggerItem className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e676] blur-[100px] opacity-[0.03] pointer-events-none" />
            <h2 className="text-xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-tighter">
              <Monitor className="w-6 h-6 text-[#00e676]" /> 
              Terminal Interface
            </h2>
            
            <div className="space-y-10">
              {/* Theme Mode */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-white/5 gap-6">
                <div>
                  <p className="text-white font-black uppercase text-sm tracking-widest mb-1">Theme Protocol</p>
                  <p className="text-xs text-[#5c6b7a] font-bold">Select the visual rendering mode for the station.</p>
                </div>
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 self-stretch md:self-auto">
                  {[
                    { id: 'dark', icon: Moon, label: 'DARK' },
                    { id: 'light', icon: Sun, label: 'LIGHT' },
                    { id: 'system', icon: Monitor, label: 'SYSTEM' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setTheme(m.id as any)}
                      className={`flex-1 md:flex-none flex items-center justify-center space-x-3 px-6 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                        theme === m.id ? 'bg-[#00e676] text-white shadow-xl shadow-[#00e67620]' : 'text-[#8899a6] hover:text-white'
                      }`}
                    >
                      <m.icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-white/5 gap-6">
                <div>
                  <p className="text-white font-black uppercase text-sm tracking-widest mb-1">Primary Accent</p>
                  <p className="text-xs text-[#5c6b7a] font-bold">Protocol highlights and active indicator tint.</p>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                  {[
                    { name: 'Emerald', color: '#00e676' },
                    { name: 'Ocean', color: '#2979ff' },
                    { name: 'Purple', color: '#7c4dff' },
                    { name: 'Rose', color: '#ff1744' },
                    { name: 'Amber', color: '#ffab00' },
                    { name: 'Cyan', color: '#00e5ff' },
                    { name: 'Pink', color: '#f50057' },
                    { name: 'Silver', color: '#8899a6' }
                  ].map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setAppearance({ accentColor: c.color })}
                      title={c.name}
                      className={`w-9 h-9 rounded-full border-[3px] transition-all hover:scale-110 active:scale-95 ${
                        appearance.accentColor === c.color ? 'border-white scale-110 shadow-2xl' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>
              </div>

              {/* Card Style */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 gap-6">
                <div>
                  <p className="text-white font-black uppercase text-sm tracking-widest mb-1">Container Geometry</p>
                  <p className="text-xs text-[#5c6b7a] font-bold">Visual treatment for data array containers.</p>
                </div>
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 self-stretch md:self-auto">
                  {['glass', 'solid', 'bordered'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setAppearance({ cardStyle: s as any })}
                      className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        appearance.cardStyle === s ? 'bg-[#00e676] text-white' : 'text-[#8899a6] hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Persistence Settings */}
          <StaggerItem className="glass-card p-10 rounded-[2.5rem] border border-[#ff174410] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff1744] blur-[100px] opacity-[0.03] pointer-events-none" />
            <h2 className="text-xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-tighter">
               <Trash2 className="w-6 h-6 text-[#ff1744]" /> 
               Data Hygiene
            </h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center py-6 border-b border-white/5">
                <div>
                  <p className="text-white font-black uppercase text-sm tracking-widest mb-1">Clear Watchlist cache</p>
                  <p className="text-xs text-[#5c6b7a] font-bold">Currently tracking {watchlist.length} pinned entities.</p>
                </div>
                <button onClick={handleClearWatchlist} className="px-6 py-3 border border-[#ff174430] text-[#ff1744] hover:bg-[#ff1744] hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#ff174405]">
                  Purge Watchlist
                </button>
              </div>

              <div className="flex justify-between items-center py-6">
                <div>
                  <p className="text-white font-black uppercase text-sm tracking-widest mb-1">Reset Portfolio States</p>
                  <p className="text-xs text-[#5c6b7a] font-bold">You have mapped {portfolio.length} unique trades.</p>
                </div>
                <button onClick={handleClearPortfolio} className="px-6 py-3 border border-[#ff174430] text-[#ff1744] hover:bg-[#ff1744] hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#ff174405]">
                  Destroy Data
                </button>
              </div>
            </div>
          </StaggerItem>

          {/* System Details */}
          <StaggerItem className="text-center space-y-4 py-8">
            <div className="flex items-center justify-center gap-6">
               <div className="h-px bg-white/5 flex-1" />
               <p className="text-[10px] text-[#5c6b7a] font-black uppercase tracking-[0.5em]">System Core Specifications</p>
               <div className="h-px bg-white/5 flex-1" />
            </div>
            <p className="text-[#8899a6] font-bold text-sm">StoxPilot Terminal Engine v2.5.0 Premium Edition</p>
            <p className="text-[9px] text-[#5c6b7a] font-black uppercase tracking-[0.2em]">Next.js 14 / Framer Motion / Zustand / Quant Engine</p>
            <div className="flex items-center justify-center mt-6 gap-4">
               <div className="flex items-center gap-2 px-4 py-1.5 bg-[#00e67610] text-[#00e676] rounded-full border border-[#00e67620] text-[9px] font-black tracking-widest uppercase">
                  <ShieldCheck className="w-3 h-3" /> Security Protocol Active
               </div>
               {isGodMode && (
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-[#ffab0010] text-[#ffab00] rounded-full border border-[#ffab0020] text-[9px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(255,171,0,0.1)] animate-pulse">
                   <Zap className="w-3 h-3 fill-[#ffab00]" /> God Mode Enabled
                 </div>
               )}
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </FadeIn>
  )
}
