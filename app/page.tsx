"use client"

import Link from "next/link"
import { 
  ArrowRight, 
  BarChart2, 
  ShieldCheck, 
  Zap, 
  Star, 
  PieChart, 
  BookOpen, 
  ChevronRight, 
  Search, 
  Layers,
  Sparkles,
  MousePointer2,
  TrendingUp,
  Globe
} from "lucide-react"
import { motion } from "framer-motion"
import { FADE_IN, STAGGER_CONTAINER } from "@/lib/animations"

export default function Home() {
  return (
    <div className="bg-[#0a0e17] text-foreground min-h-screen flex flex-col relative overflow-hidden selection:bg-tvGreen/30 selection:text-tvGreen">
      {/* Background Animated Gradients */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-tvGreen/10 rounded-full blur-[140px] pointer-events-none animate-pulse opacity-50" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-tvBlue/10 rounded-full blur-[120px] pointer-events-none opacity-40" />
      
      {/* Premium Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto w-full relative z-50"
      >
        <div className="flex items-center space-x-3 text-white group cursor-pointer">
          <div className="p-2 bg-tvGreen/10 rounded-xl border border-tvGreen/20 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-tvGreen" />
          </div>
          <span className="text-2xl font-black tracking-tighter">StoxPilot</span>
        </div>
        <div className="flex items-center space-x-8">
           <Link href="/dashboard" className="hidden md:block text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            Intelligence
          </Link>
          <Link href="/learn" className="hidden md:block text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            Academy
          </Link>
          <Link href="/dashboard" className="premium-button text-xs tracking-[0.2em] py-2.5 ripple">
            LAUNCH SYSTEM
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-8 py-20 md:py-32 w-full relative z-10 flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 text-gray-300 text-[10px] font-black tracking-[0.2em] uppercase mb-8 border border-white/10 backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3 text-tvAmber mr-2 animate-bounce" />
          Free Institutional-Grade Education
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8"
        >
          Master the Market <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-tvGreen via-emerald-400 to-tvBlue pr-2">With Precision.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-medium"
        >
          Algorithmic technical education tracking market behavior via strict mathematical bounds. 
          <span className="text-white block font-black uppercase tracking-widest text-sm mt-4 opacity-80">No AI. No Predictions. No Bias. 100% Free.</span>
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto px-10 py-5 bg-tvGreen hover:bg-tvGreen/90 text-white font-black rounded-2xl transition-all shadow-2xl shadow-tvGreen/30 flex items-center justify-center group text-lg ripple active:scale-95"
          >
            Start Analyzing
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <button className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all flex items-center justify-center text-lg active:scale-95">
            How It Works
          </button>
        </motion.div>

        {/* Cinematic Mockup Preview */}
        <motion.div 
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, type: 'spring', damping: 20 }}
           className="mt-32 relative max-w-5xl mx-auto w-full group"
        >
           <div className="absolute inset-0 bg-tvGreen/20 blur-[100px] opacity-0 group-hover:opacity-30 transition-opacity" />
           <div className="relative glass-card rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-white/10">
              <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-6 justify-between">
                 <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                 </div>
                 <div className="px-3 py-1 bg-black/40 rounded-full text-[10px] font-black text-gray-500 tracking-widest uppercase">
                    StoxPilot System Interface v1.1
                 </div>
              </div>
              <div className="h-[500px] bg-gradient-to-b from-[#1E222D] to-[#0a0e17] p-12 flex flex-col items-center justify-center relative">
                 <div className="text-9xl font-black text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none tracking-tight">
                    INTELLIGENCE
                 </div>
                 <motion.div
                   animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.02, 1]
                   }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="z-10 flex flex-col items-center"
                 >
                    <BarChart2 className="w-40 h-40 text-tvGreen mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                 </motion.div>
                 <div className="mt-8 flex flex-col items-center space-y-3 z-10">
                    <h3 className="text-white font-black text-xl tracking-tight">QUANT DATA STREAM ACTIVATED</h3>
                    <div className="flex space-x-2">
                       {[1,2,3,4,5].map(i => (
                          <motion.div 
                             key={i}
                             animate={{ height: [10, 30, 15, 25, 12] }}
                             transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                             className="w-1.5 bg-tvGreen rounded-full" 
                          />
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      </main>

      {/* Value Proposition Section */}
      <section className="bg-[#0d1117] border-y border-white/5 py-32 px-8 relative z-10 w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-mesh-gradient opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Technical Literacy. Simplified.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-xl leading-relaxed font-medium">StoxPilot automates the complex math behind technical analysis so you can study price behavior without the guesswork.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureStep 
              num="01"
              title="Momentum Extraction" 
              desc="Search for any ticker to see how algorithmic indicators interpret current price pressure via EMA confluence."
              color="text-tvBlue"
              icon={<Zap className="w-6 h-6" />}
            />
            <FeatureStep 
              num="02"
              numColor="text-tvGreen"
              title="Cluster Analysis" 
              desc="Observe how RSI, MACD, and Price Action form alignment zones based on historically proven math models."
              color="text-tvGreen"
              icon={<Layers className="w-6 h-6" />}
            />
            <FeatureStep 
              num="03"
              numColor="text-tvAmber"
              title="Risk Guardrails" 
              desc="Practice discipline with automated entry zones and safety boundaries designed for preservation."
              color="text-tvAmber"
              icon={<ShieldCheck className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* Interactive Tool Grid */}
      <section className="py-32 px-8 max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="text-center mb-24"
        >
           <h2 className="text-4xl md:text-5xl font-black text-white mb-6 italic tracking-tight underline decoration-tvGreen/30 underline-offset-8">Educational Armory</h2>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">A ecosystem built for modern technical traders.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Zap />, color: "text-tvAmber", title: "Indicator Sentinels", desc: "Automated alerts that trigger when specific mathematical conditions are met across any market." },
            { icon: <BarChart2 />, color: "text-tvBlue", title: "Pro Charting Suite", desc: "Deep-dive analysis tools powered by TradingView for surgical technical examination." },
            { icon: <MousePointer2 />, color: "text-purple-500", title: "Pattern Screener", desc: "Filter thousands of assets based on RSI divergence, EMA crossovers, and volume spikes." },
            { icon: <Globe />, color: "text-tvGreen", title: "Multi-Market Reach", desc: "Native support for US, NSE, LSE, and European exchanges with localized currency parity." },
            { icon: <PieChart />, color: "text-orange-500", title: "Risk Sandbox", desc: "Model hypothetical trade outcomes and practice position sizing without active capital risk." },
            { icon: <BookOpen />, color: "text-red-400", title: "Technical Academy", desc: "Zero-jargon modules designed to take you from market curiosity to technical proficiency." }
          ].map((f, i) => (
            <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
            >
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="bg-[#05080f] border-t border-white/5 py-24 px-8 w-full z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="text-3xl font-black flex items-center space-x-3 text-white">
              <TrendingUp className="w-8 h-8 text-tvGreen" />
              <span className="tracking-tighter">StoxPilot</span>
            </div>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed">
              StoxPilot is the global standard for free technical analysis education. 
              We track market behavior via strict mathematical bounds to provide institutional-grade literacy for everyone.
            </p>
            <div className="flex space-x-4">
               {['Twitter', 'Discord', 'Github'].map(s => (
                 <a key={s} href="#" className="text-xs font-black uppercase text-gray-600 hover:text-white transition-colors tracking-widest">{s}</a>
               ))}
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="text-[10px] text-tvAmber font-black uppercase tracking-[0.3em] mb-4 p-2 bg-tvAmber/10 rounded-lg border border-tvAmber/20">
               ⚠️ STRICT EDUCATIONAL MANDATE
            </div>
            <p className="text-xs text-gray-600 max-w-xl leading-loose">
               StoxPilot is an educational platform. We do not provide financial advice, buy/sell recommendations, or investment advisory services. 
               Trading involves substantial risk of loss. Always consult with a licensed professional before making financial decisions. 
               Read our <Link href="/disclaimer" className="text-white underline hover:no-underline font-bold">Risk Disclosure</Link>.
            </p>
            <p className="mt-8 text-xs text-gray-800 font-bold">© 2026 STOXPILOT QUANT LOGIC ENGINE. NOT AN ADVISOR.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <div className="glass-card p-10 rounded-3xl group hover:border-white/20 h-full">
      <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${color} mb-8 group-hover:scale-110 transition-all duration-500 group-hover:rotate-3`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  )
}

function FeatureStep({ num, title, desc, color, icon, numColor = "text-tvBlue" }: { num: string, title: string, desc: string, color: string, icon: any, numColor?: string }) {
  return (
    <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 font-black text-6xl opacity-5 transition-opacity group-hover:opacity-10 ${numColor}`}>
         {num}
      </div>
      <div className={`mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit ${color}`}>
         {icon}
      </div>
      <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  )
}

