import * as React from "react"
import { MiniChart } from "@/components/charts/MiniChart"
import { formatCurrency, formatPercent } from "@/lib/utils"

interface IndexData {
  name: string
  price: number
  change: number
  changePercent: number
  history: number[]
}

const INDICES: IndexData[] = [
  { name: "S&P 500", price: 5123.69, change: 12.50, changePercent: 0.24, history: Array.from({length: 30}, () => 5100 + Math.random() * 50) },
  { name: "NASDAQ", price: 16254.30, change: -45.20, changePercent: -0.28, history: Array.from({length: 30}, () => 16200 + Math.random() * 150 - 75) },
  { name: "DOW", price: 38920.45, change: 154.10, changePercent: 0.40, history: Array.from({length: 30}, () => 38800 + Math.random() * 200) },
  { name: "Russell 2000", price: 2050.15, change: 25.40, changePercent: 1.25, history: Array.from({length: 30}, () => 2000 + Math.random() * 60) },
]

export function MarketOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {INDICES.map((index, i) => {
        const isUp = index.change >= 0
        return (
          <div key={i} className={`bg-[#1E222D] border ${isUp ? 'border-tvGreen/30' : 'border-tvRed/30'} rounded-lg p-4 flex justify-between items-center shadow-sm`}>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{index.name}</p>
              <h3 className="text-xl font-bold text-white mt-1">{formatNumber(index.price)}</h3>
              <p className={`text-sm font-medium mt-1 inline-flex items-center px-1.5 py-0.5 rounded-sm ${isUp ? 'bg-tvGreen/10 text-tvGreen' : 'bg-tvRed/10 text-tvRed'}`}>
                {isUp ? '+' : ''}{index.change.toFixed(2)} ({isUp ? '+' : ''}{index.changePercent.toFixed(2)}%)
              </p>
            </div>
            <div className="opacity-80">
              <MiniChart data={index.history.sort((a,b) => a-b)} isPositive={isUp} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}
