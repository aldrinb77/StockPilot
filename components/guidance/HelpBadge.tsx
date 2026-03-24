import { useState } from "react"
import { HelpCircle } from "lucide-react"

export function HelpBadge({ title, description }: { title: string, description: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-flex items-center ml-2 z-10" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <HelpCircle className="w-4 h-4 text-gray-500 hover:text-tvBlue cursor-help transition-colors" />
      
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 glass-panel p-3 rounded-xl shadow-xl border border-gray-700/50 animate-in fade-in zoom-in-95 pointer-events-none">
          <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
          <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700/50" />
        </div>
      )}
    </div>
  )
}
