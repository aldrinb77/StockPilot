"use client"

import { usePathname } from "next/navigation"
import { Search, Moon, Sun, Menu, Bell } from "lucide-react"
import { useStore } from "@/store/store"
import { useMenuStore } from "@/store/useMenuStore"
import { useState, useEffect } from "react"
import { useTheme } from "../ThemeProvider"
import { useRouter } from "next/navigation"
import { NotificationCenter } from "@/components/notifications/NotificationCenter"

export default function TopBar() {
  const pathname = usePathname()
  const toggleMenu = useMenuStore((state: any) => state.toggleSidebar)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    router.push(`/stock/${search.trim().toUpperCase()}`)
    setSearch('')
  }

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

      <div className="flex items-center space-x-4">
        <NotificationCenter />

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

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-tvGreen to-blue-500 border border-gray-700 flex items-center justify-center text-white font-bold text-xs cursor-pointer">
          SP
        </div>
      </div>
    </header>
  )
}
