"use client"

import { useState } from "react"
import { INLINE_TIPS } from "@/data/inlineTips"
import { Info, X, ChevronRight, BookOpen, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function InlineTip({ id, className = "" }: { id: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const tip = INLINE_TIPS[id]

  if (!tip) return null

  return (
    <div className={cn("inline-block", className)}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[9px] font-black text-tvBlue hover:text-[#00e5ff] uppercase tracking-widest transition-all group"
      >
        <span className="bg-tvBlue/10 p-1 rounded-md border border-tvBlue/20 group-hover:scale-110 transition-transform">
           {isOpen ? <X className="w-2.5 h-2.5" /> : <Info className="w-2.5 h-2.5" />}
        </span>
        Learn
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-[100] mt-4 w-72 glass-card p-6 border-l-[4px] border-l-tvBlue shadow-2xl shadow-black h-fit"
          >
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-tvBlue/10 rounded-lg flex items-center justify-center text-tvBlue">
                   <BookOpen className="w-4 h-4" />
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{tip.title}</h4>
                   <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest opacity-50">{tip.category} ALPHA</span>
                </div>
             </div>
             
             <p className="text-xs text-[#8899a6] font-bold leading-relaxed mb-6 italic">
                "{tip.fullDesc}"
             </p>

             <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group/go cursor-pointer hover:bg-white/10 transition-all">
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Open Guide System</span>
                <ChevronRight className="w-4 h-4 text-tvBlue group-hover/go:translate-x-2 transition-transform" />
             </div>
             
             <div className="absolute top-2 right-2 flex items-center gap-1 opacity-20">
                <GraduationCap className="w-3 h-3 text-white" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
