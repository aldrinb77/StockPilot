import Link from "next/link"
import { ArrowRight, BarChart2, ShieldCheck, Zap, Star, PieChart, BookOpen, ChevronRight, Search } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-[#131722] text-foreground min-h-screen flex flex-col relative overflow-hidden selection:bg-tvGreen selection:text-white">
      {/* Dynamic Background Noise */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-tvGreen/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Simple Header */}
      <header className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-xl font-bold flex items-center space-x-2 text-white">
          <span>📈</span>
          <span className="tracking-tight text-xl">StockPilot</span>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
          Log In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-24 w-full relative z-10">
        <div className="max-w-4xl max-md:text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-tvGreen/10 text-tvGreen text-xs font-bold tracking-wider uppercase mb-6 border border-tvGreen/20">
            <span className="w-2 h-2 rounded-full bg-tvGreen animate-pulse mr-2" />
            100% Free Forever
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.1] mb-6 shadow-sm">
            Free Stock Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-tvGreen to-emerald-400">Signals.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-medium">
            Get exact Buy, Sell, and Hold signals with explicit entry prices, tiered targets, and trailing stop-losses. 
            <br className="hidden md:block" />
            <strong className="text-white mt-2 block">Completely free, mathematical rule-based limits. No AI, No BS.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-tvGreen hover:bg-tvGreen/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-tvGreen/20 flex items-center justify-center group text-lg"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/about"
              className="w-full sm:w-auto px-8 py-4 bg-[#1E222D] hover:bg-gray-800 border border-gray-700 text-white font-bold rounded-lg transition-all flex items-center justify-center text-lg"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Floating App Preview mockup */}
        <div className="mt-20 md:mt-24 relative mx-auto border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl bg-[#1E222D]">
          <div className="h-8 bg-[#131722] border-b border-gray-800 flex items-center px-4 space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-700" />
            <div className="w-3 h-3 rounded-full bg-gray-700" />
            <div className="w-3 h-3 rounded-full bg-gray-700" />
          </div>
          <div className="h-[400px] bg-gradient-to-t from-[#131722] to-[#1E222D] p-8 flex items-center justify-center opacity-70">
            <BarChart2 className="w-32 h-32 text-tvGreen opacity-20" />
            <div className="absolute font-mono text-gray-500 text-sm">LOADING COMPONENT_PREVIEW...</div>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="bg-[#1E222D] border-t border-b border-gray-800/50 py-24 px-6 relative z-10 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Follow a precise mathematical protocol completely isolating your behavioral bias.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[#131722] rounded-xl border border-gray-800">
              <div className="w-16 h-16 rounded-2xl bg-blue-900/30 text-blue-500 font-bold flex items-center justify-center mx-auto mb-6 text-2xl border border-blue-500/20">1</div>
              <h3 className="text-xl font-bold text-white mb-2">Pick a Stock</h3>
              <p className="text-gray-400">Search the exact ticker generating noise or let the Screener parse the top active setups instantly.</p>
            </div>
            <div className="text-center p-6 bg-[#131722] rounded-xl border border-gray-800">
              <div className="w-16 h-16 rounded-2xl bg-tvGreen/20 text-tvGreen font-bold flex items-center justify-center mx-auto mb-6 text-2xl border border-tvGreen/30">2</div>
              <h3 className="text-xl font-bold text-white mb-2">See the Signal</h3>
              <p className="text-gray-400">Wait patiently for our indicators to overlap confirming a Strong Buy or Sell condition automatically.</p>
            </div>
            <div className="text-center p-6 bg-[#131722] rounded-xl border border-gray-800">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 text-yellow-500 font-bold flex items-center justify-center mx-auto mb-6 text-2xl border border-yellow-500/30">3</div>
              <h3 className="text-xl font-bold text-white mb-2">Follow the Plan</h3>
              <p className="text-gray-400">Secure entry zones correctly. Respect trailing stops mechanically. Claim your precise targets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Comprehensive Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Zap />} color="text-yellow-500" bg="bg-yellow-500/10" border="border-yellow-500/20"
            title="Spoon-fed Signals" 
            desc="Exacting calculations generating transparent logic rendering rigid Stop-Loss arrays." 
          />
          <FeatureCard 
            icon={<BarChart2 />} color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/20"
            title="TradingView Charts" 
            desc="Interactive robust charting mounting EMA, BB, SMA natively via Lightweight framework." 
          />
          <FeatureCard 
            icon={<Search />} color="text-purple-500" bg="bg-purple-500/10" border="border-purple-500/20"
            title="Stock Screener" 
            desc="Parse massive universal conditions slicing specifically to explicit bounds seamlessly." 
          />
          <FeatureCard 
            icon={<Star />} color="text-tvGreen" bg="bg-tvGreen/10" border="border-tvGreen/20"
            title="Watchlist Tracking" 
            desc="Pin local data configuring custom alerts natively bounding state arrays." 
          />
          <FeatureCard 
            icon={<PieChart />} color="text-orange-500" bg="bg-orange-500/10" border="border-orange-500/20"
            title="Portfolio Tracker" 
            desc="Generate mock positions or trace accurate trailing absolute balances explicitly." 
          />
          <FeatureCard 
            icon={<BookOpen />} color="text-red-400" bg="bg-red-400/10" border="border-red-400/20"
            title="Beginner Academy" 
            desc="10 distinct curricular modules explicitly dismantling financial jargon immediately." 
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f121b] border-t border-gray-800 py-12 px-6 w-full text-center md:text-left z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="text-xl font-bold flex items-center space-x-2 text-white justify-center md:justify-start">
              <span>📈</span>
              <span className="tracking-tight">StockPilot</span>
            </div>
            <p className="text-gray-500 text-sm mt-2 max-w-sm">Algorithmic technical extraction engine tracking arrays strictly mathematically.</p>
          </div>
          <div className="text-xs text-gray-600 max-w-2xl">
            <strong className="text-gray-500 block mb-1">DISCLAIMER:</strong>
            The data rendered natively here calculates explicitly via algorithms against historical bounds and absolutely does not constitute explicit financial advice. We operate via Yahoo Finance Proxies. All targets/SLs are structurally mathematical. Use at your strict localized discretion. 
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc, color, bg, border }: { icon: React.ReactNode, title: string, desc: string, color: string, bg: string, border: string }) {
  return (
    <div className="bg-[#1E222D] border border-gray-700/50 p-6 rounded-xl hover:-translate-y-1 transition-transform group">
      <div className={`w-12 h-12 rounded-lg ${bg} ${border} border flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}
