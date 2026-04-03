"use client"

import Link from "next/link"
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  TrendingUp,
  Activity,
  ChevronRight,
  Terminal,
  Shield,
  Layers,
  Database,
  BarChart3,
  Brain,
  Search,
  Timer,
  ChevronDown,
  History
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useUserProfile } from "@/hooks/useUserProfile"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"
import { PulseDot } from "@/components/ui/PulseDot"
import { useEffect, useState, useRef } from "react"

import { TerminalAnimation } from "@/components/ui/TerminalAnimation"

export default function Home() {
  const { userName, isSetupComplete } = useUserProfile()
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="bg-[#060a13] text-white min-h-screen flex flex-col relative overflow-x-hidden selection:bg-[#00e67630] selection:text-[#00e676]">
      
      {/* SECTION 1: HERO (Full Viewport) */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        
        {/* Animated Orbs */}
        <div className="orb w-[300px] h-[300px] bg-[#00e67608] top-[10%] right-[10%]" style={{ animationDelay: '0s' }} />
        <div className="orb w-[400px] h-[400px] bg-[#2979ff06] bottom-[10%] left-[5%]" style={{ animationDelay: '-5s' }} />
        <div className="orb w-[250px] h-[250px] bg-[#7c4dff05] top-[40%] left-[40%]" style={{ animationDelay: '-10s' }} />

        {/* Background Dots Grid */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(0,230,118,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} 
        />

        <motion.div 
          style={{ opacity, scale, y }}
          className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-12"
        >
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#00e676] shadow-xl backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" /> ⚡ Engine Core Localized
          </motion.div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9]">
              Your Personal <br />
              <span className="text-gradient bg-gradient-to-r from-[#00e676] via-[#00e5ff] to-[#2979ff] pb-2 px-2">Trading Command Center</span>
            </h1>
            <p className="text-lg md:text-2xl text-[#8899a6] max-w-2xl mx-auto font-bold leading-relaxed">
              AI-driven market analysis. Real-time signals with 80%+ accuracy. <br className="hidden md:block" />
              Exact buy prices, targets, and stop losses. Built for one trader — you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link 
              href="/dashboard"
              className="premium-button px-10 py-5 text-xl uppercase tracking-tighter flex items-center gap-4 group"
            >
              🚀 Enter Dashboard
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-xl font-black uppercase tracking-tighter hover:bg-white/10 transition-all flex items-center gap-3"
            >
              📊 See How It Works
            </button>
          </div>

          {/* Perspective Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 5 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 w-full max-w-4xl perspective-[1200px]"
          >
             <div 
               className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl shadow-black aspect-video relative animate-float-slow"
               style={{ transform: 'perspective(1200px) rotateY(-5deg) rotateX(10deg)' }}
             >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00e67605] to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-10 bg-[#060a13] border-b border-white/5 flex items-center px-6 gap-2 z-20">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                   <span className="ml-4 text-[9px] font-black text-gray-600 uppercase tracking-widest font-mono">STOX_PILOT_OS // LOGGING ACTIVE</span>
                </div>
                
                <TerminalAnimation />

                <div className="p-12 relative z-20 h-full flex flex-col justify-center items-center text-center">
                   <div className="space-y-6">
                      <div className="flex items-center justify-center gap-4 text-[#00e676] animate-pulse">
                         <div className="p-4 bg-[#00e67610] rounded-2xl border border-[#00e67640]">
                            <Zap className="w-8 h-8" />
                         </div>
                         <div className="text-left py-2 border-l-2 border-[#00e67630] pl-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] block">Data Packets Received</span>
                            <span className="text-2xl font-black font-mono">RELIANCE +1.2%</span>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="px-6 py-3 bg-[#2979ff10] border border-[#2979ff30] rounded-2xl text-[10px] font-black text-[#2979ff] uppercase tracking-widest font-mono animate-float-slow">BUY_ORDER_EXECUTED</div>
                         <div className="px-6 py-3 bg-[#7c4dff10] border border-[#7c4dff30] rounded-2xl text-[10px] font-black text-[#7c4dff] uppercase tracking-widest font-mono animation-delay-2000 animate-float-slow">TREND_CORRELATION: 0.94</div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Transmission</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>

      </section>

      {/* SECTION A: Real-Time Market Intelligence */}
      <ScrollSection title="Real-Time Market Intelligence" className="bg-[#0b1120]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-2xl shadow-black/40">
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-[#00e67610] border border-[#00e67620] rounded-full text-[9px] font-black text-[#00e676] uppercase tracking-widest">
               <PulseDot color="green" /> Live Analysis Active
            </div>
            <div className="mt-8 space-y-6">
               <div className="flex justify-between items-end">
                  <div>
                    <span className="text-gray-500 font-black text-xs uppercase tracking-widest">Signal Detected</span>
                    <h3 className="text-5xl font-black text-white tracking-tighter">RELIANCE</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-6xl font-black text-[#00e676] tracking-tighter">STRONG BUY</span>
                  </div>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '92%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#00e676] to-[#00e5ff]" 
                  />
               </div>
               <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Entry</p>
                     <p className="text-lg font-black text-white">₹2,456</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Target</p>
                     <p className="text-lg font-black text-[#00e5ff]">₹2,580</p>
                  </div>
                  <div className="bg-[#ff174408] p-4 rounded-2xl border border-[#ff174410] text-center">
                     <p className="text-[10px] text-tvRed font-black uppercase tracking-widest mb-1">Stop Loss</p>
                     <p className="text-lg font-black text-tvRed">₹2,390</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="space-y-10">
            <FeatureLine icon={<Zap className="w-8 h-8 text-[#00e676]" />} title="10 Technical Indicators Simultaneously" text="SMC, RSI, MACD, Ichimoku, and EMA alignment protocols analyzed in milliseconds." />
            <FeatureLine icon={<ShieldCheck className="w-8 h-8 text-[#00e5ff]" />} title="Strict 80%+ Confidence Threshold" text="We don't gamble. Every signal passes a multi-layered validation logic before hitting your screen." />
            <FeatureLine icon={<Timer className="w-8 h-8 text-tvAmber" />} title="Real-Time Data Streams" text="Direct latency-optimized pipelines from Yahoo Finance and Twelve Data global networks." />
          </div>
        </div>
      </ScrollSection>

      {/* SECTION B: AI Market Reports */}
      <ScrollSection title="AI Market Intelligence" subtitle="Section 02" className="bg-[#060a13]">
        <div className="flex flex-col lg:flex-row-reverse gap-20 items-center">
          <div className="w-full lg:w-1/2">
             <div className="glass-card p-12 rounded-[4rem] border border-white/5 relative overflow-hidden group shine-effect shadow-2xl shadow-[#2979ff10]">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-[#2979ff10] rounded-2xl flex items-center justify-center text-tvBlue">
                      <Brain className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-[0.3em]">AI Synthesis Report</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Protocol Version: 4.2 Elite</p>
                   </div>
                </div>
                <div className="space-y-8">
                   <div className="h-6 w-full bg-white/5 rounded-lg shimmer" />
                   <div className="h-6 w-3/4 bg-white/5 rounded-lg shimmer" />
                   <div className="h-6 w-full bg-white/5 rounded-lg shimmer" />
                   <div className="h-32 w-full bg-[#2979ff08] border border-[#2979ff10] rounded-3xl mt-12 flex items-center justify-center">
                      <div className="text-center">
                         <p className="text-[10px] font-black text-tvBlue uppercase tracking-widest mb-2">Primary Recommendation</p>
                         <p className="text-2xl font-black text-white uppercase tracking-tighter">BULLISH DIVERGENCE DETECTED</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-10">
            <FeatureLine icon={<Brain className="w-8 h-8 text-tvBlue" />} title="Daily AI Market Analysis" text="Template-based natural language generation synthesized from raw quantitative data points." />
            <FeatureLine icon={<Layers className="w-8 h-8 text-tvPurple" />} title="Sector Rotation Insights" text="Track institutional capital flow patterns across 11 key market sectors in real-time." />
            <FeatureLine icon={<Activity className="w-8 h-8 text-[#00e676]" />} title="Pattern Recognition" text="Detecting Bull Flags, Head & Shoulders, and Channel breakouts automatically." />
          </div>
        </div>
      </ScrollSection>

      {/* SECTION C: Track Everything */}
      <ScrollSection title="The Professional's Edge" subtitle="Section 03" className="bg-[#0b1120] pb-60">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
           {[
             { title: "Trade History", icon: <History className="w-8 h-8 text-tvBlue" />, text: "Track every trade execution and measure your protocol win rate." },
             { title: "Smart Alerts", icon: <Zap className="w-8 h-8 text-tvAmber" />, text: "Never miss a price target with millisecond browser notifications." },
             { title: "Portfolio Tracking", icon: <BarChart3 className="w-8 h-8 text-tvPurple" />, text: "Real-time P&L visualization with sector concentration reports." },
             { title: "Daily Streaks", icon: <TrendingUp className="w-8 h-8 text-[#00e676]" />, text: "Build consistent high-performance trading habits with gamification." }
           ].map((item, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="glass-card p-10 rounded-[3rem] border border-white/5 hover:border-[#00e67620] group text-center"
             >
                <div className="p-6 bg-white/5 rounded-3xl w-fit mx-auto mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-xl">
                   {item.icon}
                </div>
                <h4 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">{item.title}</h4>
                <p className="text-[#8899a6] font-bold leading-relaxed">{item.text}</p>
             </motion.div>
           ))}
        </div>
      </ScrollSection>

      {/* FOOTER */}
      <footer className="bg-[#060a13] border-t border-white/5 py-20 px-10 relative overflow-hidden">
         <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00e67680] to-transparent shadow-[0_0_20px_#00e67640]" />
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 opacity-40">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                 <TrendingUp className="w-6 h-6 text-[#00e676]" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter">StoxPilot</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500">Built for Serious Operators v2.0 Elite</p>
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
               <span className="text-tvBlue">Uptime: 99.99%</span>
               <span className="text-tvPurple">Latency: 45ms</span>
               <span className="text-tvGreen">SECURED_LOCAL</span>
            </div>
         </div>
      </footer>
    </div>
  )
}

function ScrollSection({ children, title, subtitle = "Section 01", className = "" }: { children: React.ReactNode, title: string, subtitle?: string, className?: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative min-h-screen py-40 px-6 md:px-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-20">
         <div className="space-y-4">
            <span className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.5em]">{subtitle}</span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter max-w-2xl leading-none">
              {title}
            </h2>
         </div>
         {children}
      </div>
    </motion.section>
  )
}

function FeatureLine({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="flex gap-8 group">
       <div className="mt-1 group-hover:scale-110 transition-transform duration-500">
          {icon}
       </div>
       <div className="space-y-2">
          <h4 className="text-2xl font-black text-white tracking-tighter uppercase group-hover:text-tvBlue transition-colors">{title}</h4>
          <p className="text-lg text-[#8899a6] font-bold leading-relaxed">{text}</p>
       </div>
    </div>
  )
}
