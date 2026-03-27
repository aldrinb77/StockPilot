"use client"

import Link from "next/link"
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  TrendingUp,
  Lock,
  Cpu,
  Activity,
  ChevronRight,
  Terminal,
  Shield,
  Layers,
  Database
} from "lucide-react"
import { motion } from "framer-motion"
import { useUserProfile } from "@/hooks/useUserProfile"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"
import { PulseDot } from "@/components/ui/PulseDot"

export default function Home() {
  const { userName, isSetupComplete } = useUserProfile()

  return (
    <div className="bg-[#060a13] text-white min-h-screen flex flex-col relative overflow-hidden selection:bg-[#00e67630] selection:text-[#00e676]">
      
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 bg-animated-mesh opacity-20 pointer-events-none" />
      
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-[#00e67605] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-[#2979ff05] rounded-full blur-[160px] pointer-events-none" />

      {/* NAVIGATION BAR - TRANSPARENT */}
      <nav className="relative z-50 h-24 flex items-center justify-between px-10 md:px-20 max-w-[1920px] mx-auto w-full">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
               <TrendingUp className="w-6 h-6 text-[#00e676]" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">StoxPilot</span>
         </div>
         <div className="hidden md:flex items-center gap-10">
            {['Protocol', 'Intelligence', 'Security'].map(item => (
               <Link key={item} href="/about" className="text-[11px] font-black text-[#5c6b7a] hover:text-white transition-colors uppercase tracking-[0.4em]">{item}</Link>
            ))}
            <Link href="/dashboard" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest text-[#00e676] hover:bg-[#00e67610] transition-colors">Launch App</Link>
         </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-40">
        
        <StaggerContainer className="flex flex-col items-center max-w-5xl text-center space-y-16">
          <StaggerItem>
             <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-[#00e676] shadow-2xl shadow-[#00e6760a]">
                <PulseDot color="green" /> Engine Core Localized
             </div>
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-10">
               Your Markets. <br />
               <span className="text-gradient bg-gradient-to-r from-[#00e676] via-[#00e5ff] to-[#2979ff] pb-2 px-2">Quantified.</span>
             </h1>
             <p className="text-xl md:text-2xl text-[#8899a6] max-w-3xl mx-auto font-bold leading-relaxed mb-12">
               Institutional-grade quantitative intelligence engine. No bias, no noise. Just surgical mathematical alignment for the professional operator.
             </p>
          </StaggerItem>

          <StaggerItem className="flex flex-col items-center gap-10">
              <Link 
                href="/dashboard"
                className="group relative px-16 py-8 bg-gradient-to-r from-[#00e676] to-[#00c853] text-white font-black rounded-[2.5rem] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[#00e67630] flex items-center gap-6 text-2xl uppercase tracking-tighter"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                {isSetupComplete ? `Resume Engine (${userName})` : 'Enter Command Center'}
                <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
              </Link>
              
              <div className="flex flex-wrap justify-center gap-6">
                 {[
                   { icon: <Shield className="w-4 h-4" />, label: "LOCAL_VAULT_ENCRYPTED" },
                   { icon: <Cpu className="w-4 h-4" />, label: "QUANT_PIPELINE_V2" },
                   { icon: <Database className="w-4 h-4" />, label: "YAHOO_REALTIME_SYNC" }
                 ].map(tag => (
                   <div key={tag.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4 text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest backdrop-blur-md hover:border-[#00e67630] hover:text-white transition-all cursor-crosshair">
                      <div className="text-[#00e676]">{tag.icon}</div>
                      {tag.label}
                   </div>
                 ))}
              </div>
          </StaggerItem>
        </StaggerContainer>

        {/* TERMINAL PREVIEW OVERLAY */}
        <motion.div 
           initial={{ opacity: 0, y: 100 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="mt-40 w-full max-w-7xl relative mx-auto group cursor-none"
        >
           <div className="absolute -inset-1 bg-gradient-to-b from-[#00e67620] to-transparent rounded-[3rem] blur-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-1000" />
           <div className="glass-card rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl shadow-black h-[500px] relative">
              <div className="absolute inset-0 bg-white/[0.02] flex items-center justify-center">
                 <div className="text-center space-y-6">
                    <Terminal className="w-20 h-20 text-white/5 mx-auto mb-8 group-hover:scale-110 transition-transform duration-700" />
                    <p className="text-[#5c6b7a] font-black uppercase tracking-[0.6em] text-sm group-hover:text-white transition-colors">Preview Locked — Initialized Terminal To Access Data</p>
                    <div className="flex justify-center gap-2">
                       {[1,2,3,4,5].map(i => <div key={i} className="h-1.5 w-8 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            className="h-full w-full bg-[#00e67630]"
                          />
                       </div>)}
                    </div>
                 </div>
              </div>
              
              {/* Fake UI Elements */}
              <div className="absolute top-10 left-10 space-y-4">
                 <div className="h-4 w-48 bg-white/5 rounded-full" />
                 <div className="h-12 w-64 bg-white/5 rounded-2xl" />
              </div>
              <div className="absolute bottom-10 right-10 space-y-4 text-right">
                 <div className="h-4 w-48 bg-white/5 rounded-full ml-auto" />
                 <div className="h-12 w-96 bg-white/5 rounded-2xl ml-auto" />
              </div>
           </div>
        </motion.div>

        {/* FEATURE CARDS */}
        <div className="mt-40 w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-10">
           {[
             { title: "Surgical Levels", desc: "No guesswork. Explicit BUY, SELL, and STOP LOSS levels mapped to high-precision volatility arrays.", icon: <Zap className="w-8 h-8 text-[#ffab00]" /> },
             { icon: <Lock className="w-8 h-8 text-[#2979ff]" />, title: "Local Exclusivity", desc: "Your intelligence remains your edge. Zero server-side tracking. Zero telemetry. 100% locally encrypted environment." },
             { icon: <Layers className="w-8 h-8 text-[#7c4dff]" />, title: "Equation Confluence", desc: "18-indicator alignment engine scanning global liquidity for high-conviction institutional setups." }
           ].map((f, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="glass-card p-12 rounded-[3rem] border border-white/5 hover:border-[#00e67620] group relative overflow-hidden flex flex-col items-center text-center"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity" />
                <div className="p-5 bg-white/5 border border-white/10 rounded-3xl w-fit mb-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                   {f.icon}
                </div>
                <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">{f.title}</h3>
                <p className="text-lg text-[#8899a6] font-bold leading-relaxed">{f.desc}</p>
             </motion.div>
           ))}
        </div>
      </main>

      {/* SYSTEM STATUS BAR */}
      <footer className="relative z-50 w-full bg-[#0b1120] border-t border-white/5 py-8 px-12 md:px-24 flex flex-col md:flex-row justify-between items-center gap-8">
         <div className="flex flex-wrap justify-center items-center gap-10 text-[10px] font-black text-[#5c6b7a] uppercase tracking-[0.4em]">
            <div className="flex items-center gap-3">
               <PulseDot color="green" /> <span className="text-[#00e676]">ENGINE_OPTIMAL</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-white/10 hidden md:block" />
            <span className="hidden md:block">UPTIME: 99.99%</span>
            <div className="h-1 w-1 rounded-full bg-white/10 hidden md:block" />
            <span className="hidden md:block">VERSION: 2.5_ELITE</span>
         </div>
         
         <div className="flex items-center gap-12 text-[10px] font-black text-[#5c6b7a] uppercase tracking-[0.3em]">
            <Link href="/about" className="hover:text-white transition-colors">Protocol API</Link>
            <Link href="/signals" className="hover:text-white transition-colors">Alpha Feed</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors text-white">Console</Link>
         </div>
      </footer>
    </div>
  )
}
