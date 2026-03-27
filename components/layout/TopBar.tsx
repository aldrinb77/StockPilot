"use client"

import { usePathname } from "next/navigation"
import { Search, Moon, Sun, Menu, Zap, Bell, Command } from "lucide-react"
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
    <header className="sticky top-0 z-40 bg-[#060a13e6] backdrop-blur-xl border-b border-white/5 h-16 w-full flex items-center justify-between px-6 lg:px-8 transition-all">
      
      <div className="flex flex-1 items-center gap-6">
        <button onClick={toggleMenu} className="lg:hidden text-gray-400 hover:text-white transition-all transform active:scale-90">
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search Bar - Pill Shape */}
        <div className="max-w-[400px] hidden md:flex items-center w-full group relative">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00e676] transition-colors" />
            <input 
              type="text" 
              placeholder="Search stocks... (e.g., RELIANCE, TCS, AAPL)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#00e676] focus:ring-4 focus:ring-[#00e67610] rounded-full pl-11 pr-16 py-2.5 text-sm text-[#f0f4f8] transition-all duration-300 outline-none font-bold placeholder:text-[#5c6b7a]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-gray-500 font-black pointer-events-none">
               <Command className="w-2.5 h-2.5" />
               <span>K</span>
            </div>
          </form>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        
        <div className="hidden md:flex items-center">
           <MarketSelector />
        </div>

        <div className="h-4 w-px bg-white/5 mx-2" />

        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#ffab00]/10 text-[#ffab00] border border-[#ffab00]/20 rounded-xl font-black text-[10px] tracking-widest shadow-lg shadow-[#ffab000a] animate-pulse">
                <Zap className="w-3 h-3 fill-[#ffab00]" />
                GOD MODE
             </div>
          </div>
          
          <button className="relative p-2 text-gray-500 hover:text-white transition-colors group">
             <Bell className="w-5 h-5 group-hover:animate-bounce" />
             <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff1744] rounded-full border-2 border-[#060a13]" />
          </button>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-500 hover:text-white p-2 transition-all active:scale-90"
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
