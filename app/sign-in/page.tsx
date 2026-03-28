"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Terminal, Shield, Lock, ArrowRight, Zap, Fingerprint, Activity } from "lucide-react"
import Link from "next/link"
import { FadeIn } from "@/components/ui/FadeIn"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-[#060a13] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tvGreen blur-[200px] opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-tvBlue blur-[200px] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-card p-12 rounded-[4rem] border border-white/5 relative z-10 shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tvGreen to-tvBlue" />
        
        <div className="text-center mb-16">
           <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-xl group">
              <Fingerprint className="w-10 h-10 text-tvGreen group-hover:scale-110 transition-transform" />
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Terminal Access</h1>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Biometric Verification Required v2.5</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
           <div className="space-y-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Identity Signature (Email)
                 </label>
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-tvGreen transition-all placeholder:text-white/5"
                   placeholder="operator@stoxpilot.io"
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" /> Encryption Key (Password)
                 </label>
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-tvBlue transition-all placeholder:text-white/5"
                   placeholder="••••••••••••"
                 />
              </div>
           </div>

           <button className="w-full py-5 bg-gradient-to-r from-tvGreen to-tvBlue text-white font-black rounded-3xl shadow-2xl shadow-tvGreen/20 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              Initialize Secure Handshake <ArrowRight className="w-4 h-4" />
           </button>
        </form>

        <div className="mt-16 pt-10 border-t border-white/5 text-center space-y-4">
           <div className="flex items-center justify-center gap-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
              <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-tvGreen" /> 2FA_ACTIVE</span>
              <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-tvGreen" /> SSL_ENCRYPTED</span>
           </div>
           <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest leading-relaxed">
              Caution: Unauthorized access attempts are logged and reported to the institutional redundancy server.
           </p>
        </div>
      </motion.div>
      
      {/* Background Micro-effects */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-2 opacity-20 pointer-events-none">
         <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3 text-tvGreen" /> System Latency: 42ms
         </p>
         <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-3 h-3 text-tvBlue" /> AES-256 Enabled
         </p>
      </div>
    </div>
  )
}
