import { 
  RSI, MACD, SMA, EMA, BollingerBands, Stochastic, 
  ADX, ATR, VWAP, OBV, CCI, PSAR,
  doji, bullishengulfingpattern, bearishengulfingpattern, 
  morningstar, eveningstar, threewhitesoldiers, threeblackcrows 
} from 'technicalindicators';
import { OHLCV } from './types';

// Helper to handle edge cases
const safeCalculate = <T>(calculator: () => T[], fallback: T[] = []): T[] => {
  try {
    return calculator();
  } catch (error) {
    return fallback;
  }
};

export function calcRSI(closes: number[], period = 14): number[] {
  if (closes.length < period) return [];
  return safeCalculate(() => RSI.calculate({ values: closes, period }));
}

export function calcMACD(closes: number[]): { macd: number[], signal: number[], histogram: number[] } {
  if (closes.length < 26) return { macd: [], signal: [], histogram: [] };
  
  const results = safeCalculate(() => MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  }));
  
  return {
    macd: results.map(r => r.MACD || 0),
    signal: results.map(r => r.signal || 0),
    histogram: results.map(r => r.histogram || 0)
  };
}

export function calcSMA(closes: number[], period: number): number[] {
  if (closes.length < period) return [];
  return safeCalculate(() => SMA.calculate({ values: closes, period }));
}

export function calcEMA(closes: number[], period: number): number[] {
  if (closes.length < period) return [];
  return safeCalculate(() => EMA.calculate({ values: closes, period }));
}

export function calcBollingerBands(closes: number[], period = 20, stdDev = 2): { upper: number[], middle: number[], lower: number[] } {
  if (closes.length < period) return { upper: [], middle: [], lower: [] };
  const results = safeCalculate(() => BollingerBands.calculate({ values: closes, period, stdDev }));
  return {
    upper: results.map(r => r.upper),
    middle: results.map(r => r.middle),
    lower: results.map(r => r.lower)
  };
}

export function calcStochastic(highs: number[], lows: number[], closes: number[], period = 14, signalPeriod = 3): { k: number[], d: number[] } {
  if (closes.length < period) return { k: [], d: [] };
  const results = safeCalculate(() => Stochastic.calculate({ high: highs, low: lows, close: closes, period, signalPeriod }));
  return {
    k: results.map(r => r.k),
    d: results.map(r => r.d)
  };
}

export function calcADX(highs: number[], lows: number[], closes: number[], period = 14): number[] {
  if (closes.length < period) return [];
  const results = safeCalculate(() => ADX.calculate({ high: highs, low: lows, close: closes, period }));
  return results.map(r => r.adx);
}

export function calcATR(highs: number[], lows: number[], closes: number[], period = 14): number[] {
  if (closes.length < period) return [];
  return safeCalculate(() => ATR.calculate({ high: highs, low: lows, close: closes, period }));
}

export function calcVWAP(highs: number[], lows: number[], closes: number[], volumes: number[]): number[] {
  if (closes.length === 0) return [];
  return safeCalculate(() => VWAP.calculate({ high: highs, low: lows, close: closes, volume: volumes }));
}

export function calcOBV(closes: number[], volumes: number[]): number[] {
  if (closes.length === 0) return [];
  return safeCalculate(() => OBV.calculate({ close: closes, volume: volumes }));
}

export function calcCCI(highs: number[], lows: number[], closes: number[], period = 20): number[] {
  if (closes.length < period) return [];
  return safeCalculate(() => CCI.calculate({ high: highs, low: lows, close: closes, period }));
}

export function calcSupertrend(highs: number[], lows: number[], closes: number[], period = 10, multiplier = 3): { trend: ('up' | 'down')[], values: number[] } {
  if (closes.length < period) return { trend: [], values: [] };
  const atrs = calcATR(highs, lows, closes, period);
  const trend: ('up' | 'down')[] = [];
  const values: number[] = [];
  let isUptrend = true;
  let finalUpperBand = 0;
  let finalLowerBand = 0;

  for (let i = 0; i < closes.length; i++) {
    if (i < period) {
      trend.push('up');
      values.push(closes[i]);
      continue;
    }

    const hl2 = (highs[i] + lows[i]) / 2;
    const atr = atrs[i - period] || 0;
    
    const basicUpperBand = hl2 + multiplier * atr;
    const basicLowerBand = hl2 - multiplier * atr;

    if (i === period) {
      finalUpperBand = basicUpperBand;
      finalLowerBand = basicLowerBand;
    } else {
      finalUpperBand = basicUpperBand < finalUpperBand || closes[i - 1] > finalUpperBand ? basicUpperBand : finalUpperBand;
      finalLowerBand = basicLowerBand > finalLowerBand || closes[i - 1] < finalLowerBand ? basicLowerBand : finalLowerBand;
    }

    if (isUptrend && closes[i] <= finalLowerBand) isUptrend = false;
    else if (!isUptrend && closes[i] >= finalUpperBand) isUptrend = true;

    trend.push(isUptrend ? 'up' : 'down');
    values.push(isUptrend ? finalLowerBand : finalUpperBand);
  }

  return { trend, values };
}

export function calcParabolicSAR(highs: number[], lows: number[], step = 0.02, max = 0.2): number[] {
  if (highs.length < 2) return [];
  return safeCalculate(() => PSAR.calculate({ high: highs, low: lows, step, max }));
}

export function calcSupportResistance(highs: number[], lows: number[], closes: number[]): { supports: number[], resistances: number[] } {
  if (closes.length === 0) return { supports: [], resistances: [] };
  
  const lastHigh = highs[highs.length - 1];
  const lastLow = lows[lows.length - 1];
  const lastClose = closes[closes.length - 1];

  const pivot = (lastHigh + lastLow + lastClose) / 3;
  const s1 = (2 * pivot) - lastHigh;
  const s2 = pivot - (lastHigh - lastLow);
  const r1 = (2 * pivot) - lastLow;
  const r2 = pivot + (lastHigh - lastLow);

  return {
    supports: [Math.min(s1, s2), Math.max(s1, s2)],
    resistances: [Math.min(r1, r2), Math.max(r1, r2)]
  };
}

export function detectCandlestickPatterns(data: OHLCV[]): { pattern: string, type: 'bullish' | 'bearish', index: number }[] {
  if (data.length < 5) return [];
  
  const input = {
    open: data.map(d => d.open),
    high: data.map(d => d.high),
    low: data.map(d => d.low),
    close: data.map(d => d.close),
  };

  const results: { pattern: string, type: 'bullish' | 'bearish', index: number }[] = [];
  const addPattern = (detector: any, patternName: string, type: 'bullish' | 'bearish') => {
    try {
      if (detector(input)) {
        results.push({ pattern: patternName, type, index: data.length - 1 });
      }
    } catch (e) {
      // ignore empty matches
    }
  };

  addPattern(doji, 'Doji', 'neutral' as any);
  addPattern(bullishengulfingpattern, 'Bullish Engulfing', 'bullish');
  addPattern(bearishengulfingpattern, 'Bearish Engulfing', 'bearish');
  addPattern(morningstar, 'Morning Star', 'bullish');
  addPattern(eveningstar, 'Evening Star', 'bearish');
  addPattern(threewhitesoldiers, 'Three White Soldiers', 'bullish');
  addPattern(threeblackcrows, 'Three Black Crows', 'bearish');

  return results;
}
