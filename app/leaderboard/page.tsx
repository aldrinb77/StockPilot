"use client"

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"
import { Trophy, Medal, Star, Target, TrendingUp, Zap, Sparkles } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useStore } from "@/store/store"

const MOCK_LEADERBOARD = [
  { id: 1, name: "Alpha_Trxr", profit: 45600, winRate: 78, trades: 124, rank: 1, avatar: "A" },
  { id: 2, name: "QuantSentinel", profit: 32100, winRate: 65, trades: 89, rank: 2, avatar: "Q" },
  { id: 3, name: "Bullish_Node", profit: 28400, winRate: 72, trades: 156, rank: 3, avatar: "B" },
  { id: 4, name: "Satoshi_Dreams", profit: 21200, winRate: 58, trades: 67, rank: 4, avatar: "S" },
  { id: 5, name: "MarketMaker_X", profit: 18900, winRate: 61, trades: 210, rank: 5, avatar: "M" },
  { id: 6, name: "Logic_Loop", profit: 15400, winRate: 54, trades: 45, rank: 6, avatar: "L" },
]

export default function LeaderboardPage() {
  const { paperBalance, portfolio, selectedMarket } = useStore()
  
  // Calculate current user's performance
  let currentPortfolioValue = 0
  portfolio.forEach(p => { currentPortfolioValue += p.quantity * p.buyPrice })
  const totalUserProfit = (paperBalance + currentPortfolioValue) - 100000
  
  const topThree = MOCK_LEADERBOARD.slice(0, 3)
  const rest = MOCK_LEADERBOARD.slice(3)

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
             <div className="flex items-center space-x-2 text-tvPurple">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Performance Index</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
               <Trophy className="w-8 h-8 text-white/20" /> 
               Elite Rankings
             </h1>
             <p className="text-[#8899a6] font-bold text-lg max-w-2xl leading-tight uppercase tracking-tight">Institutional Paper Trading Variance</p>
          </div>
          <div className="glass-card px-8 py-4 rounded-2xl border border-tvPurple/20 flex items-center gap-6 shadow-2xl shadow-tvPurple/5">
             <div>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Your P&L Variance</p>
                <p className={`text-xl font-black font-mono tracking-tighter ${totalUserProfit >= 0 ? 'text-tvGreen' : 'text-tvRed'}`}>
                   {totalUserProfit >= 0 ? '+' : ''}{formatCurrency(totalUserProfit, selectedMarket)}
                </p>
             </div>
             <div className="w-px h-10 bg-white/5" />
             <div>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Calculated Rank</p>
                <p className="text-xl font-black text-white font-mono tracking-tighter">#43,291</p>
             </div>
          </div>
        </div>

        {/* Podium Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-8 pt-10 px-4">
           {/* Rank 2 */}
           <PodiumItem item={topThree[1]} color="text-slate-400" bgColor="bg-slate-400/10" height="h-64" delay={1} />
           {/* Rank 1 */}
           <PodiumItem item={topThree[0]} color="text-tvPurple shadow-[0_0_20px_#7c4dff40]" bgColor="bg-tvPurple/10 border-tvPurple/30" height="h-80" delay={0} isWinner />
           {/* Rank 3 */}
           <PodiumItem item={topThree[2]} color="text-amber-600" bgColor="bg-amber-600/10" height="h-52" delay={2} />
        </div>

        {/* Global List */}
        <div className="space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-tvPurple rounded-full shadow-[0_0_10px_#7c4dff]" />
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase font-mono">Global Operational Feed</h2>
           </div>

           <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="text-[10px] text-gray-500 uppercase font-black tracking-widest bg-white/[0.01] border-b border-white/5">
                       <tr>
                          <th className="px-10 py-6">Operator Node</th>
                          <th className="px-10 py-6 text-right">Net Variance</th>
                          <th className="px-10 py-6 text-right">Execution Ratio</th>
                          <th className="px-10 py-6 text-right">Total Ops</th>
                          <th className="px-10 py-6 text-center">Status</th>
                       </tr>
                    </thead>
                    <tbody>
                       {MOCK_LEADERBOARD.map((item, i) => (
                          <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                             <td className="px-10 py-6">
                                <div className="flex items-center gap-4">
                                   <span className="text-xs font-black text-[#5c6b7a] font-mono w-6">#{item.rank}</span>
                                   <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-white group-hover:scale-110 group-hover:border-tvPurple/30 transition-all">
                                      {item.avatar}
                                   </div>
                                   <div className="font-black text-white text-lg tracking-tighter">{item.name}</div>
                                </div>
                             </td>
                             <td className="px-10 py-6 text-right font-black text-tvGreen font-mono">
                                +{formatCurrency(item.profit, selectedMarket)}
                             </td>
                             <td className="px-10 py-6 text-right">
                                <div className="flex flex-col items-end gap-1.5">
                                   <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full bg-tvPurple" style={{ width: `${item.winRate}%` }} />
                                   </div>
                                   <span className="text-[9px] font-black text-gray-500 font-mono">{item.winRate}% ERA</span>
                                </div>
                             </td>
                             <td className="px-10 py-6 text-right font-black text-white font-mono">{item.trades}</td>
                             <td className="px-10 py-6 text-center">
                                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase text-gray-500 tracking-widest group-hover:text-tvPurple transition-colors italic">
                                   Verified
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      </div>
    </FadeIn>
  )
}

function PodiumItem({ item, color, bgColor, height, delay, isWinner }: any) {
  return (
    <StaggerItem className="flex flex-col items-center">
       {isWinner && (
          <div className="mb-4 animate-bounce">
             <Trophy className="w-10 h-10 text-tvPurple drop-shadow-[0_0_15px_rgba(124,77,255,0.8)]" />
          </div>
       )}
       <div className={`w-32 h-32 rounded-full ${bgColor} border-2 ${color.split(' ')[0].replace('text', 'border')} flex items-center justify-center mb-6 relative group cursor-pointer shadow-2xl`}>
          <span className="text-4xl font-black text-white">{item.avatar}</span>
          <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl ${bgColor} border-2 ${color.split(' ')[0].replace('text', 'border')} backdrop-blur-md flex items-center justify-center font-black text-xs text-white shadow-xl`}>
             {item.rank}
          </div>
       </div>
       <div className={`w-full ${height} ${bgColor} rounded-t-[3rem] border-x-2 border-t-2 ${color.split(' ')[0].replace('text', 'border')} flex flex-col items-center justify-center space-y-3 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
          <div className={`absolute top-0 left-0 w-full h-1 ${color.split(' ')[0].replace('text', 'bg')}`} />
          <h3 className="font-black text-white tracking-tighter text-center px-4 leading-none">{item.name}</h3>
          <p className={`text-xl font-black font-mono tracking-tighter ${color}`}>+{item.profit.toLocaleString()}</p>
          <div className="flex gap-2">
             <div className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[8px] font-black uppercase text-gray-500 tracking-widest leading-none">
                {item.winRate}% ERA
             </div>
          </div>
       </div>
    </StaggerItem>
  )
}
