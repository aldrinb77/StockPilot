import { GUIDES } from "@/data/guides"
import Link from "next/link"
import { ArrowLeft, Clock, ChevronRight, ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"

export default function GuidePage({ params }: { params: { slug: string } }) {
  const currentIndex = GUIDES.findIndex(g => g.slug === params.slug)
  const guide = GUIDES[currentIndex]

  if (!guide) {
    notFound()
  }

  const prevGuide = currentIndex > 0 ? GUIDES[currentIndex - 1] : null
  const nextGuide = currentIndex < GUIDES.length - 1 ? GUIDES[currentIndex + 1] : null

  // Very simple markdown parser for the strictly controlled Guides
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mb-4 mt-6">{line.replace('# ', '')}</h1>
      if (line.startsWith('**') && line.includes('**', 2)) {
        const parts = line.split('**')
        return <p key={i} className="mb-4 leading-relaxed text-gray-300">
          <strong className="text-white font-bold">{parts[1]}</strong>{parts.slice(2).join('')}
        </p>
      }
      if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-2 text-gray-300 list-disc">{line.replace('- ', '')}</li>
      if (line.trim() === '') return null;
      return <p key={i} className="mb-4 leading-relaxed text-gray-300">{line}</p>
    })
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in">
      <Link href="/learn" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all guides
      </Link>

      <div className="bg-[#1E222D] border border-gray-700/50 rounded-2xl p-6 md:p-12">
        <div className="flex items-center space-x-3 text-sm text-tvGreen font-semibold uppercase tracking-wider mb-6">
          <span className="text-2xl">{guide.icon}</span>
          <span>•</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {guide.readTime} read</span>
        </div>

        <div className="max-w-none">
          {renderContent(guide.content)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {prevGuide ? (
          <Link href={`/learn/${prevGuide.slug}`} className="flex items-center p-4 bg-[#1E222D] border border-gray-700/50 rounded-xl hover:bg-[#252a36] transition-colors group">
            <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-white mr-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Previous Guide</p>
              <p className="text-white font-medium">{prevGuide.title}</p>
            </div>
          </Link>
        ) : <div />}

        {nextGuide ? (
          <Link href={`/learn/${nextGuide.slug}`} className="flex items-center justify-end p-4 bg-[#1E222D] border border-gray-700/50 rounded-xl hover:bg-[#252a36] transition-colors text-right group">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Next Guide</p>
              <p className="text-white font-medium">{nextGuide.title}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white ml-3" />
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
