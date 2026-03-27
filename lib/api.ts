import { StockData, OHLCV } from './types';
import { MOCK_STOCKS, getMockHistoricalData } from './mockData';

const YAHOO_BASE = 'https://query1.finance.yahoo.com';

// Use a CORS proxy for client-side fetching
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
];

let currentProxyIndex = 0;

function getProxyUrl(url: string): string {
  const proxy = CORS_PROXIES[currentProxyIndex % CORS_PROXIES.length];
  return proxy + encodeURIComponent(url);
}

async function fetchWithProxy(url: string): Promise<any> {
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      const proxyUrl = getProxyUrl(url);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeout);
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      currentProxyIndex++;
      console.warn(`Proxy ${i} failed, trying next...`);
    }
  }
  throw new Error('All proxies failed');
}

export async function fetchStockQuote(symbol: string): Promise<StockData> {
  try {
    const url = `${YAHOO_BASE}/v8/finance/chart/${symbol}?interval=1d&range=5d`;
    const data = await fetchWithProxy(url);
    
    const result = data.chart.result[0];
    const meta = result.meta;
    const quotes = result.indicators.quote[0];
    const lastIndex = quotes.close.length - 1;
    
    return {
      symbol: meta.symbol,
      name: meta.shortName || meta.longName || symbol,
      sector: '',
      price: meta.regularMarketPrice || quotes.close[lastIndex],
      change: (meta.regularMarketPrice - meta.chartPreviousClose) || 0,
      changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100) || 0,
      volume: quotes.volume[lastIndex] || 0,
      high: quotes.high[lastIndex] || 0,
      low: quotes.low[lastIndex] || 0,
      open: quotes.open[lastIndex] || 0,
      prevClose: meta.chartPreviousClose || 0,
      marketCap: 0,
      pe: 0,
      eps: 0,
      week52High: meta.fiftyTwoWeekHigh || 0,
      week52Low: meta.fiftyTwoWeekLow || 0,
    };
  } catch (error) {
    console.error(`Failed to fetch ${symbol}:`, error);
    return getMockQuote(symbol);
  }
}

export async function fetchHistoricalData(
  symbol: string,
  range: string = '6mo',
  interval: string = '1d'
): Promise<OHLCV[]> {
  try {
    const url = `${YAHOO_BASE}/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
    const data = await fetchWithProxy(url);
    
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    
    return timestamps.map((time: number, i: number) => ({
      time: time,
      open: quotes.open[i] || 0,
      high: quotes.high[i] || 0,
      low: quotes.low[i] || 0,
      close: quotes.close[i] || 0,
      volume: quotes.volume[i] || 0,
    })).filter((bar: any) => bar.close > 0);
  } catch (error) {
    console.error(`Failed to fetch history for ${symbol}:`, error);
    return getMockHistorical(symbol);
  }
}

export async function fetchMultipleQuotes(symbols: string[]): Promise<StockData[]> {
  // Fetch all in parallel (no rate limit for Yahoo)
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
        const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;
        const data = await fetchWithProxy(url);
        return data.quotes.map((q: any) => ({
            symbol: q.symbol,
            name: q.shortname || q.longname || q.symbol
        })).slice(0, 5);
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
