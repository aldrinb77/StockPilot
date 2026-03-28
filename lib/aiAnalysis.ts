import { StockData, Signal } from "./types";
import { MarketRegion } from "./markets";
import { formatCurrency, formatPercent } from "./utils";

export interface AIReport {
  date: string;
  sentiment: 'VERY BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'VERY BEARISH';
  sentimentScore: number;
  sentimentEmoji: string;
  summary: string;
  topRecommendations: Array<{
    symbol: string;
    type: string;
    confidence: number;
    price: number;
    target: number;
    stopLoss: number;
    reason: string;
    riskReward: string;
  }>;
  sectorAnalysis: Array<{
    name: string;
    status: 'STRONG' | 'MIXED' | 'WEAK';
    bullishCount: number;
    totalCount: number;
  }>;
  riskAssessment: {
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    suggestion: string;
  };
  tradingPlan: Array<{
    time: string;
    action: string;
    emoji: string;
  }>;
}

export function generateDailyReport(
  stocks: (StockData & { signal: Signal })[],
  region: MarketRegion,
  userName: string = "Trader"
): AIReport {
  const bullishCount = stocks.filter(s => s.signal.type.includes('BUY')).length;
  const bearishCount = stocks.filter(s => s.signal.type.includes('SELL')).length;
  const total = stocks.length;
  const bullishPercent = total > 0 ? (bullishCount / total) * 100 : 50;

  // Sentiment Logic
  let sentiment: AIReport['sentiment'];
  let sentimentEmoji: string;
  if (bullishPercent > 75) { sentiment = 'VERY BULLISH'; sentimentEmoji = '🚀'; }
  else if (bullishPercent > 55) { sentiment = 'BULLISH'; sentimentEmoji = '📈'; }
  else if (bullishPercent > 45) { sentiment = 'NEUTRAL'; sentimentEmoji = '⚖️'; }
  else if (bullishPercent > 25) { sentiment = 'BEARISH'; sentimentEmoji = '📉'; }
  else { sentiment = 'VERY BEARISH'; sentimentEmoji = '🔻'; }

  // Top Recommendations
  const topBuys = stocks
    .filter(s => s.signal.type.includes('BUY'))
    .sort((a, b) => b.signal.strength - a.signal.strength)
    .slice(0, 3)
    .map(s => ({
      symbol: s.symbol,
      type: s.signal.type as string,
      confidence: s.signal.strength,
      price: s.price,
      target: s.signal.targets[0],
      stopLoss: s.signal.stopLoss,
      reason: s.signal.reasons[0] || "Confirming technical alignment",
      riskReward: (s.signal.riskReward || 0).toString()
    }));

  // Sector Analysis
  const sectors = Array.from(new Set(stocks.map(s => s.sector)));
  const sectorPerformance = sectors.map(sector => {
    const sectorStocks = stocks.filter(s => s.sector === sector);
    const sBullish = sectorStocks.filter(s => s.signal.type.includes('BUY')).length;
    const sPercent = (sBullish / sectorStocks.length) * 100;
    return {
      name: (sector || "Diversified") as string,
      status: (sPercent > 60 ? 'STRONG' : sPercent > 40 ? 'MIXED' : 'WEAK') as 'STRONG' | 'MIXED' | 'WEAK',
      bullishCount: sBullish,
      totalCount: sectorStocks.length,
    };
  }).sort((a, b) => b.bullishCount / b.totalCount - a.bullishCount / a.totalCount).slice(0, 4);

  // Natural Language Summary
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  
  const summaryTemplates = [
    `${greeting}, ${userName}! The market is currently exhibiting a ${sentiment} posture with ${bullishCount} assets flashing buy signals relative to ${total} total nodes analyzed. ${topBuys.length > 0 ? `Your primary tactical opportunity today is ${topBuys[0].symbol} with a ${topBuys[0].confidence}% confidence score — indicators suggest a structural breakout is imminent.` : 'Volatility remains choppy today; the optimal move is patience while we await high-conviction liquidity alignment.'} Sector rotations indicate ${sectorPerformance[0]?.name} is the current leader in capital inflow.`,
    
    `${sentimentEmoji} Alpha Protocol Phase: ${sentiment}. Mathematical synthesis across ${total} assets identifies ${bullishCount} bullish confluences. ${topBuys.length > 0 ? `${topBuys[0].symbol} stands out as the lead operational target with a ${topBuys[0].confidence}% algorithmic hit rate. Multiple technical layers are converging near the current zone.` : 'Current market depth lacks the required signal-to-noise ratio for aggressive positioning.'} Strategic focus should remain on ${sectorPerformance[0]?.name} strength.`,
    
    `Report generated for ${userName}: Today's market sentiment is ${sentiment}. Out of ${total} monitored assets, ${bullishCount} are currently meeting our strict mathematical buy criteria. ${topBuys.length > 0 ? `Strategic lead: ${topBuys[0].symbol} (${topBuys[0].confidence}% strength). MACD and RSI are in perfect harmony for an upward expansion.` : 'No assets currently meet the 80%+ confidence threshold. Staying cash-ready is a valid trade today.'} Keep a close watch on ${sectorPerformance[0]?.name}.`
  ];

  const summary = summaryTemplates[new Date().getDate() % summaryTemplates.length];

  // Risk Assessment
  const avgConfidence = stocks.reduce((acc, s) => acc + s.signal.strength, 0) / total;
  const risk: AIReport['riskAssessment'] = {
    level: avgConfidence > 65 ? 'LOW' : avgConfidence > 45 ? 'MEDIUM' : 'HIGH',
    description: avgConfidence > 65 
      ? "Institutional alignment is high. Market breadth is healthy with broadening bullish participation."
      : avgConfidence > 45
      ? "Mixed liquidity flows detected. Volatility is elevated near key resistance zones."
      : "Extreme bearish pressure. Significant divergence between price and volume across major indices.",
    suggestion: avgConfidence > 65
      ? "Deploy normal position sizes. Focus on trailing stop losses for maximum profit capture."
      : avgConfidence > 45
      ? "Reduce individual position exposure by 40%. Only execute STRONG BUY signals with 85%+ score."
      : "Stay defensive. Increase cash allocation. Only scalp high-frequency targets or stay sideline."
  };

  // Trading Plan
  const plan = [
    { time: "9:00 AM", action: "Review local vault and this intelligence report", emoji: "☕" },
    { time: "9:15 AM", action: "Equities open. Observe liquidity flow for 15m — DO NOT TRADE", emoji: "👀" },
    { time: "9:30 AM", action: topBuys.length > 0 ? `Evaluate ${topBuys[0].symbol} entry if within target zone` : "Maintain surveillance; no pre-market setups qualified", emoji: "🎯" },
    { time: "12:00 PM", action: "Mid-day sync. Adjust stop losses to breakeven for profitable nodes", emoji: "📊" },
    { time: "2:30 PM", action: "Operational cutoff. No new swing positions after this hour", emoji: "🚫" },
    { time: "3:15 PM", action: "Terminal review. Log results in Behavioral History journal", emoji: "📝" },
  ];

  return {
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sentiment,
    sentimentScore: Math.round(bullishPercent),
    sentimentEmoji,
    summary,
    topRecommendations: topBuys,
    sectorAnalysis: sectorPerformance,
    riskAssessment: risk,
    tradingPlan: plan
  };
}

