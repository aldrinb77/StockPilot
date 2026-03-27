import { OHLCV, Signal, IndicatorVerdict } from './types';
import { 
  calcRSI, calcMACD, calcSMA, calcEMA, calcBollingerBands, calcStochastic, 
  calcADX, calcATR, calcSupertrend, calcOBV 
} from './indicators';

function getDefaultSignal(message: string): Signal {
  return {
    type: 'NEUTRAL',
    strength: 50,
    entry: { min: 0, max: 0 },
    targets: [],
    stopLoss: 0,
    riskReward: '0',
    reasons: [message],
    indicators: [],
    timeframe: 'N/A'
  };
}

export function generateSignal(data: OHLCV[]): Signal {
  if (!data || data.length < 50) {
    return getDefaultSignal("Not enough data — need 50+ candles");
  }

  try {
    const closes = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const volumes = data.map(d => d.volume);
    const latest = closes[closes.length - 1];

    // Calculate all indicators
    const rsi = calcRSI(closes, 14);
    const macd = calcMACD(closes);
    const sma20 = calcSMA(closes, 20);
    const sma50 = calcSMA(closes, 50);
    const ema9 = calcEMA(closes, 9);
    const ema21 = calcEMA(closes, 21);
    const ema200 = calcEMA(closes, 200);
    const bb = calcBollingerBands(closes, 20, 2);
    const stoch = calcStochastic(highs, lows, closes, 14, 3);
    const adx = calcADX(highs, lows, closes, 14);
    const atr = calcATR(highs, lows, closes, 14);
    const supertrend = calcSupertrend(highs, lows, closes, 10, 3);
    const obv = calcOBV(closes, volumes);

    // Get latest values
    const latestRSI = rsi[rsi.length - 1] || 50;
    const latestMACD = macd.macd[macd.macd.length - 1] || 0;
    const latestSignalLine = macd.signal[macd.signal.length - 1] || 0;
    const latestHistogram = macd.histogram[macd.histogram.length - 1] || 0;
    const latestSMA20 = sma20[sma20.length - 1] || latest;
    const latestSMA50 = sma50[sma50.length - 1] || latest;
    const latestEMA9 = ema9[ema9.length - 1] || latest;
    const latestEMA21 = ema21[ema21.length - 1] || latest;
    const latestEMA200 = ema200.length > 0 ? ema200[ema200.length - 1] : latest;
    const latestBBUpper = bb.upper[bb.upper.length - 1] || latest;
    const latestBBLower = bb.lower[bb.lower.length - 1] || latest;
    const latestBBMiddle = bb.middle[bb.middle.length - 1] || latest;
    const latestStochK = stoch.k[stoch.k.length - 1] || 50;
    const latestStochD = stoch.d[stoch.d.length - 1] || 50;
    const latestADX = adx[adx.length - 1] || 20;
    const latestATR = atr[atr.length - 1] || 0;
    const latestSupertrend = supertrend.trend[supertrend.trend.length - 1] || 'neutral';
    
    // Previous values for crossover detection
    const prevMACD = macd.macd[macd.macd.length - 2] || 0;
    const prevSignalLine = macd.signal[macd.signal.length - 2] || 0;
    const prevStochK = stoch.k[stoch.k.length - 2] || 50;
    const prevStochD = stoch.d[stoch.d.length - 2] || 50;
    const prevEMA9 = ema9[ema9.length - 2] || latest;
    const prevEMA21 = ema21[ema21.length - 2] || latest;

    // Volume confirmation
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const currentVolume = volumes[volumes.length - 1] || 0;
    const volumeSpike = currentVolume > avgVolume * 1.3;

    // SCORE SYSTEM
    let bullishScore = 0;
    let bearishScore = 0;
    const verdicts: any[] = [];

    // 1. RSI
    if (latestRSI < 30) {
      bullishScore += 2;
      verdicts.push({ name: 'RSI', value: latestRSI.toFixed(1), verdict: 'bullish', reason: `RSI at ${latestRSI.toFixed(1)} — OVERSOLD! Great buy zone 🔥` });
    } else if (latestRSI < 40) {
      bullishScore += 1;
      verdicts.push({ name: 'RSI', value: latestRSI.toFixed(1), verdict: 'bullish', reason: `RSI at ${latestRSI.toFixed(1)} — Approaching oversold` });
    } else if (latestRSI > 70) {
      bearishScore += 2;
      verdicts.push({ name: 'RSI', value: latestRSI.toFixed(1), verdict: 'bearish', reason: `RSI at ${latestRSI.toFixed(1)} — OVERBOUGHT! Take profits 💰` });
    } else if (latestRSI > 60) {
      bearishScore += 1;
      verdicts.push({ name: 'RSI', value: latestRSI.toFixed(1), verdict: 'bearish', reason: `RSI at ${latestRSI.toFixed(1)} — Getting overbought` });
    } else {
      verdicts.push({ name: 'RSI', value: latestRSI.toFixed(1), verdict: 'neutral', reason: `RSI at ${latestRSI.toFixed(1)} — Neutral zone` });
    }

    // 2. MACD Crossover
    const macdCrossUp = prevMACD <= prevSignalLine && latestMACD > latestSignalLine;
    const macdCrossDown = prevMACD >= prevSignalLine && latestMACD < latestSignalLine;
    if (macdCrossUp) {
      bullishScore += 2;
      verdicts.push({ name: 'MACD', value: 'Bullish Crossover', verdict: 'bullish', reason: 'MACD just crossed BULLISH! Strong buy signal 🚀' });
    } else if (latestMACD > latestSignalLine && latestHistogram > 0) {
      bullishScore += 1;
      verdicts.push({ name: 'MACD', value: 'Bullish', verdict: 'bullish', reason: 'MACD is bullish — momentum is up' });
    } else if (macdCrossDown) {
      bearishScore += 2;
      verdicts.push({ name: 'MACD', value: 'Bearish Crossover', verdict: 'bearish', reason: 'MACD just crossed BEARISH! Exit signal ⚠️' });
    } else if (latestMACD < latestSignalLine) {
      bearishScore += 1;
      verdicts.push({ name: 'MACD', value: 'Bearish', verdict: 'bearish', reason: 'MACD is bearish — momentum is down' });
    }

    // 3. EMA 9/21 Crossover
    const emaCrossUp = prevEMA9 <= prevEMA21 && latestEMA9 > latestEMA21;
    const emaCrossDown = prevEMA9 >= prevEMA21 && latestEMA9 < latestEMA21;
    if (emaCrossUp) {
      bullishScore += 2;
      verdicts.push({ name: 'EMA Cross', value: '9 > 21', verdict: 'bullish', reason: 'EMA 9 crossed above EMA 21 — Trend turning UP! 📈' });
    } else if (latestEMA9 > latestEMA21) {
      bullishScore += 1;
      verdicts.push({ name: 'EMA Cross', value: '9 > 21', verdict: 'bullish', reason: 'Short-term trend is UP' });
    } else if (emaCrossDown) {
      bearishScore += 2;
      verdicts.push({ name: 'EMA Cross', value: '9 < 21', verdict: 'bearish', reason: 'EMA 9 crossed below EMA 21 — Trend turning DOWN! 📉' });
    } else {
      bearishScore += 1;
      verdicts.push({ name: 'EMA Cross', value: '9 < 21', verdict: 'bearish', reason: 'Short-term trend is DOWN' });
    }

    // 4. Price vs 200 EMA
    if (latest > latestEMA200) {
      bullishScore += 1;
      verdicts.push({ name: '200 EMA', value: latestEMA200.toFixed(2), verdict: 'bullish', reason: 'Price ABOVE 200 EMA — Long-term uptrend ✅' });
    } else {
      bearishScore += 1;
      verdicts.push({ name: '200 EMA', value: latestEMA200.toFixed(2), verdict: 'bearish', reason: 'Price BELOW 200 EMA — Long-term downtrend ❌' });
    }

    // 5. Bollinger Bands
    if (latest <= latestBBLower) {
      bullishScore += 2;
      verdicts.push({ name: 'Bollinger', value: 'Lower Band', verdict: 'bullish', reason: 'Price at LOWER Bollinger Band — Bounce expected! 🦘' });
    } else if (latest >= latestBBUpper) {
      bearishScore += 2;
      verdicts.push({ name: 'Bollinger', value: 'Upper Band', verdict: 'bearish', reason: 'Price at UPPER Bollinger Band — Pullback likely' });
    } else {
      verdicts.push({ name: 'Bollinger', value: 'Middle', verdict: 'neutral', reason: 'Price in Bollinger middle zone' });
    }

    // 6. Stochastic
    const stochCrossUp = prevStochK <= prevStochD && latestStochK > latestStochD && latestStochK < 30;
    const stochCrossDown = prevStochK >= prevStochD && latestStochK < latestStochD && latestStochK > 70;
    if (stochCrossUp) {
      bullishScore += 2;
      verdicts.push({ name: 'Stochastic', value: latestStochK.toFixed(1), verdict: 'bullish', reason: 'Stochastic bullish cross in OVERSOLD zone! 🎯' });
    } else if (latestStochK < 20) {
      bullishScore += 1;
      verdicts.push({ name: 'Stochastic', value: latestStochK.toFixed(1), verdict: 'bullish', reason: 'Stochastic oversold — reversal coming' });
    } else if (stochCrossDown) {
      bearishScore += 2;
      verdicts.push({ name: 'Stochastic', value: latestStochK.toFixed(1), verdict: 'bearish', reason: 'Stochastic bearish cross in OVERBOUGHT zone!' });
    } else if (latestStochK > 80) {
      bearishScore += 1;
      verdicts.push({ name: 'Stochastic', value: latestStochK.toFixed(1), verdict: 'bearish', reason: 'Stochastic overbought — pullback likely' });
    } else {
      verdicts.push({ name: 'Stochastic', value: latestStochK.toFixed(1), verdict: 'neutral', reason: 'Stochastic neutral' });
    }

    // 7. Supertrend
    if (latestSupertrend === 'up') {
      bullishScore += 1;
      verdicts.push({ name: 'Supertrend', value: 'Bullish', verdict: 'bullish', reason: 'Supertrend is GREEN — Ride the trend! 🟢' });
    } else {
      bearishScore += 1;
      verdicts.push({ name: 'Supertrend', value: 'Bearish', verdict: 'bearish', reason: 'Supertrend is RED — Stay cautious 🔴' });
    }

    // 8. ADX (Trend Strength)
    if (latestADX > 25) {
      verdicts.push({ name: 'ADX', value: latestADX.toFixed(1), verdict: 'neutral', reason: `ADX at ${latestADX.toFixed(1)} — Strong trend 💪` });
      if (bullishScore > bearishScore) bullishScore += 1;
      else if (bearishScore > bullishScore) bearishScore += 1;
    }

    // 9. Volume Confirmation
    if (volumeSpike) {
      if (latest > closes[closes.length-2]) {
        bullishScore += 1;
        verdicts.push({ name: 'Volume', value: 'High', verdict: 'bullish', reason: 'HIGH VOLUME confirms the move! 📊' });
      } else {
        bearishScore += 1;
        verdicts.push({ name: 'Volume', value: 'High', verdict: 'bearish', reason: 'HIGH VOLUME on selling — bears in control' });
      }
    }

    // 10. Candle Analysis
    const isGreen = latest > closes[closes.length-2];
    if (isGreen) {
      bullishScore += 0.5;
    } else {
      bearishScore += 0.5;
    }

    const totalScore = bullishScore + bearishScore;
    const bullishPercent = (bullishScore / Math.max(totalScore, 1)) * 100;
    const bearishPercent = (bearishScore / Math.max(totalScore, 1)) * 100;

    let signalType: string;
    let strength: number;

    if (bullishPercent >= 80) {
      signalType = 'STRONG_BUY';
      strength = Math.min(bullishPercent, 100);
    } else if (bullishPercent >= 65) {
      signalType = 'BUY';
      strength = bullishPercent;
    } else if (bearishPercent >= 80) {
      signalType = 'STRONG_SELL';
      strength = Math.min(bearishPercent, 100);
    } else if (bearishPercent >= 65) {
      signalType = 'SELL';
      strength = bearishPercent;
    } else {
      signalType = 'HOLD';
      strength = 50;
    }

    const slDistance = latestATR * 2;
    const stopLoss = signalType.includes('BUY') ? latest - slDistance : latest + slDistance;
    const risk = Math.abs(latest - stopLoss);
    const target1 = signalType.includes('BUY') ? latest + risk * 1.5 : latest - risk * 1.5;
    const target2 = signalType.includes('BUY') ? latest + risk * 2.5 : latest - risk * 2.5;
    const target3 = signalType.includes('BUY') ? latest + risk * 3.5 : latest - risk * 3.5;

    return {
      type: signalType,
      strength: Math.round(strength),
      entry: { min: latest * 0.998, max: latest * 1.002 },
      targets: [
        parseFloat(target1.toFixed(2)),
        parseFloat(target2.toFixed(2)),
        parseFloat(target3.toFixed(2)),
      ],
      stopLoss: parseFloat(stopLoss.toFixed(2)),
      riskReward: `1:${(risk > 0 ? (Math.abs(target2 - latest) / risk).toFixed(1) : '0')}`,
      reasons: verdicts.filter(v => v.verdict !== 'neutral').map(v => v.reason),
      indicators: verdicts,
      timeframe: 'Swing Trade (2-7 days)',
    };
  } catch (error) {
    console.error('Signal generation error:', error);
    return getDefaultSignal('Error calculating signals');
  }
}
