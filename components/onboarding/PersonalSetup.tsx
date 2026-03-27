"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, User, Globe, Zap, Shield, ArrowRight } from 'lucide-react'
import { useStore } from '@/store/store'

export function PersonalSetup({ onComplete }: { onComplete: () => void }) {
  const { setSelectedMarket } = useStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    userName: '',
    preferredMarket: 'IN',
    tradingStyle: 'swing',
    riskTolerance: 'moderate'
  })

  const markets = [
    { id: 'IN', name: 'India', flag: '🇮🇳' },
    { id: 'US', name: 'USA', flag: '🇺🇸' },
    { id: 'EU', name: 'Europe', flag: '🇪🇺' },
    { id: 'UK', name: 'UK', flag: '🇬🇧' },
    { id: 'JP', name: 'Japan', flag: '🇯🇵' },
    { id: 'AU', name: 'Australia', flag: '🇦🇺' },
    { id: 'CA', name: 'Canada', flag: '🇨🇦' },
  ]

  const styles = [
    { id: 'day', name: 'Day Trading', desc: 'Minutes to hours', icon: <Zap className="w-4 h-4" /> },
    { id: 'swing', name: 'Swing Trading', desc: 'Days to weeks', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'long', name: 'Long-term', desc: 'Months to years', icon: <Shield className="w-4 h-4" /> },
  ]

  const finish = () => {
    const profile = {
      ...formData,
      setupComplete: true,
      setupDate: Date.now()
    }
    localStorage.setItem('stoxpilot_user', JSON.stringify(profile))
    setSelectedMarket(formData.preferredMarket as any)
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0e17] p-4">
      <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-lg w-full p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tvGreen to-tvBlue" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-tvGreen/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-tvGreen/20">
            <TrendingUp className="w-8 h-8 text-tvGreen" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome to StoxPilot 📈</h2>
          <p className="text-gray-400 mt-2 font-medium">Your Personal Trading Assistant</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                  <User className="w-3 h-3 mr-2" /> What should I call you?
                </label>
                <input 
                  type="text" 
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  placeholder="Enter your name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:border-tvGreen active:scale-[0.99] transition-all"
                />
              </div>
              <button 
                disabled={!formData.userName}
                onClick={() => setStep(2)}
                className="w-full premium-button py-4 text-lg group disabled:opacity-50"
              >
                Continue <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center">
                  <Globe className="w-3 h-3 mr-2" /> Your preferred market
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {markets.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setFormData({...formData, preferredMarket: m.id})}
                      className={`p-4 rounded-xl border text-center transition-all ${formData.preferredMarket === m.id ? 'bg-tvGreen/10 border-tvGreen text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                    >
                      <span className="text-2xl block mb-1">{m.flag}</span>
                      <span className="text-xs font-bold">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(1)} className="w-1/3 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl">Back</button>
                <button onClick={() => setStep(3)} className="w-2/3 premium-button py-4">Next Step</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
            >
                <div>
                   <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Trading Style & Risk</label>
                   <div className="space-y-3">
                      {styles.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setFormData({...formData, tradingStyle: s.id})}
                          className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${formData.tradingStyle === s.id ? 'bg-tvBlue/10 border-tvBlue text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                        >
                          <div className={`p-2 rounded-lg ${formData.tradingStyle === s.id ? 'bg-tvBlue/20 text-tvBlue' : 'bg-white/5 text-gray-500'}`}>
                            {s.icon}
                          </div>
                          <div>
                            <p className="font-bold">{s.name}</p>
                            <p className="text-[10px] opacity-60">{s.desc}</p>
                          </div>
                        </button>
                      ))}
                   </div>
                </div>
                
                <div className="pt-4 grid grid-cols-3 gap-3">
                   {['conservative', 'moderate', 'aggressive'].map(r => (
                     <button
                        key={r}
                        onClick={() => setFormData({...formData, riskTolerance: r})}
                        className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.riskTolerance === r ? 'bg-tvAmber/10 border-tvAmber text-tvAmber' : 'bg-white/5 border-white/10 text-gray-500'}`}
                     >
                       {r}
                     </button>
                   ))}
                </div>

                <div className="flex gap-4 pt-4">
                    <button onClick={() => setStep(2)} className="w-1/3 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl">Back</button>
                    <button onClick={finish} className="flex-1 w-2/3 px-10 py-4 bg-tvGreen text-white font-black rounded-xl shadow-2xl shadow-tvGreen/20 active:scale-95 transition-all">Let&apos;s Go! 🚀</button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
