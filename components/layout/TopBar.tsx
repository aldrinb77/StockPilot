"use client"

import { usePathname } from "next/navigation"
import { Search, Moon, Sun, Menu, Zap, User } from "lucide-react"
import { useMenuStore } from "@/store/useMenuStore"
import { useState, useEffect } from "react"
import { useTheme } from "../ThemeProvider"
import { useRouter } from "next/navigation"
import { NotificationCenter } from "@/components/notifications/NotificationCenter"
import { MarketSelector } from "@/components/market/MarketSelector"
import { useUserProfile } from "@/hooks/useUserProfile"

export default function TopBar() {
  const pathname = usePathname()
  const toggleMenu = useMenuStore((state: any) => state.toggleSidebar)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { userName } = useUserProfile()
  
  useEffect(() => setMounted(true), [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    router.push(`/stock/${search.trim().toUpperCase()}`)
    setSearch('')
  }

  if (pathname === "/") return null

  return (
    <header className="sticky top-0 z-40 bg-[#0a0e17]/80 backdrop-blur-xl border-b border-white/5 h-20 w-full flex items-center justify-between px-6 lg:px-10">
      
      <div className="flex flex-1 items-center">
        <button onClick={toggleMenu} className="lg:hidden mr-6 text-gray-400 hover:text-white transition-all transform active:scale-90">
          <Menu className="w-6 h-6" />
        </button>
        {/* Search Bar */}
        <div className="max-w-md hidden md:flex items-center w-full group">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-tvGreen transition-colors" />
            <input 
              type="text" 
              placeholder="Search ticker (e.g. AAPL, RELIANCE.NS)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-tvGreen focus:ring-4 focus:ring-tvGreen/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-foreground transition-all duration-300 outline-none font-bold placeholder:text-gray-600"
            />
          </form>
        </div>
      </div>

      <div className="flex items-center space-x-6 md:space-x-8">
        <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2 space-x-3 group cursor-pointer hover:bg-white/10 transition-all">
           <div className="w-8 h-8 rounded-xl bg-tvGreen/20 flex items-center justify-center border border-tvGreen/30">
              <User className="w-4 h-4 text-tvGreen" />
           </div>
           <div className="hidden lg:block">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Hey,</p>
              <p className="text-xs text-white font-black tracking-tight leading-none">{userName}</p>
           </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] bg-tvAmber/10 text-tvAmber px-3 py-1.5 rounded-xl font-black shadow-lg shadow-tvAmber/10 border border-tvAmber/30 flex items-center tracking-[0.2em]">
              <Zap className="w-3 h-3 mr-2" /> GOD MODE
            </span>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2" />

          <NotificationCenter />
          
          {mounted && <MarketSelector />}

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-500 hover:text-white p-2 transition-all hover:rotate-12 active:scale-90"
            title="Toggle Theme"
          >
            {mounted && (
              theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
