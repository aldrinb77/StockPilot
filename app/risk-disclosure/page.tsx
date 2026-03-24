export default function RiskDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 mb-20 animate-in fade-in space-y-8 bg-[#131722]/80 border border-gray-800 rounded-xl mt-8">
      <h1 className="text-3xl font-bold font-heading text-white border-b border-gray-800 pb-4">Risk Disclosure</h1>
      
      <div className="prose prose-invert prose-gray max-w-none text-gray-300">
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Trading Carries Massive Risks</h2>
        <p>Trading financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage that is often obtainable in equity trading can work against you as well as for you.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">Market Volatility</h2>
        <p>Markets are subject to unpredictable shifts in sentiment, global macroeconomic impacts, and fundamental corporate changes. Technical analysis <strong>inherently trails</strong> price action. Moving averages, MACD crossovers, and RSI levels do not possess clairvoyant properties.</p>
        <p>StoxPilot uses technical analysis as a visualization exercise. Relying exclusively on signals without fundamental awareness will likely result in financial loss.</p>
      </div>
    </div>
  )
}