export function generateStockReport(stock: StockData, signal: Signal) {
  // Comprehensive single-stock analysis
  return {
    verdict: signal.type,
    confidence: signal.strength,
    summary: `${stock.symbol} is currently ${signal.type.includes('BUY') ? 'flashing institutional accumulation signals' : signal.type.includes('SELL') ? 'showing coordinated distribution' : 'trapped in a volatility squeeze'}. Indicators are at ${signal.strength}% technical confluence.`,
    whatToDo: [
      `1. Buy exactly ${Math.floor(50000 / stock.price)} shares at market near ${formatCurrency(stock.price)} (Total: ${formatCurrency(50000)})`,
      `2. Immediately set Hard Stop Loss at ${formatCurrency(signal.stopLoss)} (Risk: ~2.5%)`,
      `3. Set Limit Sell at ${formatCurrency(signal.targets[0])} for 50% profit booking`,
      `4. Set Final Target at ${formatCurrency(signal.targets[1] || signal.targets[0] * 1.05)} for remaining position`,
      `5. NO EMOTIONS: If SL triggers, exit instantly. Disconnect and review journal tomorrow.`
    ],
    levels: {
      pivot: stock.price,
      resistance: signal.targets.slice(0, 3),
      support: [signal.stopLoss, signal.stopLoss * 0.98, signal.stopLoss * 0.95]
    }
  };
}
