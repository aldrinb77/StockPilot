export interface DailyTip {
  title: string;
  tip: string;
  category: "Risk Management" | "Technical Analysis" | "Trading Psychology" | "Market Basics";
  emoji: string;
  readTime: string;
}

export const DAILY_TIPS: DailyTip[] = [
  {
    title: "The 2% Rule",
    tip: "Never risk more than 2% of your total capital on a single trade. If you have ₹1,00,000 — your maximum loss on any trade should be ₹2,000. This keeps you alive even after a losing streak.",
    category: "Risk Management",
    emoji: "🛡️",
    readTime: "30s"
  },
  {
    title: "Volume Confirms Everything",
    tip: "A price breakout without volume is FAKE. Always check if volume is above average (1.5x) during breakouts. High volume = institutions are buying. Low volume = trap.",
    category: "Technical Analysis",
    emoji: "📊",
    readTime: "45s"
  },
  {
    title: "The First 15 Minutes Rule",
    tip: "Never trade in the first 15 minutes after market opens. Prices are wild due to overnight orders. Wait for the chaos to settle, then enter around 9:45 AM.",
    category: "Trading Psychology",
    emoji: "⏰",
    readTime: "30s"
  },
  {
    title: "RSI Divergence = Gold",
    tip: "When price makes a lower low but RSI makes a higher low — that's BULLISH DIVERGENCE. It means sellers are getting exhausted. This is one of the most powerful reversal signals.",
    category: "Technical Analysis",
    emoji: "🏆",
    readTime: "60s"
  },
  {
    title: "The Golden Cross",
    tip: "When the 50-day Moving Average crosses ABOVE the 200-day Moving Average, it's a Golden Cross. This signals a major long-term structural uptrend is beginning.",
    category: "Technical Analysis",
    emoji: "⚔️",
    readTime: "40s"
  },
  {
    title: "Cut Losses Fast",
    tip: "The hardest part of trading is accepting you were wrong. If a trade hits your stop loss, EXIT IMMEDIATELY. Don't 'hope' it comes back. Hope is not a strategy.",
    category: "Trading Psychology",
    emoji: "✂️",
    readTime: "30s"
  },
  {
    title: "Death Cross Warning",
    tip: "The 50 DMA crossing BELOW the 200 DMA is a Death Cross. It's time to be extremely defensive. Bear markets often start with this signal.",
    category: "Technical Analysis",
    emoji: "💀",
    readTime: "40s"
  },
  {
    title: "Bullish Engulfing",
    tip: "A green candle that completely 'eats' the previous red candle's body is a Bullish Engulfing pattern. It shows buyers have completely overpowered sellers at that level.",
    category: "Technical Analysis",
    emoji: "📈",
    readTime: "45s"
  },
  {
    title: "Position Sizing is Key",
    tip: "Calculate your position size based on your stop loss, not your account size. If your SL is 5% away and you want to risk 1% of account, you should put 20% of your capital into the trade.",
    category: "Risk Management",
    emoji: "📏",
    readTime: "50s"
  },
  {
    title: "Don't Fight the Fed",
    tip: "Market direction is often determined by central bank liquidity. When rates are falling, stay bullish. When rates are rising, stay cautious. Liquidity is the fuel for price.",
    category: "Market Basics",
    emoji: "🏦",
    readTime: "40s"
  },
  // Adding more to reach 60+ as requested...
  {
    title: "Hammer Candle Reversal",
    tip: "A small body with a long lower wick at the bottom of a downtrend is a Hammer. It shows sellers tried to push price down but buyers fought back hard.",
    category: "Technical Analysis",
    emoji: "🔨",
    readTime: "30s"
  },
  {
    title: "Trailing Stop Profit",
    tip: "Once a trade is in profit, move your Stop Loss to the entry point. This makes it a 'zero-risk' trade. Then trail it up as price rises to lock in gains.",
    category: "Risk Management",
    emoji: "🏃",
    readTime: "40s"
  },
  {
    title: "Overtrading Kills",
    tip: "More trades do not mean more profit. Usually, it's the opposite. The best traders wait for the perfect setup (A+ setup) and sit on their hands the rest of the time.",
    category: "Trading Psychology",
    emoji: "🚫",
    readTime: "35s"
  },
  {
    title: "The Magic of 200 EMA",
    tip: "Institutional money flows above the 200 EMA. If price is below it, only look for shorts or wait. If above it, stay focused on long setups.",
    category: "Technical Analysis",
    emoji: "🪄",
    readTime: "30s"
  },
  {
    title: "Supply and Demand",
    tip: "Forget support and resistance lines. Look for 'zones' where price moved away violently in the past. Those are supply/demand zones where orders are waiting.",
    category: "Technical Analysis",
    emoji: "⚖️",
    readTime: "50s"
  },
  {
    title: "Emotion is Your Enemy",
    tip: "If your heart beats faster when looking at a trade, you are trading too big. You should feel nothing when a trade hits SL or Target. Be a machine.",
    category: "Trading Psychology",
    emoji: "🤖",
    readTime: "40s"
  },
  {
    title: "ADX Intensity",
    tip: "An ADX value above 25 means a trend is strong. Don't try to bet against it. An ADX below 20 means price is ranging - perfect for oscillators like Stochastic.",
    category: "Technical Analysis",
    emoji: "🔥",
    readTime: "45s"
  },
  {
    title: "MACD Zero Line",
    tip: "When the MACD line crosses above the zero line, momentum has turned positive structurally. This is more significant than just a signal line crossover.",
    category: "Technical Analysis",
    emoji: "📉",
    readTime: "40s"
  },
  {
    title: "Gap Up Sustainability",
    tip: "If a stock gaps up and stays above the first 30-minute high, the trend will likely continue all day. If it breaks the 30-min low, it's a 'gap and crap' to be sold.",
    category: "Market Basics",
    emoji: "🕳️",
    readTime: "50s"
  },
  {
    title: "Sector Strength",
    tip: "Always buy the strongest stock in the strongest sector. Don't try to buy the 'lagging' stock hoping it catches up. Strength usually stays strong.",
    category: "Market Basics",
    emoji: "🚀",
    readTime: "40s"
  },
  // ... (Full list truncated for brevity but continuing implementation pattern to ensure 60)
  { title: "Risk:Reward Ratio", tip: "Always aim for at least 1:2. If you risk ₹10, you should aim to make ₹20. Even with a 40% win rate, you will be profitable.", category: "Risk Management", emoji: "⚖️", readTime: "40s" },
  { title: "Doji Star Indecision", tip: "A cross-shaped candle means buyers and sellers are matched. Watch for the NEXT candle break to see who wins the battle.", category: "Technical Analysis", emoji: "⭐", readTime: "30s" },
  { title: "Bollinger Squeeze", tip: "When Bollinger Bands get very tight, a massive move is coming. You don't know which way, so wait for the candle break outside the bands.", category: "Technical Analysis", emoji: "🍋", readTime: "45s" },
  { title: "News is Noise", tip: "The price chart already knows the news. If news is good but price falls, the good news was already 'priced in'. Watch price, not anchors on TV.", category: "Trading Psychology", emoji: "📺", readTime: "50s" },
  { title: "Psychological Levels", tip: "Round numbers like $100, $500, or ₹1000 act as natural magnets and barriers. Expect battles at these levels.", category: "Market Basics", emoji: "🧠", readTime: "35s" },
  { title: "Earnings Gambling", tip: "Holding through earnings is gambling, not trading. Price can move 20% in seconds. Either exit before or buy AFTER the news reaction.", category: "Risk Management", emoji: "🎰", readTime: "45s" },
  { title: "Relative Strength Index (RSI)", tip: "RSI measures the speed and change of price. 50 is the 'midline' - above it, buyers have control. Below it, sellers have control.", category: "Technical Analysis", emoji: "📈", readTime: "40s" },
  { title: "Cup and Handle", tip: "A rounded bottom followed by a small dip (handle) is a powerful bullish continuation pattern. Buy the breakout of the handle's high.", category: "Technical Analysis", emoji: "☕", readTime: "50s" },
  { title: "False Breakout Trap", tip: "When price breaks resistance but quickly falls back under it, that's a Bull Trap. Exit immediately; the reversal down will be fast.", category: "Technical Analysis", emoji: "🪤", readTime: "40s" },
  { title: "The Power of Patience", tip: "Sometimes the best trade is NO trade. Capital preservation is your first job. If the setup isn't perfect, keep your money in your pocket.", category: "Trading Psychology", emoji: "🧘", readTime: "45s" },
  { title: "Moving Average Confluence", tip: "When multiple moving averages (9, 21, 50, 200) agree on a trend, the signal is 5x stronger. Wait for the 'alignment' of the planets.", category: "Technical Analysis", emoji: "🪐", readTime: "50s" },
  { title: "Head and Shoulders", tip: "A three-peak pattern where the middle is highest signals the end of an uptrend. If price breaks the 'neckline', it's a major SELL.", category: "Technical Analysis", emoji: "👤", readTime: "55s" },
  { title: "Wash and Rinse", tip: "Institutions often push price below support to trigger stop losses before buying big. Wait for the 'wick' to form before entering a bounce.", category: "Market Basics", emoji: "🚿", readTime: "50s" },
  { title: "ATR for Stop Loss", tip: "Use Average True Range (ATR) to set stops. It factors in current volatility so you don't get 'stopped out' by normal noise.", category: "Risk Management", emoji: "📟", readTime: "45s" },
  { title: "VCP Pattern", tip: "Volatility Contraction Pattern shows price 'tightening' before a massive breakout. Look for shallow dips (shaking out weak hands).", category: "Technical Analysis", emoji: "🗜️", readTime: "50s" },
  { title: "V-Shape Recovery", tip: "A sharp crash followed by a sharp rise. These are hard to catch. Don't chase the move; wait for a 'higher low' to enter safely.", category: "Technical Analysis", emoji: "✌️", readTime: "40s" },
  { title: "Double Top Exit", tip: "If price hits a level twice and fails to break out, sellers are defending it. This is a classic 'M' pattern. It's time to take profits.", category: "Technical Analysis", emoji: "♊", readTime: "45s" },
  { title: "Double Bottom Entry", tip: "A 'W' pattern at a major support level. Buy when the middle 'peak' is broken. This signals a structural trend reversal.", category: "Technical Analysis", emoji: "♒", readTime: "45s" },
  { title: "Ascending Triangle", tip: "A flat top resistance and rising lows. Pressure is building against the roof. 70% chance of a bullish breakout to the upside.", category: "Technical Analysis", emoji: "📐", readTime: "50s" },
  { title: "Descending Triangle", tip: "A flat bottom support and falling highs. Price is being squeezed down. Highly bearish; prepare for a breakdown.", category: "Technical Analysis", emoji: "🔻", readTime: "50s" },
  { title: "EMA 9 Trend Rider", tip: "In a strong trend, price often bounces off the 9-day EMA. If it closes below it, the short-term momentum has likely died.", category: "Technical Analysis", emoji: "🎢", readTime: "40s" },
  { title: "Donchian Channels", tip: "These track the 20-day high and low. A break of the 20-day high is a classic 'Turtle Trading' system entry for huge trends.", category: "Technical Analysis", emoji: "🐢", readTime: "55s" },
  { title: "Parabolic Move Warning", tip: "When a stock moves vertically in a short time, the crash will be equally fast. Don't buy at the top; the 'climax run' is almost over.", category: "Trading Psychology", emoji: "🎈", readTime: "50s" },
  { title: "VWAP Accuracy", tip: "Volume Weighted Average Price is the most important intraday indicator. Institutions try to buy below it and sell above it. Use it as home base.", category: "Technical Analysis", emoji: "⚓", readTime: "60s" },
  { title: "Golden Ratio (0.618)", tip: "Fibonacci 61.8% level is the most common place for an impulsive wave to correct. Look for entries between 50% and 61.8% pullback.", category: "Technical Analysis", emoji: "🌀", readTime: "55s" },
  { title: "Keep it Simple", tip: "Don't overload your chart with 10 indicators. They will only confuse you. Pick 3 you trust and master them completely.", category: "Trading Psychology", emoji: "🧹", readTime: "40s" },
  { title: "Multiple Timeframes", tip: "Always check the Weekly and Daily charts before trading a 15-minute setup. Don't go 'Long' if the Weekly trend is 'Short'.", category: "Technical Analysis", emoji: "🕰️", readTime: "50s" },
  { title: "Trading Journal", tip: "If you don't track your trades, you aren't trading, you're gambling. Write down WHY you entered and what YOU felt. Fix your brain.", category: "Trading Psychology", emoji: "📓", readTime: "50s" },
  { title: "Capital Allocation", tip: "Never put 100% of your account into one trade. Split it into 10 'slots' of 10% each. This gives you 10 chances to win.", category: "Risk Management", emoji: "🍰", readTime: "45s" },
  { title: "The Trend is Your Friend", tip: "Never bet against the trend. It takes massive energy to turn a market around. It's much easier to just swim with the current.", category: "Technical Analysis", emoji: "🤝", readTime: "30s" },
  { title: "Friday Profit Taking", tip: "Big players often close positions on Friday afternoon to avoid weekend news risk. Expect some 'cooling off' around 2:30 PM on Fridays.", category: "Market Basics", emoji: "🗓️", readTime: "45s" },
  { title: "Overbought isn't a Sell", tip: "In a strong bull market, RSI can stay above 70 for WEEKS. Don't sell just because it's 'high'. Wait for a bearish divergence or trend break.", category: "Technical Analysis", emoji: "🔋", readTime: "50s" },
  { title: "Oversold isn't a Buy", tip: "A stock can be 'cheap' and get much cheaper. Never buy just because 'it's down too much'. Buy because it's starting to go UP.", category: "Technical Analysis", emoji: "🕳️", readTime: "50s" },
  { title: "Gap Closure", tip: "Markets love to fill gaps. If a stock gaps up, keep an eye on the gap area — it will often act as strong support on the first retest.", category: "Technical Analysis", emoji: "🧱", readTime: "45s" },
  { title: "Volume Precedes Price", tip: "Watch for volume spikes on flat price days. This is 'Quiet Accumulation' by institutions. Price usually follows volume soon after.", category: "Technical Analysis", emoji: "🕵️", readTime: "50s" },
  { title: "Ignore the Crowd", tip: "When everyone on social media is talk about a stock, it's usually too late. The 'dumb money' enters at the top. Be the 'smart money'.", category: "Trading Psychology", emoji: "🐑", readTime: "50s" },
  { title: "Market Cycle Mastery", tip: "Accumulation -> Markup -> Distribution -> Markdown. Learn where we are in the cycle. Don't buy in the distribution phase.", category: "Market Basics", emoji: "🔄", readTime: "60s" },
  { title: "Pivot Point Levels", tip: "Daily Pivot points are based on yesterday's high/low/close. They are 'naked' levels where price reaction is almost guaranteed.", category: "Technical Analysis", emoji: "📍", readTime: "50s" },
  { title: "The Power of 3", tip: "Trends often move in 3 waves. After the 3rd wave, the pullbacks are deeper or the trend reverses. Don't buy wave 4.", category: "Technical Analysis", emoji: "🌊", readTime: "45s" },
  { title: "Sleep is a Strategy", tip: "If you are tired or stressed, don't trade. Your brain will make emotional mistakes. A clear mind is your most valuable asset.", category: "Trading Psychology", emoji: "😴", readTime: "40s" },
  { title: "Position Size Adjustment", tip: "When you are on a winning streak, DON'T increase size. When on a losing streak, REDUCE size. Protect your capital first.", category: "Risk Management", emoji: "🎚️", readTime: "50s" }
];
