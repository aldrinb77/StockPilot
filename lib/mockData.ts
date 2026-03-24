import { StockData, Signal, OHLCV } from './types';

export const MOCK_STOCKS: StockData[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 173.50, change: 2.30, changePercent: 1.34, volume: 55000000, high: 174.00, low: 170.50, open: 171.00, prevClose: 171.20, marketCap: 2800000000000, pe: 28.5, eps: 6.05, week52High: 198.23, week52Low: 164.08 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 416.42, change: 5.20, changePercent: 1.26, volume: 22000000, high: 418.00, low: 412.50, open: 413.00, prevClose: 411.22, marketCap: 3100000000000, pe: 38.2, eps: 10.90, week52High: 420.82, week52Low: 275.37 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', price: 875.28, change: 18.50, changePercent: 2.16, volume: 45000000, high: 880.00, low: 860.00, open: 865.00, prevClose: 856.78, marketCap: 2200000000000, pe: 75.4, eps: 11.60, week52High: 974.00, week52Low: 262.20 },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical', price: 175.22, change: -4.30, changePercent: -2.39, volume: 110000000, high: 180.00, low: 174.50, open: 179.00, prevClose: 179.52, marketCap: 550000000000, pe: 42.1, eps: 4.16, week52High: 299.29, week52Low: 152.37 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication', price: 495.30, change: 6.80, changePercent: 1.39, volume: 15000000, high: 498.00, low: 488.50, open: 489.00, prevClose: 488.50, marketCap: 1250000000000, pe: 32.5, eps: 15.24, week52High: 504.00, week52Low: 207.13 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', price: 178.15, change: 1.20, changePercent: 0.68, volume: 42000000, high: 179.00, low: 176.50, open: 177.00, prevClose: 176.95, marketCap: 1850000000000, pe: 65.2, eps: 2.73, week52High: 181.42, week52Low: 101.15 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 147.68, change: 2.10, changePercent: 1.44, volume: 28000000, high: 148.50, low: 145.00, open: 145.50, prevClose: 145.58, marketCap: 1830000000000, pe: 25.4, eps: 5.81, week52High: 153.78, week52Low: 102.63 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Finance', price: 198.45, change: 0.85, changePercent: 0.43, volume: 8500000, high: 199.00, low: 197.50, open: 198.00, prevClose: 197.60, marketCap: 570000000000, pe: 11.5, eps: 17.25, week52High: 200.30, week52Low: 127.35 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 156.24, change: -1.05, changePercent: -0.67, volume: 6200000, high: 158.00, low: 155.50, open: 157.00, prevClose: 157.29, marketCap: 375000000000, pe: 12.8, eps: 12.20, week52High: 175.97, week52Low: 144.95 },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Finance', price: 280.12, change: 1.40, changePercent: 0.50, volume: 5100000, high: 281.50, low: 279.00, open: 279.50, prevClose: 278.72, marketCap: 580000000000, pe: 31.8, eps: 8.80, week52High: 290.96, week52Low: 217.65 },
  // ... adding enough for a good MVP list
];

