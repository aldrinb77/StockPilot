export interface InlineTip {
  id: string;
  category: 'INDICATOR' | 'PATTERN' | 'TERM' | 'STRATEGY';
  title: string;
  shortDesc: string;
  fullDesc: string;
}

export const INLINE_TIPS: Record<string, InlineTip> = {
  RSI: {
    id: 'RSI',
    category: 'INDICATOR',
    title: 'Relative Strength Index (RSI)',
    shortDesc: 'Measures "Oversold" vs "Overbought" momentum.',
    fullDesc: 'RSI scales from 0-100. Below 30 means a stock fell too fast (Oversold) and a bounce is mathematically likely. Above 70 means it rose too fast (Overbought) and a pullback is expected. Smart traders look for RSI divergence for high-win rate entries.'
  },
  MACD: {
    id: 'MACD',
    category: 'INDICATOR',
    title: 'Moving Average Convergence Divergence',
    shortDesc: 'Tracks trend changes and momentum strength.',
    fullDesc: 'MACD consists of two lines and a histogram. When the fast line crosses above the slow line, it’s a Bullish Crossover. When the histogram expands, momentum is accelerating. It’s one of the best indicators for trend following.'
  },
  VOLUME: {
    id: 'VOLUME',
    category: 'TERM',
    title: 'Trading Volume',
    shortDesc: 'The "engine oil" of price movements.',
    fullDesc: 'Price moves on low volume are often "fakeouts". Institutional participation is confirmed when price moves are accompanied by a 1.5x - 2x increase in daily volume.'
  },
  STOP_LOSS: {
    id: 'STOP_LOSS',
    category: 'STRATEGY',
    title: 'Stop Loss Protocol',
    shortDesc: 'The essential insurance for every trade.',
    fullDesc: 'A stop loss is a hard command to exit a trade if it goes against you. Professional traders NEVER trade without one. It keeps one bad trade from destroying your entire command center balance.'
  },
  SMA_200: {
    id: 'SMA_200',
    category: 'INDICATOR',
    title: '200-Day Moving Average',
    shortDesc: 'The long-term health indicator.',
    fullDesc: 'The 200-SMA is the "line in the sand" for institutions. Above it, the long-term trend is bullish. Below it, the market is in a structural bear regime.'
  },
  BULLISH_ENGULFING: {
    id: 'BULLISH_ENGULFING',
    category: 'PATTERN',
    title: 'Bullish Engulfing Pattern',
    shortDesc: 'A powerful price reversal signal.',
    fullDesc: 'Occurs when a large green candle completely "eats" (engulfs) the body of the previous red candle. This indicates a sudden shift in control from sellers to buyers.'
  }
};
