"use client"

import { useState } from "react"
import { useStore } from "@/store/store"
import { useTheme } from "@/components/ThemeProvider"
import { Toggle } from "@/components/ui/toggle"
import { Select } from "@/components/ui/select"
import { Moon, Sun, Bell, Trash2, ShieldAlert } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { watchlist, portfolio } = useStore()
  
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

      {/* Theme Settings */}
      <section className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50">
        <h2 className="text-white font-bold mb-4 flex items-center"><Sun className="w-5 h-5 mr-2 text-yellow-500" /> UI / Presentation</h2>
        
        <div className="flex justify-between items-center py-4 border-b border-gray-800">
          <div>
            <p className="text-white font-medium">Dark Mode Default</p>
            <p className="text-sm text-gray-500">Currently utilizing the explicit {"{"}{theme}{"}"} palette.</p>
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`px-4 py-2 rounded-md font-bold transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 inline mr-2" /> : <Moon className="w-4 h-4 inline mr-2" />}
            Toggle {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-gray-800">
          <div>
            <p className="text-white font-medium">Push Notifications (Browser)</p>
            <p className="text-sm text-gray-500">Receive alerts securely strictly during runtime signals rendering.</p>
          </div>
          <Toggle 
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled((e.target as HTMLInputElement).checked)}
          />
        </div>

        <div className="flex justify-between items-center py-4">
          <div>
            <p className="text-white font-medium">Default Signal Timeframe</p>
            <p className="text-sm text-gray-500">Configure global variance scale.</p>
          </div>
          <div className="w-48">
            <Select options={[
              { label: "1 Day (Swing)", value: "1D" },
              { label: "1 Week (Hold)", value: "1W" },
              { label: "4 Hour (Intraday)", value: "4H" }
            ]} />
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
        <div className="flex items-center justify-center mt-4">
           <span className="px-3 py-1 bg-tvGreen/10 text-tvGreen text-xs rounded border border-tvGreen/30 uppercase tracking-widest font-bold">Zero AI Executions Configured</span>
        </div>
      </section>
    </div>
  )
}
