import { Info, Cpu, Github, ExternalLink, ShieldAlert, Zap, TrendingUp, Sparkles, Terminal } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="space-y-12 animate-in fade-in pb-20 max-w-5xl mx-auto px-6">
      <div className="text-center py-24 glass-card rounded-[2.5rem] border border-white/5 mb-12 relative overflow-hidden bg-mesh-gradient-subtle">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tvGreen/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="w-24 h-24 bg-tvGreen/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-tvGreen/20 shadow-2xl shadow-tvGreen/10 group-hover:scale-110 transition-transform">
          <TrendingUp className="w-12 h-12 text-tvGreen" />
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter mb-6 underline decoration-tvGreen/20 underline-offset-8">Terminal Protocol</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
          StoxPilot is a private, high-performance quantitative intelligence engine designed for professional market analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
         <div className="glass-card p-10 rounded-3xl border-l-4 border-l-tvBlue bg-tvBlue/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
               <Cpu className="w-6 h-6 text-tvBlue" /> Pure Math. No Noise.
            </h2>
            <p className="text-gray-400 leading-relaxed font-medium">
               This terminal strips away market noise, news sentiment, and AI-driven guesswork. It operates exclusively on <strong>Classical Momentum and Volatility Models</strong>. 
               By quantifying price behavior into 12 distinct indicator arrays, we provide surgical execution levels that are verifiable and predictable.
            </p>
         </div>
         <div className="glass-card p-10 rounded-3xl border-l-4 border-l-tvAmber bg-tvAmber/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
               <ShieldAlert className="w-6 h-6 text-tvAmber" /> Private Infrastructure
            </h2>
            <p className="text-gray-400 leading-relaxed font-medium">
               Your trading strategy is your competitive advantage. StoxPilot runs entirely on your <strong>local browser environment</strong>. 
               We do not track your searches, your watchlist, or your journal entries. Your edge remains your own.
            </p>
         </div>
      </div>

      <div className="glass-card p-12 rounded-[2rem] border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
           <Terminal className="w-8 h-8 text-tvGreen" />
           <h2 className="text-3xl font-black text-white tracking-tight underline decoration-tvGreen/20 underline-offset-4">Quant Engine Pipeline</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { num: "01", title: "Data Stream", desc: "Secure 8-proxy redundant pipeline fetching realtime OHLCV via Yahoo Finance." },
            { num: "02", title: "Analysis", desc: "Simultaneous execution of 12 indicator formulas via low-latency NPM arrays." },
            { num: "03", title: "Alignment", desc: "Boolean verdict mapping requiring 80% confluence for Strong signals." },
            { num: "04", title: "Execution", desc: "Dynamic ATR-based target mapping for precise risk:reward scaling." }
          ].map((step, i) => (
            <div key={i} className="space-y-4">
               <div className="text-5xl font-black text-tvGreen/10 tracking-widest leading-none">{step.num}</div>
               <h3 className="text-lg font-black text-white tracking-tight">{step.title}</h3>
               <p className="text-xs text-gray-500 font-bold leading-relaxed uppercase tracking-wider">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-12">
         <div className="inline-flex items-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-12">
            <Sparkles className="w-3 h-3 mr-3 text-tvAmber" /> System Version: 2.1.0 (PRO_EDITION)
         </div>
         <div className="flex justify-center gap-6">
            <button className="px-10 py-5 bg-tvGreen text-white font-black rounded-2xl shadow-2xl shadow-tvGreen/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4">
               <Terminal className="w-5 h-5" /> Launch Terminal
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center gap-4">
               <Github className="w-5 h-5" /> Source Access
            </button>
         </div>
      </div>
    </div>
  )
}
