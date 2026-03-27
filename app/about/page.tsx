import { Info, Cpu, Github, ExternalLink, ShieldAlert, Zap, TrendingUp, Sparkles, Terminal, Activity, ShieldCheck, PieChart } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"

export default function AboutPage() {
  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        <div className="text-center py-20 glass-card rounded-[3rem] border border-white/5 mb-16 relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00e676] blur-[150px] opacity-[0.05] pointer-events-none" />
          <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-2xl relative group-hover:scale-110 transition-transform">
            <div className="absolute inset-0 bg-[#00e676] blur-xl opacity-20" />
            <TrendingUp className="w-12 h-12 text-[#00e676] relative z-10" />
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-8 flex flex-col items-center">
             Terminal <span className="text-gradient bg-gradient-to-r from-[#00e676] to-[#00e5ff]">Protocol 2.5</span>
          </h1>
          <p className="text-xl text-[#8899a6] max-w-3xl mx-auto font-bold leading-relaxed px-6">
            Institutional-grade private trading intelligence. StoxPilot is a high-performance quantitative engine designed for professional market analysis and execution mapping.
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
           <StaggerItem className="glass-card p-12 rounded-[2.5rem] border-l-4 border-l-[#2979ff] bg-[#2979ff05] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2979ff] blur-[70px] opacity-10 pointer-events-none" />
              <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4 tracking-tighter uppercase">
                 <Cpu className="w-8 h-8 text-[#2979ff]" /> Precise Logic
              </h2>
              <p className="text-[#8899a6] leading-relaxed font-bold text-lg">
                We eliminate market noise, emotional sentiment, and AI-driven guesswork. StoxPilot operates exclusively on <strong>Classical Mathematical Models</strong> and <strong>Quant Momentum Pipelines</strong>. 
                By synthesizing price behavior into 18 distinct indicator arrays, we provide surgical execution levels that are verifiable and predictable.
              </p>
           </StaggerItem>
           <StaggerItem className="glass-card p-12 rounded-[2.5rem] border-l-4 border-l-[#ffab00] bg-[#ffab0005] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffab00] blur-[70px] opacity-10 pointer-events-none" />
              <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4 tracking-tighter uppercase">
                 <ShieldCheck className="w-8 h-8 text-[#ffab00]" /> Absolute Privacy
              </h2>
              <p className="text-[#8899a6] leading-relaxed font-bold text-lg">
                Your edge is your competitive advantage. StoxPilot runs entirely within your <strong>local browser environment</strong>. 
                No telemetry, no tracking, no external server storage. Your watchlist, portfolio, and logs remain encrypted on your device.
              </p>
           </StaggerItem>
        </StaggerContainer>

        <StaggerItem className="glass-card p-16 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
             <div className="flex items-center gap-6">
                <Terminal className="w-10 h-10 text-[#00e676]" />
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Intelligence Pipeline</h2>
             </div>
             <div className="flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-[#8899a6] uppercase tracking-widest">
                   <Activity className="w-4 h-4" /> Real-time
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-[#8899a6] uppercase tracking-widest">
                   <PieChart className="w-4 h-4" /> Quantitative
                </div>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { num: "01", title: "Data Ingest", desc: "Secure 8-proxy redundant pipeline fetching realtime OHLCV via institutional data providers." },
              { num: "02", title: "Protocol Scan", desc: "Simultaneous execution of multifaceted indicator formulas via low-latency compute arrays." },
              { num: "03", title: "Boolean Logic", desc: "Confluence mapping requiring strict 80% threshold alignment for high-confidence signals." },
              { num: "04", title: "Target Mapping", desc: "Dynamic ATR-based target calculation for precise risk:reward ratio management." }
            ].map((step, i) => (
              <div key={i} className="space-y-6 relative group">
                 <div className="text-7xl font-black text-white/5 tracking-tighter leading-none group-hover:text-[#00e67608] transition-colors">{step.num}</div>
                 <div className="space-y-3">
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase">{step.title}</h3>
                    <p className="text-xs text-[#5c6b7a] font-black leading-relaxed uppercase tracking-[0.2em]">{step.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </StaggerItem>

        <div className="text-center py-20 relative overflow-hidden">
           <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
              <Sparkles className="w-[500px] h-[500px] text-white" />
           </div>
           <div className="relative z-10 space-y-12">
              <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black text-[#5c6b7a] uppercase tracking-[0.5em]">
                 <Zap className="w-4 h-4 mr-4 text-[#ffab00]" /> Operational Status: Optimal (V2.5.0)
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                 <button className="px-12 py-6 bg-gradient-to-r from-[#00e676] to-[#00c853] text-white font-black rounded-3xl shadow-2xl shadow-[#00e67630] hover:scale-105 active:scale-95 transition-all flex items-center gap-5 uppercase text-sm tracking-widest">
                    <Terminal className="w-6 h-6" /> Initialize Terminal
                 </button>
                 <button className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-3xl hover:bg-white/10 transition-all flex items-center gap-5 uppercase text-sm tracking-widest">
                    <Github className="w-6 h-6" /> Protocol Source
                 </button>
              </div>
           </div>
        </div>
      </div>
    </FadeIn>
  )
}
