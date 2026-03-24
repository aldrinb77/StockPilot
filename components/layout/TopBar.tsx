"use client"

import { usePathname } from "next/navigation"
import { Search, Moon, Sun, Menu, Bell } from "lucide-react"
import { useStore } from "@/store/store"
import { useMenuStore } from "@/store/useMenuStore"
import { useState, useEffect } from "react"
import { useTheme } from "../ThemeProvider"
import { useRouter } from "next/navigation"
import { NotificationCenter } from "@/components/notifications/NotificationCenter"
import { useAppMode } from "@/hooks/useAppMode"
import { enableGodMode, disableGodMode } from '@/lib/simpleAuth'
import { Zap } from "lucide-react"

import { MarketSelector } from "@/components/market/MarketSelector"

export default function TopBar() {
  const pathname = usePathname()
  const toggleMenu = useMenuStore((state: any) => state.toggleSidebar)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { isGodMode: godMode, refreshMode } = useAppMode()
  
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [codeValue, setCodeValue] = useState('')
  const [codeError, setCodeError] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    router.push(`/stock/${search.trim().toUpperCase()}`)
    setSearch('')
  }
  
  const handleCodeSubmit = () => {
    const success = enableGodMode(codeValue);
    if (success) {
      refreshMode();
      setShowCodeInput(false);
      setCodeValue('');
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  const handleDisableGodMode = () => {
    disableGodMode();
    refreshMode();
  };

  // Exact matching against home
  if (pathname === "/") return null

  return (
    <header className="sticky top-0 z-40 bg-[#131722]/80 backdrop-blur-md border-b border-gray-800 h-16 w-full flex items-center justify-between px-4 lg:px-8">
      
      <div className="flex flex-1 items-center">
        <button onClick={toggleMenu} className="lg:hidden mr-4 text-gray-400 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        {/* Search Bar */}
        <div className="max-w-md hidden md:flex items-center w-full">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search stock symbol..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1E222D] border border-gray-700 focus:border-tvGreen focus:ring-1 focus:ring-tvGreen rounded-lg pl-10 pr-4 py-2 text-sm text-foreground transition-all duration-200 outline-none"
            />
          </form>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <NotificationCenter />
        
        {mounted && <MarketSelector />}

        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-gray-400 hover:text-white p-2"
          aria-label="Toggle theme"
          title="Toggle Theme"
        >
          {mounted && (
            theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center justify-center pl-2">
            {godMode ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium shadow-lg shadow-yellow-500/10 border border-yellow-500/30 flex items-center tracking-widest">
                  <Zap className="w-3 h-3 mr-1" /> GOD MODE
                </span>
                <button
                  onClick={handleDisableGodMode}
                  className="text-[10px] uppercase font-bold text-gray-400 hover:text-tvRed transition tracking-widest"
                >
                  Disable
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowCodeInput(!showCodeInput)}
                  className="text-gray-400 hover:text-white transition p-2 cursor-pointer"
                  title="Admin Access"
                >
                  🔒
                </button>
                {showCodeInput && (
                  <div className="absolute right-0 top-12 bg-[#1E222D] border border-gray-700 rounded-xl p-4 shadow-2xl z-50 w-64">
                    <p className="text-sm text-gray-300 mb-2 font-bold tracking-tight">Enter access code:</p>
                    <input
                      type="password"
                      value={codeValue}
                      onChange={(e) => { setCodeValue(e.target.value); setCodeError(false); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                      className="w-full bg-[#131722] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm mb-2 focus:border-tvGreen focus:outline-none"
                      placeholder="Access code..."
                      autoFocus
                    />
                    {codeError && <p className="text-tvRed text-xs mb-2 font-bold">Invalid code</p>}
                    <button
                      onClick={handleCodeSubmit}
                      className="w-full bg-tvGreen hover:bg-emerald-500 text-white font-bold text-sm py-2 rounded-lg transition"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </header>
  )
}
