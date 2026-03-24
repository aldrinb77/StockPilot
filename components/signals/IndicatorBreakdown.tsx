import * as React from "react"
import { IndicatorVerdict } from "@/lib/types"

export function IndicatorBreakdown({ indicators }: { indicators: IndicatorVerdict[] }) {
  return (
    <div className="space-y-2 mt-4 text-sm bg-[#131722] p-4 rounded-lg border border-gray-700/50">
      <h4 className="text-gray-400 font-semibold mb-3 text-xs uppercase tracking-wider">Indicator Breakdown</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        {indicators.map((ind, idx) => {
          let dot = '🟡';
          let color = 'text-yellow-500';
          if (ind.verdict === 'bullish') { dot = '🟢'; color = 'text-tvGreen'; }
          else if (ind.verdict === 'bearish') { dot = '🔴'; color = 'text-tvRed'; }

          return (
            <div key={idx} className="flex items-center text-xs">
              <span className="w-24 text-gray-400 truncate">{ind.name}:</span>
              <span className="truncate text-foreground max-w-[80px] mr-2">{ind.value}</span>
              <span className="flex items-center ml-auto">
                <span className="mr-1.5">{dot}</span>
                <span className={`font-medium ${color} truncate max-w-[120px]`}>{ind.verdict.charAt(0).toUpperCase() + ind.verdict.slice(1)}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
