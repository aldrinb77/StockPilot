import { BookHeart, Info, Cpu, Github, ExternalLink } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="space-y-8 animate-in fade-in pb-20 max-w-4xl mx-auto">
      <div className="text-center py-16 bg-gradient-to-b from-[#1E222D] to-[#131722] rounded-2xl border border-gray-700/50 mb-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-tvGreen/5 rounded-full blur-3xl" />
        <div className="w-20 h-20 bg-tvGreen/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-tvGreen/30 shadow-[0_0_30px_rgba(38,166,154,0.3)]">
          <BookHeart className="w-10 h-10 text-tvGreen" />
        </div>
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">About StoxPilot</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Democratizing explicit technical analysis via purely mathematical arrays. Completely transparent. 100% Free.</p>
      </div>

      <div className="bg-[#1E222D] p-8 rounded-xl border border-blue-900/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center"><Info className="w-6 h-6 mr-3 text-blue-500" /> 100% Rule-Based. ZERO AI.</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          This platform utilizes precise conditional mathematical formulas extracting explicit variants against historical time-series bounds (OHLCV). Every single output, target layer, and volatility mapped SL is generated strictly logically via classical technical indicators (RSI, CC1, EMA, Standard Deviations, Volumes, etc). <br/><br/>
          <strong>It does NOT use strictly trained AI, transformers, machine-learning arrays, stochastic predictive LLMs, or stochastic generative guesswork. What you see is pure math mapping historical flow arrays.</strong>
        </p>
      </div>

      <div className="bg-yellow-500/10 p-8 rounded-xl border border-yellow-500/30 relative overflow-hidden">
        <h2 className="text-xl font-bold text-yellow-500 mb-3 uppercase tracking-wider">⚠️ Critical Disclaimer</h2>
        <p className="text-yellow-600 font-medium leading-relaxed">
          This platform is strictly an educational algorithmic tool and is NOT intended as explicit financial advice. You are responsible entirely for monitoring risks individually. Always do your own thorough research. Past technical pattern behaviors strictly do not guarantee continuous future alignments. Trade confidently at your own extreme localized risk utilizing secure limits.
        </p>
      </div>

      <div className="bg-[#1E222D] p-8 rounded-xl border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><Cpu className="w-6 h-6 mr-3 text-gray-400" /> How Signals are Constructed</h2>
        <div className="space-y-4">
          <div className="bg-[#131722] p-4 rounded-lg flex items-start">
            <span className="text-tvGreen font-bold mr-3">01 //</span>
            <p className="text-sm text-gray-300">Fetches strictly aligned OHLCV strings spanning trailing boundaries securely avoiding payload limit arrays.</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-lg flex items-start">
            <span className="text-tvGreen font-bold mr-3">02 //</span>
            <p className="text-sm text-gray-300">Pipelines data identically traversing 12 distinct isolated indicator formulas via NPM explicitly (`technicalindicators` package).</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-lg flex items-start">
            <span className="text-tvGreen font-bold mr-3">03 //</span>
            <p className="text-sm text-gray-300">Evaluates arrays dynamically assigning exact `IndicatorVerdict` booleans validating intersections simultaneously traversing bounds conditions.</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-lg flex items-start">
            <span className="text-tvGreen font-bold mr-3">04 //</span>
            <p className="text-sm text-gray-300">Generates rigid conditional thresholds triggering explicit bounds assigning trailing 1:1 → 1:3 structural Targets recursively mapping SLs.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center"><Github className="w-5 h-5 mr-2" /> Open Source Tech Stack</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Next.js 14 (App Router Edge Logic)</li>
            <li>• TailwindCSS v3 (Style Parsing)</li>
            <li>• Zustand (LocalStorage Persistent Logic)</li>
            <li>• TradingView Lightweight-Charts</li>
            <li>• Technicalindicators NPM Core</li>
            <li>• Lucide-React / Framer Motion</li>
          </ul>
        </div>
        <div className="bg-[#1E222D] p-6 rounded-xl border border-gray-700/50 flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-bold text-white mb-2">Want to contact us?</h3>
          <p className="text-sm text-gray-400 mb-6">Have feedback or mapped incorrect variance loops?</p>
          <button className="px-6 py-2 bg-gray-800 hover:bg-white text-white hover:text-gray-900 rounded-lg font-bold transition-colors flex items-center">
            Send Feedback <ExternalLink className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

    </div>
  )
}
