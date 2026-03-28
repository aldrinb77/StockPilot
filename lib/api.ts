import { StockData, OHLCV } from './types';
import { MOCK_STOCKS, getMockHistoricalData } from './mockData';

// API Configuration
const TWELVE_DATA_KEY = "248473bdca0e4613aa83b1bda1cc1c98"; // Hardcoded from wrangler.toml as envs are tricky in client-side edge builds

// CORS Proxies (Backup only)
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.io/?',
];

let currentProxyIndex = 0;

async function fetchWithFallback(url: string, useProxy: boolean = false): Promise<any> {
  // 1. Try internal API route first (Server-side bypass)
  if (!url.startsWith('http') || url.includes('/api/stock')) {
      try {
          const response = await fetch(url);
          if (response.ok) return await response.json();
      } catch (err) {
          console.warn('Internal API failed, trying proxies...', err);
      }
  }

  // 2. Try proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      const proxy = CORS_PROXIES[currentProxyIndex % CORS_PROXIES.length];
      const proxyUrl = proxy + encodeURIComponent(url);
      currentProxyIndex++;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeout);
      
      if (response.ok) return await response.json();
    } catch (error) {
      console.warn(`Proxy ${i} failed, trying next...`);
    }
  }
  throw new Error('All fetch methods failed');
}

export async function fetchStockQuote(symbol: string): Promise<StockData> {
  // Use Twelve Data for precise quotes if possible (reliable browser CORS)
  // Note: 8 requests/min limit. Dashboard may exhaust this.
  try {
    const tdUrl = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TWELVE_DATA_KEY}`;
    const response = await fetch(tdUrl);
    
    if (response.ok) {
        const data = await response.json();
        if (data.symbol) {
            return {
                symbol: data.symbol,
                name: data.name || symbol,
                sector: '',
                price: parseFloat(data.close || data.price || '0'),
                change: parseFloat(data.change || '0'),
                changePercent: parseFloat(data.percent_change || '0'),
                volume: parseInt(data.volume || '0'),
                high: parseFloat(data.high || '0'),
                low: parseFloat(data.low || '0'),
                open: parseFloat(data.open || '0'),
                prevClose: parseFloat(data.previous_close || '0'),
                marketCap: 0,
                pe: 0,
                eps: 0,
                week52High: parseFloat(data.fifty_two_week?.high || '0'),
                week52Low: parseFloat(data.fifty_two_week?.low || '0'),
            };
        }
    }
  } catch (err) {
    console.warn(`TwelveData failed for ${symbol}, falling back to Yahoo API`, err);
  }

  // Fallback to Yahoo via Server Side API (Edge Runtime)
  try {
    const internalUrl = `/api/stock/${symbol}?range=1d&interval=1m`;
    const data = await fetchWithFallback(internalUrl);
    
    if (data.chart?.result?.[0]) {
        const result = data.chart.result[0];
        const meta = result.meta;
        const quotes = result.indicators.quote[0];
        const lastIndex = (quotes.close?.length || 1) - 1;
        
        return {
          symbol: meta.symbol,
          name: meta.shortName || meta.longName || symbol,
          sector: '',
          price: meta.regularMarketPrice || quotes.close?.[lastIndex] || 0,
          change: (meta.regularMarketPrice - meta.chartPreviousClose) || 0,
          changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100) || 0,
          volume: quotes.volume?.[lastIndex] || 0,
          high: quotes.high?.[lastIndex] || 0,
          low: quotes.low?.[lastIndex] || 0,
          open: quotes.open?.[lastIndex] || 0,
          prevClose: meta.chartPreviousClose || 0,
          marketCap: 0,
          pe: 0,
          eps: 0,
          week52High: meta.fiftyTwoWeekHigh || 0,
          week52Low: meta.fiftyTwoWeekLow || 0,
        };
    }
  } catch (error) {
    console.error(`Failed all fetch methods for ${symbol}:`, error);
  }
  
  return getMockQuote(symbol);
}

export async function fetchHistoricalData(
  symbol: string,
  range: string = '6mo',
  interval: string = '1d'
): Promise<OHLCV[]> {
  try {
    const internalUrl = `/api/stock/${symbol}?range=${range}&interval=${interval}`;
    const data = await fetchWithFallback(internalUrl);
    
    if (data.chart?.result?.[0]) {
        const result = data.chart.result[0];
        const timestamps = result.timestamp || [];
        const quotes = result.indicators.quote[0];
        
        return timestamps.map((time: number, i: number) => ({
          time: time,
          open: quotes.open[i] || 0,
          high: quotes.high[i] || 0,
          low: quotes.low[i] || 0,
          close: quotes.close[i] || 0,
          volume: quotes.volume[i] || 0,
        })).filter((bar: any) => bar.close > 0);
    }
    throw new Error('Malformed historical data');
  } catch (error) {
    console.warn(`Failed history for ${symbol}, trying direct Yahoo with proxy...`, error);
    try {
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        const data = await fetchWithFallback(yahooUrl, true);
        const result = data.chart.result[0];
        const timestamps = result.timestamp || [];
        const quotes = result.indicators.quote[0];
        return timestamps.map((time: number, i: number) => ({
            time: time, open: quotes.open[i] || 0, high: quotes.high[i] || 0, low: quotes.low[i] || 0, close: quotes.close[i] || 0, volume: quotes.volume[i] || 0
        })).filter((bar: any) => bar.close > 0);
    } catch (err2) {
        return getMockHistorical(symbol);
    }
  }
}

export async function fetchMultipleQuotes(symbols: string[]): Promise<StockData[]> {
  // Use parallel fetch via our internal API which is reliable
  const promises = symbols.map(s => fetchStockQuote(s));
  const results = await Promise.allSettled(promises);
  
  return results.map((result, i) => {
    if (result.status === 'fulfilled') return result.value;
    return getMockQuote(symbols[i]);
  });
}

export async function searchStocks(query: string): Promise<{symbol: string, name: string}[]> {
    if (!query) return [];
    try {
        // Use a generic proxy search
        const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;
        const data = await fetchWithFallback(url, true);
        if (data.quotes) {
            return data.quotes.map((q: any) => ({
                symbol: q.symbol,
                name: q.shortname || q.longname || q.symbol
            })).slice(0, 5);
        }
        return [];
    } catch (err) {
        return [];
    }
}

function getMockQuote(symbol: string): StockData {
  const mockStock = MOCK_STOCKS.find(s => s.symbol === symbol);
  if (mockStock) return mockStock;
  
  const basePrice = 150 + Math.random() * 50;
  const mockPrice = basePrice + (Math.random() * (basePrice * 0.01));
  const mockChange = (Math.random() * (basePrice * 0.02)) - (basePrice * 0.01);
  
  return {
    symbol,
    name: symbol,
    sector: 'Stock',
    price: mockPrice,
    change: mockChange,
    changePercent: (mockChange / (mockPrice - mockChange)) * 100,
    volume: 1000000 + Math.floor(Math.random() * 5000000),
    high: mockPrice + (basePrice * 0.005),
    low: mockPrice - (basePrice * 0.005),
    open: mockPrice - mockChange,
    prevClose: mockPrice - mockChange,
    marketCap: 0,
    pe: 0,
    eps: 0
  };
}

function getMockHistorical(symbol: string): OHLCV[] {
  const stock = MOCK_STOCKS.find(s => s.symbol === symbol) || MOCK_STOCKS[0];
  return getMockHistoricalData(stock.price);
}
