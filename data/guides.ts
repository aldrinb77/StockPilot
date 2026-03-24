export const GUIDES = [
  {
    slug: 'what-is-a-stock',
    title: 'What is a Stock?',
    description: 'Learn the very basics of what a stock is and how the stock market works.',
    icon: '🏢',
    readTime: '3 min',
    content: `
# What is a Stock?

A stock represents a share in the ownership of a company. When you buy a stock, you are buying a small piece of that company. As the company grows and becomes more valuable, the value of your piece (your stock) also grows.

Companies issue stocks to raise money to fund their business. They sell these shares to the public through a process called an Initial Public Offering (IPO). Once the shares are public, people can buy and sell them on the stock market.

The stock market is simply a marketplace, just like a farmers' market, but instead of buying apples or oranges, people are buying and selling shares of companies like Apple or Microsoft. The price of a stock is determined by supply and demand: if more people want to buy a stock than sell it, the price goes up. If more people want to sell than buy, the price goes down.
    `
  },
  {
    slug: 'buy-sell-hold',
    title: 'What is Buy, Sell, Hold?',
    description: 'Understand the three primary actions you can take with a stock.',
    icon: '⚖️',
    readTime: '2 min',
    content: `
# Buy, Sell, Hold Explained

In stock trading, analysts and platforms (like StoxPilot) issue ratings or signals to help you decide what to do. The three main actions are Buy, Sell, and Hold.

**1. BUY (or Strong Buy)**
A "Buy" signal means the stock is currently trading at a good price and is expected to go up in value. A "Strong Buy" means the mathematical indicators are extremely positive and the probability of the stock going up is very high.

**2. SELL (or Strong Sell)**
A "Sell" signal means you should sell the stock if you own it, because the mathematical indicators suggest the price is about to go down. A "Strong Sell" means the stock is heavily overbought or in a steep downtrend.

**3. HOLD**
A "Hold" signal means you shouldn't do anything right now. If you own the stock, keep it. If you don't own it, don't buy it yet. The market is consolidating or indicators are mixed.
    `
  },
  {
    slug: 'stop-loss',
    title: 'What is a Stop Loss?',
    description: 'Discover how to protect your money using a Stop Loss.',
    icon: '🛑',
    readTime: '3 min',
    content: `
# Stop Loss (SL) Explained

A Stop Loss is your safety net. It is an automatic order placed with your broker to sell a stock if it drops to a certain price. 

**Why is it important?**
Because no one can predict the stock market with 100% accuracy. If you buy a stock at $100 hoping it goes to $120, but the company suddenly reports bad news, the stock might crash to $60. 

If you set a Stop Loss at $90, your broker will automatically sell your shares the moment the price hits $90. You lose $10 instead of $40. **A stop loss guarantees that a small mistake doesn't wipe out your account.**

StoxPilot automatically calculates a mathematical stop loss for every BUY signal based on the stock's natural volatility (ATR). Always use a stop loss!
    `
  },
  {
    slug: 'target-price',
    title: 'What is a Target Price?',
    description: 'Learn when to take your profits and secure your gains.',
    icon: '🎯',
    readTime: '2 min',
    content: `
# Target Prices Explained

A Target Price (or Take Profit) is the price at which you plan to sell your stock to lock in a profit. Just as a Stop Loss protects you on the downside, a Target Price ensures you actually make money on the upside.

StoxPilot mathematically calculates three profit targets for every trade:
- **Target 1:** A highly conservative goal. Usually represents a 1:1 Risk-to-Reward ratio.
- **Target 2:** A moderate goal. You might sell half your shares here.
- **Target 3:** A more aggressive goal if the trend is very strong.

When a stock hits your target price, you should sell your shares (or at least a portion of them) and put the cash in your pocket. Don't be greedy; nobody goes broke taking a profit.
    `
  },
  {
    slug: 'technical-indicators',
    title: 'Understanding Technical Indicators',
    description: 'A beginner overview of RSI, MACD, and Moving Averages.',
    icon: '📈',
    readTime: '5 min',
    content: `
# Technical Indicators

Technical indicators are mathematical calculations based on a stock's historical price and volume. They help traders identify trends and predict future price movements (without relying on AI or guessing).

**1. RSI (Relative Strength Index)**
A number between 0 and 100. If RSI is below 30, the stock is "oversold" (too cheap, might bounce up). If RSI is above 70, the stock is "overbought" (too expensive, might drop).

**2. MACD (Moving Average Convergence Divergence)**
Shows the relationship between two moving averages. When the MACD line crosses above the signal line, it's a bullish (buy) signal. When it crosses below, it's a bearish (sell) signal.

**3. EMA (Exponential Moving Average)**
A line that averages the stock's price over a certain number of days (e.g., 50 days or 200 days). If the current price is above the 50-EMA, the stock is in an uptrend. If it's below, it's in a downtrend.

**4. Bollinger Bands**
Three lines drawn over the price chart. When the price hits the bottom line, it often bounces up. When it hits the top line, it often gets pushed down.
    `
  },
  {
    slug: 'candlestick-charts',
    title: 'How to Read Candlestick Charts',
    description: 'Learn how to read the language of the stock market.',
    icon: '🕯️',
    readTime: '4 min',
    content: `
# Candlestick Charts

A candlestick chart packs four pieces of information into a single picture for any given timeframe (e.g., 1 Day).

**1. The Body (Thick Part)**
The thick part of the candle shows the Opening and Closing price. 
- A **Green** body means the close was higher than the open (the stock went up).
- A **Red** body means the close was lower than the open (the stock went down).

**2. The Wicks (Thin Lines)**
The thin lines sticking out of the top and bottom are called wicks or shadows. They show the highest and lowest price reached during that time period.

A candlestick with a very long wick at the bottom means that sellers tried to push the price down heavily, but buyers instantly rejected it and pushed it back up. This is usually a strong signal that the price is about to go up.
    `
  },
  {
    slug: 'read-stockpilot-signals',
    title: 'How to Read Signals on StoxPilot',
    description: 'Step-by-step walkthrough on how to use our platform.',
    icon: '🧭',
    readTime: '3 min',
    content: `
# How to Use StoxPilot Signals

StoxPilot does all the heavy math so you don't have to. Here's exactly how to use our Signal Cards:

1. **Check the Badge:** Wait for a **STRONG BUY** or **BUY** signal. Ignore HOLDs and SELLs if you are looking to buy.
2. **Check the Entry Price:** We provide an Entry Zone (e.g., $150.00 - $152.00). Only buy the stock if the current price is currently inside this zone.
3. **Set Your Stop Loss:** The moment your broker executes your buy order, immediately enter a Stop Loss order using the exact Stop Loss price listed on our card.
4. **Wait for the Target:** Monitor the stock. Once it reaches Target 1 or Target 2, sell your shares and secure your profit.

StoxPilot's strength percentage tells you how many of our 10+ mathematical indicators agree on the signal. An 80% strength means 8 out of 10 complex mathematical rules are firing simultaneously.
    `
  },
  {
    slug: 'risk-management',
    title: 'Risk Management for Beginners',
    description: 'The golden rules to ensure you never blow up your account.',
    icon: '🛡️',
    readTime: '4 min',
    content: `
# Risk Management

Trading without risk management is gambling. Here are the unbreakable rules of successful traders:

**Rule 1: Never Risk More Than 2%**
Never risk more than 1% to 2% of your total account value on a single trade. If you have $10,000, your maximum risk should be $200. This means the distance from your Entry Price to your Stop Loss, multiplied by your shares, should not exceed $200. You would have to lose 50 trades in a row to wipe out your account.

**Rule 2: The 1:2 Risk-Reward Ratio**
Only take trades where you stand to make twice as much as you risk. If your Stop Loss is going to cost you $50 if triggered, your Target Price should make you at least $100. If you do this, you can be wrong 50% of the time and still make money. StoxPilot automatically calculates this for you!

**Rule 3: Cut Losses Early, Let Winners Run**
Never hold onto a losing stock hoping it "comes back." If it hits your Stop Loss, sell it mechanically with zero emotion.
    `
  },
  {
    slug: 'start-investing',
    title: 'How to Start Investing',
    description: 'A simple roadmap to making your very first trade.',
    icon: '🚀',
    readTime: '3 min',
    content: `
# Step-by-Step Guide

Ready to begin? Here is the exact path:

**1. Open a Brokerage Account**
You need an app/broker to actually buy the stocks. Popular zero-commission brokers for beginners include Robinhood, Webull, Fidelity, or Charles Schwab.

**2. Fund Your Account**
Link your bank and transfer money you can afford to lose. Start small ($100-$500) while you learn.

**3. Paper Trade First**
Before using real money, "paper trade" (practice trade) using StoxPilot signals. Write down the entry price and see if it hits the target or stop loss over the next week.

**4. Make Your First Real Trade**
When a StoxPilot STRONG BUY signal triggers, open your broker app. Search the stock ticker (e.g., AAPL). Enter a "Limit Order" for the entry price. Once filled, immediately set an OCO (One-Cancels-the-Other) order with your Target Price and Stop Loss.
    `
  },
  {
    slug: 'glossary',
    title: 'Stock Market Glossary',
    description: 'Definitions for all the confusing financial jargon.',
    icon: '📖',
    readTime: '6 min',
    content: `
# Glossary

**Bear Market:** A completely downward trending market where most stocks are dropping.
**Bull Market:** An upward trending market where prices are continually rising.
**Dividend:** A portion of a company's profit paid out to shareholders simply for owning the stock.
**ETF (Exchange Traded Fund):** A basket of stocks. Instead of buying just Apple, you buy an ETF that holds Apple, Microsoft, Google, etc.
**Limit Order:** An instruction to your broker to buy a stock ONLY at a specific price or better.
**Market Order:** An instruction to buy a stock right this second at whatever the current price is.
**Portfolio:** The collection of all the stocks and cash you own.
**Ticker Symbol:** The 1-to-5 letter code that represents a company on the exchange (e.g., TSLA for Tesla).
**Volume:** The total number of a stock's shares that are traded in a single day. High volume validates price movements.
    `
  }
];
