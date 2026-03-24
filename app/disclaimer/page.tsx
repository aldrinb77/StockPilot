export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 mb-20 animate-in fade-in space-y-8 bg-[#131722]/80 border border-gray-800 rounded-xl mt-8">
      <h1 className="text-3xl font-bold font-heading text-white border-b border-gray-800 pb-4">Full Disclaimer</h1>
      
      <div className="prose prose-invert prose-gray max-w-none text-gray-300">
        <p className="text-tvRed font-bold uppercase tracking-widest text-sm">PLEASE READ THIS DISCLAIMER CAREFULLY BEFORE USING STOXPILOT.</p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Educational Tool Only</h2>
        <p>StoxPilot is <strong>NOT</strong> a registered investment advisor, broker-dealer, or financial institution. The platform is designed solely to visualize mathematical technical indicators.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">No Financial Advice</h2>
        <p>Nothing on this website constitutes financial, legal, or investment advice. The indicators, terms (such as &quot;Bullish&quot; or &quot;Bearish&quot;), target levels, and stop-loss calculations are algorithmic, historical mapping examples. They are not tailored to your specific financial situation.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">High Risk of Trading</h2>
        <p>Trading equities involves a SUBSTANTIAL RISK OF LOSS. You can lose some or all of your initial investment. You should carefully consider your financial condition and consult with a licensed financial advisor before trading.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">Data Accuracy</h2>
        <p>While we pull data from reputable APIs, we cannot guarantee completely real-time accuracy and eliminate latency risks. You must always confirm stock prices via your official brokerage prior to ordering.</p>
      </div>
    </div>
  )
}
