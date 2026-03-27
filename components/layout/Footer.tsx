import Link from "next/link"
import { TrendingUp, ShieldCheck, Zap, Activity } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-[#05080f] border-t border-white/5 pt-20 pb-12 px-8 lg:px-16 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tvGreen to-tvBlue opacity-20" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        
        <div className="flex flex-col space-y-6 max-w-md">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-10 h-10 bg-tvGreen/10 border border-tvGreen/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-tvGreen" />
            </div>
            <span className="text-2xl font-black tracking-tighter">StoxPilot</span>
          </div>
          <p className="text-sm text-gray-500 font-bold leading-relaxed">
            Your Private Trading Assistant. Institutional-grade technical intelligence engine tracking market behavior with surgical precision. 
          </p>
          <div className="flex items-center space-x-2">
             <div className="px-3 py-1.5 bg-tvGreen/10 border border-tvGreen/20 rounded-lg text-tvGreen text-[10px] font-black uppercase tracking-widest flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-2" /> SECURE PRIVATE TERMINAL
             </div>
             <div className="px-3 py-1.5 bg-tvBlue/10 border border-tvBlue/20 rounded-lg text-tvBlue text-[10px] font-black uppercase tracking-widest flex items-center">
                <Zap className="w-3.5 h-3.5 mr-2" /> 80% WIN RATE ENGINE
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-12 justify-start md:justify-end">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Navigation</h4>
              <div className="flex flex-col space-y-2 text-xs font-bold text-gray-600">
                 <Link href="/dashboard" className="hover:text-white transition-colors">Intelligence Dashboard</Link>
                 <Link href="/signals" className="hover:text-white transition-colors">Active Signals</Link>
                 <Link href="/watchlist" className="hover:text-white transition-colors">Your Watchlist</Link>
                 <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio Guard</Link>
              </div>
           </div>
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System</h4>
              <div className="flex flex-col space-y-2 text-xs font-bold text-gray-600">
                 <Link href="/settings" className="hover:text-white transition-colors">Terminal Config</Link>
                 <Link href="/journal" className="hover:text-white transition-colors">Trading Journal</Link>
                 <Link href="/about" className="hover:text-white transition-colors">Engine Protocol</Link>
              </div>
           </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-[10px] text-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-black uppercase tracking-[0.2em]">© {new Date().getFullYear()} STOXPILOT PRIVATE TERMINAL v2.0</p>
        <div className="flex items-center space-x-6 uppercase font-black tracking-widest">
           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-tvGreen" /> DATA: YAHOO_FINANCE_STREAM</span>
           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-tvGreen" /> ANALYTICS: OPTIMAL</span>
        </div>
      </div>
    </footer>
  )
}
