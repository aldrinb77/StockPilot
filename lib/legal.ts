export function getSignalLabel(type: string, isGodMode: boolean) {
  if (isGodMode) {
    if (type.includes('STRONG_BULLISH') || type.includes('STRONG_BUY')) return "STRONG BUY 🚀"
    if (type.includes('BULLISH') || type.includes('BUY')) return "BUY"
    if (type.includes('NEUTRAL') || type.includes('HOLD')) return "HOLD"
    if (type.includes('STRONG_BEARISH') || type.includes('STRONG_SELL')) return "STRONG SELL 🩸"
    if (type.includes('BEARISH') || type.includes('SELL')) return "SELL"
  } else {
    if (type.includes('STRONG_BULLISH')) return "STRONG BULLISH"
    if (type.includes('BULLISH')) return "BULLISH"
    if (type.includes('NEUTRAL')) return "NEUTRAL"
    if (type.includes('STRONG_BEARISH')) return "STRONG BEARISH"
    if (type.includes('BEARISH')) return "BEARISH"
  }
  return type
}

export function getLabel(isGodMode: boolean) {
  if (isGodMode) {
    return {
      stopLoss: "🛑 STOP LOSS",
      target: "🎯 TARGET PRICE",
      entry: "📍 ENTRY PRICE",
      advice: "RECOMMENDATION",
      badge: "RECOMMENDED",
      disclaimer: ""
    }
  } else {
    return {
      stopLoss: "🛡️ RISK LEVEL",
      target: "📈 TECHNICAL LEVEL",
      entry: "📍 INDICATOR ENTRY ZONE",
      advice: "EDUCATIONAL SUMMARY",
      badge: "EDUCATIONAL",
      disclaimer: "⚠️ Educational reading only. Not financial advice."
    }
  }
}

export function getFriendlySignalReasonWithMode(signal: any, reason: string | null, isGodMode: boolean) {
   if (isGodMode) return reason;
   
   return `${reason || 'Indicators triggered.'} (This is educational — always do your own research)`
}
