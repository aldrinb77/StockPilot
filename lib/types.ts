export interface StockData {
  symbol: string;
  name?: string;
  sector?: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  marketCap?: number;
  pe?: number;
  eps?: number;
  week52High?: number;
  week52Low?: number;
}

export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorVerdict {
  name: string;
  value: string;
  verdict: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

export interface Signal {
  type: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
  strength: number; // 0-100
  entry: {
    min: number;
    max: number;
  };
  targets: number[];
  stopLoss: number;
  riskReward: number;
  reasons: string[];
  indicators: IndicatorVerdict[];
  timeframe: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: number;
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  buyDate: number;
}

export interface NotificationItem {
  id: string;
  message: string;
  time: number;
  read: boolean;
}
