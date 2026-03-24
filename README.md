# 📈 StoxPilot 

**Mathematical Rule-Based Free Stock Signal Engine**

StoxPilot is an intensive, completely algorithmic educational platform explicitly stripping out "guesswork", "AI generation", and abstract predictions, replacing them exclusively with hard-coded classical momentum/volatility mathematical arrays. Every aspect of the UI is optimized globally leveraging high-performance `Next.js 14`, local client boundaries leveraging `Zustand` persistent logic, and fully rendered explicit TradingView graphics.

> **⚠️ DISCLAIMER:** This isolated MVP maps mocked Yahoo proxy data and bounds signals entirely based on `technicalindicators`. It does NOT offer legal or professional financial advice. Past patterns implicitly do not map future alignment. Trade explicitly at your own local risk.

---

## 🔥 Features
* **Spoon-Fed Signals Structure:** Instantly calculates Entry Boundaries, Risk Level triggers via True Range variants, and explicit 1:3 RR conditional Technical Levels.
* **100% Free / ZERO AI Engine:** All evaluations (RSI bounds checks, MACD crosses, Sub-Pivot support breaks, Standard Deviations bounding) run locally directly through formulas.
* **Official TradingView Charts:** Built around the Professional TradingView Advanced Chart Widget visualizing Candlesticks alongside injected layers dynamically.
* **Screener & Study Lists:** Efficiently traverse and sort the universe filtering conditionally mapping specifically directly into localized `Zustand` hooks locally caching immediately.
* **Strategy Sandbox:** Model hypothetical setups and track their mathematical outcomes over time.

## ⚙️ Tech Stack Structure
* **Core:** Next.js 14 (App router) / React 18 / TypeScript
* **State Operations:** Zustand + Persist Middleware (LocalStorage)
* **Styling Matrix:** Tailwind CSS v3 / Framer Motion / Lucide-React
* **Calculations:** `technicalindicators` / `yahoo-finance2`
* **Charting Native Tools:** `react-ts-tradingview-widgets`
* **Auth:** Clerk

---

## 🚀 Running Locally

1. **Install Configuration Matrices:**
   ```bash
   npm install
   ```

2. **Boot the Edge Sandbox Server:**
   ```bash
   npm run dev
   ```

3. **Explore Dashboard:**
   Visit `http://localhost:3000` locally.

## 🌐 Deploying to Vercel
Because tracking endpoints operate inside Next.js wrappers via Serverless proxies passing exact arrays natively, it requires absolutely zero environmental `.env` configs for MVP fallback functionality mapping dynamically.

Simply click on your GitHub repository utilizing the native **Vercel** Import:
1. Hit **Add New Project**.
2. Select repository bounds.
3. Deploy instantly (The builder utilizes standard `npm build`).
