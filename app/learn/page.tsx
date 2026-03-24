import { GUIDES } from "@/data/guides"
import { GuideCard } from "@/components/learn/GuideCard"
import { BookOpen } from "lucide-react"

export default function LearnPage() {
  return (
    <div className="space-y-8 animate-in fade-in pb-20 max-w-7xl mx-auto">
      
      <div className="text-center py-12 bg-gradient-to-b from-[#1E222D] to-[#131722] rounded-2xl border border-gray-700/50">
        <div className="w-16 h-16 bg-tvGreen/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-tvGreen/30">
          <BookOpen className="w-8 h-8 text-tvGreen" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Learn Stock Trading</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">From absolute zero to confident trader. Learn exactly how the market works without the confusing jargon.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GUIDES.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>

    </div>
  )
}
