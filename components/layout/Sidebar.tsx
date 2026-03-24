"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart2, 
  Search, 
  BookOpen, 
  Settings, 
  LayoutDashboard,
  Zap,
  Star,
  PieChart,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  ArrowLeftRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMenuStore } from "@/store/useMenuStore"

const navItems = [
  { name: "Daily Briefing", href: "/briefing", icon: Newspaper },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Compare", href: "/compare", icon: ArrowLeftRight },
  { name: "Signals", href: "/signals", icon: Zap },
  { name: "Screener", href: "/screener", icon: Search },
  { name: "Watchlist", href: "/watchlist", icon: Star },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isSidebarCollapsed, toggleSidebar } = useMenuStore()

  if (pathname === "/") return null

  return (
    <div 
      className={cn(
        "hidden md:flex flex-col h-full bg-[#131722] border-r border-gray-700/50 transition-all duration-300 relative",
        isSidebarCollapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      <div className={cn("flex items-center h-[56px] flex-shrink-0 border-b border-gray-700/50", isSidebarCollapsed ? "justify-center" : "px-4")}>
        <div className="flex items-center space-x-2 text-white">
          <span className="text-xl">📈</span>
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold tracking-tight">StoxPilot</span>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center transition-colors mx-2 rounded-md h-10 group",
                isActive 
                  ? "bg-tvGreen text-white" 
                  : "text-foreground hover:bg-gray-800",
                isSidebarCollapsed ? "justify-center" : "px-3 space-x-3"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-700/50">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center h-10 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center space-x-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
