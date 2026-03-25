"use client"

import { useState } from "react"
import { useStore } from "@/store/store"
import { useTheme } from "@/components/ThemeProvider"
import { Toggle } from "@/components/ui/toggle"
import { Select } from "@/components/ui/select"
import { Moon, Sun, Bell, Trash2, ShieldAlert, Settings2, Monitor, Zap } from "lucide-react"
import { useAppMode } from "@/hooks/useAppMode"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { isGodMode } = useAppMode()
  const { watchlist, portfolio, appearance, setAppearance } = useStore()
  
  // Directly manipulating Zustand store for clearing arrays
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
    <div className="space-y-8 animate-in fade-in pb-20 max-w-4xl mx-auto">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
          <ShieldAlert className="w-8 h-8 text-tvGreen mr-3" /> User Configuration
        </h1>
        <p className="text-gray-400 mt-2 text-sm">Fine-tune the mathematical engine rendering settings globally via localStorage.</p>
      </div>

      {/* Appearance Settings */}
      <section className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50">
        <h2 className="text-white font-bold mb-6 flex items-center font-heading text-lg">
          <Settings2 className="w-5 h-5 mr-3 text-tvGreen" /> 
          Appearance & Themes
        </h2>
        
        {/* Theme Mode */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-b border-gray-800 gap-4">
          <div>
            <p className="text-white font-bold">Theme Mode</p>
            <p className="text-sm text-gray-500">Choose how StoxPilot looks on your device.</p>
          </div>
          <div className="flex bg-black/40 p-1 rounded-xl border border-gray-800 self-stretch md:self-auto">
            {[
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'system', icon: Monitor, label: 'System' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setTheme(m.id as any)}
                className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  theme === m.id ? 'bg-tvGreen text-white shadow-lg shadow-tvGreen/20' : 'text-gray-500 hover:text-white'
                }`}
              >
                <m.icon className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-b border-gray-800 gap-4">
          <div>
            <p className="text-white font-bold">Accent Color</p>
            <p className="text-sm text-gray-500">Personalize your signal highlights and buttons.</p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {[
              { name: 'Emerald', color: '#10B981' },
              { name: 'Ocean', color: '#3B82F6' },
              { name: 'Purple', color: '#8B5CF6' },
              { name: 'Rose', color: '#F43F5E' },
              { name: 'Amber', color: '#F59E0B' },
              { name: 'Cyan', color: '#06B6D4' },
              { name: 'Pink', color: '#EC4899' },
              { name: 'Silver', color: '#94A3B8' }
            ].map((c) => (
              <button
                key={c.name}
                onClick={() => setAppearance({ accentColor: c.color })}
                title={c.name}
                className={`w-8 h-8 rounded-full border-4 transition-all hover:scale-110 ${
                  appearance.accentColor === c.color ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.color }}
              />
            ))}
          </div>
        </div>

        {/* Card Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-b border-gray-800 gap-4">
          <div>
            <p className="text-white font-bold">Card Style</p>
            <p className="text-sm text-gray-500">Visual treatment for data containers.</p>
          </div>
          <div className="flex bg-black/40 p-1 rounded-xl border border-gray-800 self-stretch md:self-auto">
            {['glass', 'solid', 'bordered'].map((s) => (
              <button
                key={s}
                onClick={() => setAppearance({ cardStyle: s as any })}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  appearance.cardStyle === s ? 'bg-tvGreen text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 gap-4">
          <div>
            <p className="text-white font-bold">Font Size</p>
            <p className="text-sm text-gray-500">Adjust text size for better readability.</p>
          </div>
          <div className="flex bg-black/40 p-1 rounded-xl border border-gray-800 self-stretch md:self-auto">
            {['small', 'medium', 'large'].map((fs) => (
              <button
                key={fs}
                onClick={() => setAppearance({ fontSize: fs as any })}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  appearance.fontSize === fs ? 'bg-tvGreen text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {fs}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Persistence Settings */}
      <section className="bg-[#1E222D] p-6 rounded-xl border border-red-900/50">
        <h2 className="text-white font-bold mb-4 flex items-center"><Trash2 className="w-5 h-5 mr-2 text-tvRed" /> Persistence & Cache</h2>
        
        <div className="flex justify-between items-center py-4 border-b border-gray-800">
          <div>
            <p className="text-white font-medium">Clear Client Watchlist</p>
            <p className="text-sm text-gray-500">You currently are tracing {watchlist.length} pinned entities securely.</p>
          </div>
          <button onClick={handleClearWatchlist} className="px-4 py-2 border border-tvRed/50 text-tvRed hover:bg-tvRed hover:text-white rounded-md transition-colors text-sm font-bold">
            Clear Watchlist
          </button>
        </div>

        <div className="flex justify-between items-center py-4">
          <div>
            <p className="text-white font-medium">Clear Portfolio Balances</p>
            <p className="text-sm text-gray-500">You have mapped {portfolio.length} unique trades to test locally.</p>
          </div>
          <button onClick={handleClearPortfolio} className="px-4 py-2 border border-tvRed/50 text-tvRed hover:bg-tvRed hover:text-white rounded-md transition-colors text-sm font-bold">
            Destroy Portfolio
          </button>
        </div>
      </section>

      {/* System Details */}
      <section className="bg-[#131722] p-6 rounded-xl border border-gray-700/50 text-center">
        <p className="text-sm text-gray-400">StoxPilot Engine v1.0.0 (MVP)</p>
        <p className="text-xs text-gray-500 mt-2">React 18 / Next.js 14 / Mathematical Rule-Based Pipeline Array (10+ Checks)</p>
        <div className="flex items-center justify-center mt-4 space-x-3">
           <span className="px-3 py-1 bg-tvGreen/10 text-tvGreen text-xs rounded border border-tvGreen/30 uppercase tracking-widest font-bold">Zero AI Executions Configured</span>
           {isGodMode && (
             <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded border border-yellow-500/50 flex items-center shadow-[0_0_15px_rgba(234,179,8,0.2)] font-bold uppercase tracking-widest">
               <Zap className="w-3 h-3 mr-1" /> God Mode Active
             </span>
           )}
        </div>
      </section>
    </div>
  )
}
