"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Clock } from "lucide-react"

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
      className="bg-[#1E222D] border border-gray-700/50 hover:border-tvGreen/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-tvGreen/10 flex flex-col h-full group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-[#131722] rounded-lg border border-gray-700/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {guide.icon}
        </div>
        <div className="flex items-center text-xs text-gray-400 font-medium bg-gray-800/50 px-2 py-1 rounded-full">
          <Clock className="w-3 h-3 mr-1" />
          {guide.readTime}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-tvGreen transition-colors">{guide.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed flex-grow">{guide.description}</p>
      
      <div className="mt-6 flex items-center font-bold text-sm text-tvGreen uppercase tracking-wider">
        Read Guide
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}
