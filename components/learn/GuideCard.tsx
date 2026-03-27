"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Clock, Shield, Terminal } from "lucide-react"

interface GuideCardProps {
  guide: {
    slug: string
    title: string
    description: string
    icon: string
    readTime: string
  }
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <Link 
      href={`/learn/${guide.slug}`}
      className="glass-card p-10 rounded-[2.5rem] border border-white/5 hover:border-[#2979ff40] flex flex-col h-full group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#2979ff] blur-[70px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
          {guide.icon}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-[#8899a6] uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5" />
          {guide.readTime}
        </div>
      </div>
      
      <div className="space-y-3 mb-10 flex-grow">
         <h3 className="text-2xl font-black text-white tracking-tighter uppercase group-hover:text-[#2979ff] transition-colors duration-300">{guide.title}</h3>
         <p className="text-[#8899a6] font-bold text-sm leading-relaxed">{guide.description}</p>
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] font-black text-[#2979ff] uppercase tracking-[0.2em]">
           <Terminal className="w-3.5 h-3.5" /> Start Protocol
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#2979ff] group-hover:text-white transition-all transform group-hover:translate-x-1">
           <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  )
}
