import { OHLCV, Signal, IndicatorVerdict } from './types';
import { fetchHistoricalData } from './api';
import { 
  calcRSI, calcMACD, calcSMA, calcEMA, calcBollingerBands, calcStochastic, 
  calcADX, calcATR, calcVWAP, calcOBV, calcCCI, calcSupertrend, calcParabolicSAR 
} from './indicators';

export function generateSignal(data: OHLCV[]): Signal {
  if (data.length < 200) {
    throw new Error('Not enough data to calculate reliable signals (need 200 bars)');
  }

  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);
  const volumes = data.map(d => d.volume);
  const currentPrice = closes[closes.length - 1];

  // Calculate all indicators
  const rsi = calcRSI(closes);
  const macd = calcMACD(closes);
  const ema50 = calcEMA(closes, 50);
  const ema200 = calcEMA(closes, 200);
  const bb = calcBollingerBands(closes);
  const stoch = calcStochastic(highs, lows, closes);
  const adx = calcADX(highs, lows, closes);
  const atr = calcATR(highs, lows, closes);
  const supertrend = calcSupertrend(highs, lows, closes);
  const psar = calcParabolicSAR(highs, lows);
  const cci = calcCCI(highs, lows, closes);
  const sma20Vol = calcSMA(volumes, 20);

  // Get latest values
  const l_rsi = rsi[rsi.length - 1];
  const l_macd = {
    m: macd.macd[macd.macd.length - 1],
    s: macd.signal[macd.signal.length - 1],
    h: macd.histogram[macd.histogram.length - 1]
  };
  const l_ema50 = ema50[ema50.length - 1];
  const l_ema200 = ema200[ema200.length - 1];
  const l_bb = {
    u: bb.upper[bb.upper.length - 1],
    m: bb.middle[bb.middle.length - 1],
    l: bb.lower[bb.lower.length - 1]
  };
  const l_stoch = {
    k: stoch.k[stoch.k.length - 1],
    d: stoch.d[stoch.d.length - 1],
    kPrev: stoch.k[stoch.k.length - 2]
  };
  const l_adx = adx[adx.length - 1];
  const l_atr = atr[atr.length - 1];
  const l_supertrend = supertrend.trend[supertrend.trend.length - 1];
  const l_psar = psar[psar.length - 1];
  const l_cci = cci[cci.length - 1];
  const l_vol = volumes[volumes.length - 1];
  const avgVol = sma20Vol[sma20Vol.length - 1];

  const verdicts: IndicatorVerdict[] = [];

  // RSI
  if (l_rsi < 30) verdicts.push({ name: 'RSI', value: l_rsi.toFixed(2), verdict: 'bullish', description: `RSI at ${l_rsi.toFixed(2)} — Oversold, bounce likely` });
  else if (l_rsi > 70) verdicts.push({ name: 'RSI', value: l_rsi.toFixed(2), verdict: 'bearish', description: `RSI at ${l_rsi.toFixed(2)} — Overbought, pullback likely` });
  else if (l_rsi >= 30 && l_rsi <= 50) verdicts.push({ name: 'RSI', value: l_rsi.toFixed(2), verdict: 'bullish', description: 'RSI is slightly bullish' });
  else if (l_rsi > 50 && l_rsi <= 70) verdicts.push({ name: 'RSI', value: l_rsi.toFixed(2), verdict: 'bearish', description: 'RSI is slightly bearish' });
  else verdicts.push({ name: 'RSI', value: l_rsi.toFixed(2), verdict: 'neutral', description: 'RSI is neutral' });

  // MACD
  if (l_macd.m > l_macd.s && l_macd.h > 0) verdicts.push({ name: 'MACD', value: 'Bullish Cross', verdict: 'bullish', description: 'MACD bullish crossover' });
  else if (l_macd.m < l_macd.s && l_macd.h < 0) verdicts.push({ name: 'MACD', value: 'Bearish Cross', verdict: 'bearish', description: 'MACD bearish crossover' });
  else verdicts.push({ name: 'MACD', value: 'Neutral', verdict: 'neutral', description: 'MACD is neutral' });

  // EMA
  if (currentPrice > l_ema50 && currentPrice > l_ema200) verdicts.push({ name: 'EMA', value: 'Above 50 & 200', verdict: 'bullish', description: 'Price above 50 & 200 EMA — Strong uptrend' });
  else if (currentPrice > l_ema50 && currentPrice < l_ema200) verdicts.push({ name: 'EMA', value: 'Between EMAs', verdict: 'bullish', description: 'Price above 50-EMA but below 200-EMA' });
  else if (currentPrice < l_ema50 && currentPrice < l_ema200) verdicts.push({ name: 'EMA', value: 'Below 50 & 200', verdict: 'bearish', description: 'Price below EMAs — Downtrend' });
  else verdicts.push({ name: 'EMA', value: 'Mixed', verdict: 'neutral', description: 'EMA mixed' });

  // Bollinger Bands
  if (currentPrice <= l_bb.l * 1.01) verdicts.push({ name: 'Bollinger Bands', value: 'At Lower Band', verdict: 'bullish', description: 'Price at lower Bollinger Band — Oversold' });
  else if (currentPrice >= l_bb.u * 0.99) verdicts.push({ name: 'Bollinger Bands', value: 'At Upper Band', verdict: 'bearish', description: 'Price at upper Bollinger Band — Overbought' });
  else verdicts.push({ name: 'Bollinger Bands', value: 'Middle', verdict: 'neutral', description: 'Price in middle of bands' });

  // Stochastic
  if (l_stoch.k < 20 && l_stoch.k > l_stoch.d && l_stoch.kPrev <= l_stoch.d) verdicts.push({ name: 'Stochastic', value: 'Bullish Cross', verdict: 'bullish', description: '%K crossed above %D in oversold territory' });
  else if (l_stoch.k > 80 && l_stoch.k < l_stoch.d && l_stoch.kPrev >= l_stoch.d) verdicts.push({ name: 'Stochastic', value: 'Bearish Cross', verdict: 'bearish', description: '%K crossed below %D in overbought territory' });
  else verdicts.push({ name: 'Stochastic', value: 'Neutral', verdict: 'neutral', description: 'Stochastic neutral' });

  // ADX
  if (l_adx > 25) verdicts.push({ name: 'ADX', value: l_adx.toFixed(2), verdict: 'bullish', description: 'Strong trending market' });
  else if (l_adx < 20) verdicts.push({ name: 'ADX', value: l_adx.toFixed(2), verdict: 'neutral', description: 'Weak trend / consolidation' });
  else verdicts.push({ name: 'ADX', value: l_adx.toFixed(2), verdict: 'neutral', description: 'Moderate trend' });

  // Supertrend
  if (l_supertrend === 'up') verdicts.push({ name: 'Supertrend', value: 'Up', verdict: 'bullish', description: 'Supertrend is bullish' });
  else verdicts.push({ name: 'Supertrend', value: 'Down', verdict: 'bearish', description: 'Supertrend is bearish' });

  // Volume
  if (l_vol > avgVol * 1.5) verdicts.push({ name: 'Volume', value: 'High', verdict: 'bullish', description: 'Volume spike confirms trend' });
  else if (l_vol < avgVol * 0.5) verdicts.push({ name: 'Volume', value: 'Low', verdict: 'neutral', description: 'Low volume weakens signal' });
  else verdicts.push({ name: 'Volume', value: 'Normal', verdict: 'neutral', description: 'Normal volume' });

  // PSAR
  if (l_psar < currentPrice) verdicts.push({ name: 'PSAR', value: l_psar.toFixed(2), verdict: 'bullish', description: 'SAR below price — Uptrend' });
  else verdicts.push({ name: 'PSAR', value: l_psar.toFixed(2), verdict: 'bearish', description: 'SAR above price — Downtrend' });

  // CCI
  if (l_cci < -100) verdicts.push({ name: 'CCI', value: l_cci.toFixed(2), verdict: 'bullish', description: 'CCI oversold' });
  else if (l_cci > 100) verdicts.push({ name: 'CCI', value: l_cci.toFixed(2), verdict: 'bearish', description: 'CCI overbought' });
  else verdicts.push({ name: 'CCI', value: l_cci.toFixed(2), verdict: 'neutral', description: 'CCI neutral' });

  // Calculate Weights 
  let bullishCount = verdicts.filter(v => v.verdict === 'bullish').length;
  let bearishCount = verdicts.filter(v => v.verdict === 'bearish').length;
  const total = verdicts.length;

  let type: Signal['type'] = 'NEUTRAL';
  const strengthRaw = Math.max(bullishCount, bearishCount) / total;
  const strength = Math.round(strengthRaw * 100);

  if (bullishCount >= 8) type = 'STRONG_BULLISH';
  else if (bullishCount >= 6) type = 'BULLISH';
  else if (bearishCount >= 8) type = 'STRONG_BEARISH';
  else if (bearishCount >= 6) type = 'BEARISH';
  else type = 'NEUTRAL';

  // Entry, SL, Targets
  const isBuy = type === 'BULLISH' || type === 'STRONG_BULLISH';
  const isSell = type === 'BEARISH' || type === 'STRONG_BEARISH';

  let entryMin = currentPrice * 0.998;
  let entryMax = currentPrice * 1.002;
  let stopLoss = 0;
  let targets: number[] = [];
  let riskReward = 0;

  if (isBuy) {
    stopLoss = currentPrice - (l_atr * 1.5);
    const riskAmount = Math.abs(currentPrice - stopLoss);
    targets = [
      currentPrice + (riskAmount * 1),
      currentPrice + (riskAmount * 2),
      currentPrice + (riskAmount * 3)
    ];
    riskReward = targets[2] - currentPrice > 0 ? (targets[2] - currentPrice) / riskAmount : 0;
  } else if (isSell) {
    stopLoss = currentPrice + (l_atr * 1.5);
    const riskAmount = Math.abs(currentPrice - stopLoss);
    targets = [
      currentPrice - (riskAmount * 1),
      currentPrice - (riskAmount * 2),
      currentPrice - (riskAmount * 3)
    ];
    riskReward = currentPrice - targets[2] > 0 ? (currentPrice - targets[2]) / riskAmount : 0;
  } else {
    // Hold default bounds
    stopLoss = currentPrice - l_atr;
    targets = [currentPrice + l_atr];
    riskReward = 1;
  }

  const reasons = verdicts
    .filter(v => (isBuy && v.verdict === 'bullish') || (isSell && v.verdict === 'bearish') || (type === 'NEUTRAL' && v.verdict === 'neutral'))
    .map(v => v.description)
    .slice(0, 3); // top 3 reasons

  return {
    type,
    strength,
    entry: { min: parseFloat(entryMin.toFixed(2)), max: parseFloat(entryMax.toFixed(2)) },
    targets: targets.map(t => parseFloat(t.toFixed(2))),
    stopLoss: parseFloat(stopLoss.toFixed(2)),
    riskReward: parseFloat(riskReward.toFixed(1)),
    reasons: reasons.length > 0 ? reasons : ['Mixed signals consolidating'],
    indicators: verdicts,
    timeframe: 'Swing Trade (2-5 days)'
  };
}

export async function generateSignalForStock(symbol: string): Promise<Signal> {
  const data = await fetchHistoricalData(symbol, '1y', '1d');
  if (!data || data.length < 200) {
    throw new Error(`Insufficient data for ${symbol}`);
  }
  return generateSignal(data);
}
