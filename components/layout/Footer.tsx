import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0e17] border-t border-gray-800/50 pt-12 pb-8 px-6 lg:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
        
        <div className="flex flex-col space-y-2 max-w-sm">
          <div className="flex items-center space-x-2 text-white opacity-90">
            <span className="text-xl">📈</span>
            <span className="text-xl font-black tracking-tighter">StoxPilot</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Free Stock Market Education Platform</p>
          <p className="text-xs text-tvAmber font-bold mt-2 bg-tvAmber/10 px-3 py-1.5 rounded w-fit border border-tvAmber/20">
            📚 Educational tool only. Not financial advice.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 md:gap-8 justify-start md:justify-end text-sm text-gray-500 font-medium">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/disclaimer" className="hover:text-white transition-colors">Full Disclaimer</Link>
          <Link href="/risk-disclosure" className="hover:text-white transition-colors">Risk Disclosure</Link>
          <Link href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800/30 text-xs text-gray-600 flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} StoxPilot. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built securely in local storage. Zero user-tracking.</p>
      </div>
    </footer>
  )
}
