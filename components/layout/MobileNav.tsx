"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart2, 
  Search, 
  LayoutDashboard,
  Zap,
  Star,
  PieChart
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dash", href: "/dashboard", icon: LayoutDashboard },
  { name: "Signals", href: "/signals", icon: Zap },
  { name: "Screener", href: "/screener", icon: Search },
  { name: "Watch", href: "/watchlist", icon: Star },
  { name: "Port", href: "/portfolio", icon: PieChart },
]

export default function MobileNav() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <div className="md:hidden fixed bottom-0 w-full h-[60px] bg-[#1E222D] border-t border-gray-700/50 flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive ? "text-tvGreen" : "text-gray-400 focus:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