export const MOCK_SIGNALS: Record<string, Signal> = {
  'AAPL': {
    type: 'BULLISH', strength: 75,
    entry: { min: 172.50, max: 174.50 }, targets: [178.00, 185.00, 195.00],
    stopLoss: 168.00, riskReward: 2.5,
    reasons: ['RSI at 35 — Oversold, bounce likely', 'MACD bullish crossover', 'Price above 50-EMA'],
    indicators: [
      { name: 'RSI', value: '35', verdict: 'bullish', description: 'Oversold bounce' },
      { name: 'MACD', value: 'Bullish Cross', verdict: 'bullish', description: 'Crossover' },
      { name: 'EMA', value: 'Above 50', verdict: 'bullish', description: 'Uptrend' }
    ],
    timeframe: 'Swing Trade (2-5 days)'
  },
  'NVDA': {
    type: 'STRONG_BULLISH', strength: 90,
    entry: { min: 870.00, max: 880.00 }, targets: [920.00, 950.00, 1000.00],
    stopLoss: 840.00, riskReward: 3.2,
    reasons: ['Supertrend is bullish', 'High volume confirms trend', 'MACD bullish crossover'],
    indicators: [
      { name: 'Supertrend', value: 'Up', verdict: 'bullish', description: 'Bullish' },
      { name: 'Volume', value: 'High', verdict: 'bullish', description: 'Confirms trend' },
      { name: 'MACD', value: 'Bullish Cross', verdict: 'bullish', description: 'Crossover' }
    ],
    timeframe: 'Swing Trade (1-2 weeks)'
  },
  'TSLA': {
    type: 'STRONG_BEARISH', strength: 85,
    entry: { min: 174.00, max: 176.00 }, targets: [160.00, 150.00, 140.00],
    stopLoss: 185.00, riskReward: 2.8,
    reasons: ['Price below 50 & 200 EMA — Downtrend', 'RSI at 65 — Overbought pullback', 'MACD bearish crossover'],
    indicators: [
      { name: 'EMA', value: 'Below 50 & 200', verdict: 'bearish', description: 'Downtrend' },
      { name: 'RSI', value: '65', verdict: 'bearish', description: 'Overbought' },
      { name: 'MACD', value: 'Bearish Cross', verdict: 'bearish', description: 'Crossover' }
    ],
    timeframe: 'Swing Trade (2-5 days)'
  },
  'MSFT': {
    type: 'BULLISH', strength: 65,
    entry: { min: 415.00, max: 418.00 }, targets: [425.00, 435.00, 450.00],
    stopLoss: 405.00, riskReward: 2.2,
    reasons: ['Price at lower Bollinger Band — Oversold', 'ADX strong trend'],
    indicators: [
      { name: 'Bollinger Bands', value: 'At Lower Band', verdict: 'bullish', description: 'Oversold bounce' },
      { name: 'ADX', value: '28.5', verdict: 'bullish', description: 'Strong trend' }
    ],
    timeframe: 'Swing Trade (2-5 days)'
  },
  'JNJ': {
    type: 'BEARISH', strength: 70,
    entry: { min: 155.00, max: 157.00 }, targets: [150.00, 145.00, 140.00],
    stopLoss: 160.00, riskReward: 2.0,
    reasons: ['SAR above price — Downtrend', 'Supertrend is bearish'],
    indicators: [
      { name: 'PSAR', value: '159.20', verdict: 'bearish', description: 'Downtrend' },
      { name: 'Supertrend', value: 'Down', verdict: 'bearish', description: 'Bearish' }
    ],
    timeframe: 'Swing Trade (2-5 days)'
  },
  'META': {
    type: 'NEUTRAL', strength: 40,
    entry: { min: 490.00, max: 498.00 }, targets: [510.00],
    stopLoss: 480.00, riskReward: 1.0,
    reasons: ['RSI is neutral', 'MACD is neutral', 'Low volume weakens signal'],
    indicators: [
      { name: 'RSI', value: '55', verdict: 'neutral', description: 'Neutral' },
      { name: 'MACD', value: 'Neutral', verdict: 'neutral', description: 'Neutral' },
      { name: 'Volume', value: 'Low', verdict: 'neutral', description: 'Weakens signal' }
    ],
    timeframe: 'Swing Trade (2-5 days)'
  }
};

export function getMockHistoricalData(startPrice: number = 150): OHLCV[] {
  const data: OHLCV[] = [];
  let currentPrice = startPrice;
  const now = Date.now() / 1000;
  
  for (let i = 200; i >= 0; i--) {
    const time = now - (i * 86400); // 1 day intervals
    const volatility = currentPrice * 0.02;
    const change = (Math.random() - 0.48) * volatility; // slight upward bias
    
    currentPrice = currentPrice + change;
    const open = currentPrice - (change * 0.2);
    const close = currentPrice;
    const high = Math.max(open, close) + (Math.random() * volatility * 0.5);
    const low = Math.min(open, close) - (Math.random() * volatility * 0.5);
    const volume = 1000000 + Math.random() * 5000000;
    
    data.push({ time, open, high, low, close, volume });
  }
  
  return data;
}
