import { IndicatorVerdict, Signal } from "./types";

export function getFriendlyIndicatorDescription(name: string, verdict: IndicatorVerdict): string {
  const isBull = verdict.verdict === 'bullish';
  const isBear = verdict.verdict === 'bearish';

  switch (name) {
    case 'RSI':
      if (isBull) return "This stock looks cheap right now! 🏷️ (RSI is Oversold)";
      if (isBear) return "This stock looks expensive right now! 🥵 (RSI is Overbought)";
      return "Price is balanced, no extremes. ⚖️ (RSI is Neutral)";
      
    case 'MACD':
      if (isBull) return "Trend is turning positive! 📈 (MACD crossed bullish)";
      if (isBear) return "Trend is turning negative! 📉 (MACD crossed bearish)";
      return "Trend is flat or consolidating. ➡️ (MACD is Neutral)";
      
    case 'EMA':
    case 'SMA':
      if (isBull) return "Price found a safety net and is bouncing up! 🦘 (Above Moving Average)";
      if (isBear) return "Price fell through the floor! 💥 (Below Moving Average)";
      return "Price is chopping around the average. 〰️";

    case 'Bollinger Bands':
      if (isBull) return "Price hit the bottom band and might bounce! 🎾";
      if (isBear) return "Price hit the ceiling and might pull back! 🧊";
      return "Trading normally in the middle of the range. 🏄‍♂️";

    case 'Volume':
      if (isBull) return "Lots of buyers jumping in! 🌊 (High Volume)";
      if (isBear) return "Heavy selling pressure! 🧱 (High Volume Drop)";
      return "Normal trading activity. 🚶‍♂️";

    case 'ADX':
      if (isBull) return "Moving with very strong momentum! 💪 (ADX High)";
      return "Trend is weak or consolidating. 💤 (ADX Low)";

    case 'Supertrend':
      if (isBull) return "Overall trend is UP! 🟢";
      return "Overall trend is DOWN! 🔴";

    default:
      if (isBull) return "Looking positive! ☀️";
      if (isBear) return "Looking negative! ⛈️";
      return "Neutral outlook! ☁️";
  }
}

export function getFriendlySignalReason(signal: Signal): string {
  if (signal.type.includes('BUY')) {
    return "Our mathematical rules detect a strong setup where buyers are gaining control. Your risk-reward is favorable here.";
  }
  if (signal.type.includes('SELL')) {
    return "Indicators suggest this stock is losing momentum rapidly. It may be wise to take profits or avoid entering.";
  }
  return "The stock is moving sideways or sending mixed signals. Best to wait for a clearer opportunity.";
}
