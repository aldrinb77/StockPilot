import { GUIDES } from "@/data/guides"
import { GuideCard } from "@/components/learn/GuideCard"
import { BookOpen, Terminal, Sparkles, Shield, Zap } from "lucide-react"
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/FadeIn"

export default function EncyclopediaPage() {
  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        <div className="relative glass-card rounded-[3rem] p-12 border border-white/5 overflow-hidden">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#2979ff] to-[#7c4dff] blur-[150px] opacity-[0.08] pointer-events-none" />
           <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[#2979ff] text-[10px] font-black tracking-[0.4em] mb-8 uppercase">
                 <Shield className="w-4 h-4" /> Operational Training Protocols
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight uppercase">
                 Market <br/>
                 <span className="text-gradient bg-gradient-to-r from-[#2979ff] to-[#00e5ff]">Encyclopedia.</span>
              </h1>
              <p className="text-lg text-[#8899a6] font-bold leading-relaxed mb-10">
                 From absolute zero to institutional-level execution. Learn how the StoxPilot engine synthesizes data for high-confidence entries.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                 <div className="flex items-center gap-3 text-xs font-black text-white px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
                    <Zap className="w-4 h-4 text-[#ffab00]" /> High Signal Alpha
                 </div>
                 <div className="flex items-center gap-3 text-xs font-black text-white px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
                    <Terminal className="w-4 h-4 text-[#00e676]" /> Quant Analysis
                 </div>
                 <div className="flex items-center gap-3 text-xs font-black text-white px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
                    <Shield className="w-4 h-4 text-[#2979ff]" /> Risk Neutralization
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-10">
           <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-4">
              <div className="w-2 h-8 bg-[#2979ff] rounded-full" />
              Available Protocols
           </h2>
           
           <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {GUIDES.map((guide) => (
               <StaggerItem key={guide.slug}>
                 <GuideCard guide={guide} />
               </StaggerItem>
             ))}
           </StaggerContainer>
        </div>
      </div>
    </FadeIn>
  )
}
