export function getSignalLabel(type: string, isGodMode: boolean) {
  if (isGodMode) {
    if (type.includes('STRONG_BULLISH') || type.includes('STRONG_BUY')) return "STRONG BUY 🚀"
    if (type.includes('BULLISH') || type.includes('BUY')) return "BUY"
    if (type.includes('NEUTRAL') || type.includes('HOLD')) return "HOLD"
    if (type.includes('STRONG_BEARISH') || type.includes('STRONG_SELL')) return "STRONG SELL 🩸"
    if (type.includes('BEARISH') || type.includes('SELL')) return "SELL"
  } else {
    if (type.includes('STRONG_BULLISH')) return "STRONG BULLISH INDICATOR"
    if (type.includes('BULLISH')) return "BULLISH READING"
    if (type.includes('NEUTRAL')) return "NEUTRAL READING"
    if (type.includes('STRONG_BEARISH')) return "STRONG BEARISH INDICATOR"
    if (type.includes('BEARISH')) return "BEARISH READING"
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
      stopLoss: "🛡️ RISK LEVEL (ATR)",
      target: "📈 TECHNICAL LEVEL",
      entry: "📍 INDICATOR ZONE",
      advice: "EDUCATIONAL SUMMARY",
      badge: "EDUCATIONAL",
      disclaimer: "⚠️ Educational indicator reading only. Not financial advice. DYOR."
    }
  }
}

export function getFriendlySignalReasonWithMode(signal: any, reason: string | null, isGodMode: boolean) {
   if (isGodMode) return reason;
   
   return `${reason || 'Indicators triggered.'} (This is educational — always do your own research)`
}
