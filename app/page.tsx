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
  ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"
import { FADE_IN } from "@/lib/animations"
import { useUserProfile } from "@/hooks/useUserProfile"

export default function Home() {
  const { userName, isSetupComplete } = useUserProfile()

  return (
    <div className="bg-[#05080f] text-foreground min-h-screen flex flex-col relative overflow-hidden selection:bg-tvGreen/30 selection:text-tvGreen">
      {/* Background Animated Elements */}
      <div className="absolute top-0 right-0 w-[70vw] h-[70vh] bg-tvGreen/5 rounded-full blur-[160px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vh] bg-tvBlue/5 rounded-full blur-[140px] pointer-events-none opacity-40" />
      
      <div className="absolute inset-0 bg-mesh-gradient opacity-10 pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mb-12 flex flex-col items-center cursor-pointer group"
        >
          <div className="w-24 h-24 bg-tvGreen/10 border border-tvGreen/20 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl shadow-tvGreen/10">
            <TrendingUp className="w-12 h-12 text-tvGreen" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mt-6 group-hover:text-tvGreen transition-colors">StoxPilot</h1>
          <div className="flex items-center space-x-2 mt-2">
             <div className="w-2 h-2 rounded-full bg-tvGreen animate-pulse" />
             <span className="text-[10px] font-black text-tvGreen uppercase tracking-[0.4em]">Private Assistant</span>
          </div>
        </motion.div>

        <div className="max-w-4xl w-full text-center space-y-12">
           <div className="space-y-6">
              <motion.h2 
                variants={FADE_IN}
                initial="hidden"
                animate="visible"
                className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight"
              >
                Your Markets, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-tvGreen via-emerald-400 to-tvBlue pr-2 underline decoration-white/10 underline-offset-8">Quantified.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed"
              >
                Institutional-grade technical intelligence engine. Zero bias, high-performance mathematical alignment tracking for professional traders.
              </motion.p>
           </div>

           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="flex flex-col items-center gap-8"
           >
              <Link 
                href="/dashboard"
                className="group relative px-12 py-6 bg-tvGreen text-white font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-tvGreen/20 flex items-center gap-4 text-xl"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                {isSetupComplete ? `Resume Terminal (${userName})` : 'Enter Private Terminal'}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <div className="flex flex-wrap justify-center gap-4">
                 {[
                   { icon: <ShieldCheck className="w-4 h-4" />, label: "LOCAL_VAULT_ACTIVE" },
                   { icon: <Cpu className="w-4 h-4" />, label: "ENGINE_V2_ONLINE" },
                   { icon: <Activity className="w-4 h-4" />, label: "YAHOO_REALTIME_O" }
                 ].map(tag => (
                   <div key={tag.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest backdrop-blur-md">
                      <div className="text-tvGreen">{tag.icon}</div>
                      {tag.label}
                   </div>
                 ))}
              </div>
           </motion.div>
        </div>

        {/* Feature Grid Mockup */}
        <div className="mt-32 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Direct Execution", desc: "No jargon. Just explicit BUY, SELL, and STOP LOSS levels with 80% accuracy scoring.", icon: <Zap className="text-tvAmber" /> },
             { title: "Zero Tracking", desc: "Your data never leaves this device. 100% private, locally encrypted trade journal and watchlist.", icon: <Lock className="text-tvBlue" /> },
             { title: "Quantum Logic", desc: "10-indicator alignment engine scanning for A+ premium setups across global exchanges.", icon: <Cpu className="text-tvPurple" /> }
           ].map((f, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="glass-card p-8 rounded-3xl border border-white/5 hover:border-white/10 group transition-all"
             >
                <div className="p-3 bg-white/5 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                   {f.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{f.desc}</p>
             </motion.div>
           ))}
        </div>
      </main>

      {/* Subtle Terminal Banner */}
      <div className="w-full bg-white/5 border-t border-white/5 py-4 px-10 flex justify-between items-center text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">
         <div className="flex items-center gap-4">
            <span className="text-tvGreen">● SYSTEM_OPTIMAL</span>
            <span className="hidden md:block">LATENCY: 12MS</span>
            <span className="hidden md:block">PROXY_ACTIVE: ALL_ORIGINS</span>
         </div>
         <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">Terminal</Link>
            <Link href="/signals" className="hover:text-white transition-colors hover:text-tvGreen">Signals</Link>
            <Link href="/about" className="hover:text-white transition-colors">Protocol</Link>
         </div>
      </div>
    </div>
  )
}
