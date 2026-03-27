import { StockData, OHLCV } from './types';
import { POPULAR_STOCKS } from './constants';
import { MOCK_STOCKS, getMockHistoricalData } from './mockData';
import { MarketRegion, MARKETS } from './markets';
import { TWELVE_DATA_API_KEY } from './apiConfig';

const CACHE_KEY_PREFIX = 'stoxpilot_quote_';
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

function getCachedQuote(symbol: string): StockData | null {
  if (typeof window === 'undefined') return null;
  const cached = sessionStorage.getItem(`${CACHE_KEY_PREFIX}${symbol}`);
  if (!cached) return null;
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_TIME) {
    sessionStorage.removeItem(`${CACHE_KEY_PREFIX}${symbol}`);
    return null;
  }
  return data;
}

function setCachedQuote(symbol: string, data: StockData) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`${CACHE_KEY_PREFIX}${symbol}`, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
}

function getSymbolWithSuffix(symbol: string, market: MarketRegion): string {
  const config = MARKETS[market];
  if (!config.symbolSuffix) return symbol;
  if (symbol.endsWith(config.symbolSuffix)) return symbol;
  return `${symbol}${config.symbolSuffix}`;
}

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function fetchStockQuote(symbol: string, skipCache = false): Promise<StockData & { isMockData?: boolean }> {
  if (!skipCache) {
    const cached = getCachedQuote(symbol);
    if (cached) return cached;
  }

  if (!TWELVE_DATA_API_KEY || (TWELVE_DATA_API_KEY as string) === "PASTE_YOUR_KEY_HERE") {
    console.warn('Twelve Data API Key not configured correctly in /lib/apiConfig.ts');
    return { ...getMockQuote(symbol), isMockData: true };
  }

  try {
    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${TWELVE_DATA_API_KEY}`
    );

    if (!response.ok) throw new Error('API response not ok');
    
    const data = await response.json();
    
    if (data.code === 400 || data.status === 'error') {
      throw new Error(data.message || 'API error');
    }

    const result = {
      symbol: data.symbol || symbol,
      name: data.name || symbol,
      sector: '',
      price: parseFloat(data.close) || 0,
      change: parseFloat(data.change) || 0,
      changePercent: parseFloat(data.percent_change) || 0,
      volume: parseInt(data.volume) || 0,
      high: parseFloat(data.high) || 0,
      low: parseFloat(data.low) || 0,
      open: parseFloat(data.open) || 0,
      prevClose: parseFloat(data.previous_close) || 0,
      marketCap: 0,
      pe: 0,
      eps: 0,
      week52High: parseFloat(data.fifty_two_week?.high) || 0,
      week52Low: parseFloat(data.fifty_two_week?.low) || 0,
    };

    setCachedQuote(symbol, result);
    return result;
  } catch (error) {
    console.warn(`Failed to fetch quote for ${symbol}:`, error);
    return { ...getMockQuote(symbol), isMockData: true };
  }
}

export async function fetchHistoricalData(
  symbol: string, 
  range: string = '3mo',
  interval: string = '1day'
): Promise<OHLCV[]> {
  if (!TWELVE_DATA_API_KEY || (TWELVE_DATA_API_KEY as string) === "PASTE_YOUR_KEY_HERE") {
    return getMockHistorical(symbol);
  }

  // Map range to outputsize
  const sizeMap: Record<string, number> = {
    '1mo': 30, '3mo': 90, '6mo': 180, '1y': 365, '5y': 500
  };
  const outputsize = sizeMap[range] || 200;

  try {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVE_DATA_API_KEY}`
    );

    if (!response.ok) throw new Error('API failed');
    
    const data = await response.json();
    
    if (data.code === 400 || data.status === 'error' || !data.values) {
      throw new Error(data.message || 'No data');
    }

    return data.values.map((bar: any) => ({
      time: new Date(bar.datetime).getTime() / 1000,
      open: parseFloat(bar.open),
      high: parseFloat(bar.high),
      low: parseFloat(bar.low),
      close: parseFloat(bar.close),
      volume: parseInt(bar.volume) || 0,
    })).reverse(); // Oldest first
  } catch (error) {
    console.warn(`Failed to fetch history for ${symbol}:`, error);
    return getMockHistorical(symbol);
  }
}

export async function fetchMultipleQuotes(
  symbols: string[]
): Promise<(StockData & { isMockData?: boolean })[]> {
  const results: (StockData & { isMockData?: boolean })[] = [];
  
  // To avoid hitting Twelve Data free tier limits (8 req/min)
  // we only fetch the first 5 stocks in common lists (screener/dashboard)
  // The rest are mocked for performance
  for (let i = 0; i < symbols.length; i++) {
    try {
      if (i < 5) {
        const quote = await fetchStockQuote(symbols[i]);
        results.push(quote);
        
        // Rate limit within individual requests: wait 1.2s between calls to stay under 8/min
        if (i < 4 && i < symbols.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
      } else {
        // Mock the rest of the list
        results.push({ ...getMockQuote(symbols[i]), isMockData: true });
      }
    } catch (error) {
      const mock = getMockQuote(symbols[i]);
      results.push({ ...mock, isMockData: true });
    }
  }
  
  return results;
}

export async function searchStocks(query: string, market: MarketRegion = 'US'): Promise<{symbol: string, name: string}[]> {
  if (!query) return [];
  const qLower = query.toLowerCase();
  const config = MARKETS[market];
  
  return config.popularStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(qLower) || 
    stock.name.toLowerCase().includes(qLower)
  ).slice(0, 5);
}

function getMockQuote(symbol: string): StockData {
  const mockStock = MOCK_STOCKS.find(s => s.symbol === symbol);
  if (mockStock) return mockStock;
  
  // Provide realistic starting prices for common indices if mock
  let basePrice = 150 + Math.random() * 50;
  if (symbol.includes('GSPC') || symbol.includes('SPX')) basePrice = 5200;
  if (symbol.includes('IXIC') || symbol.includes('NDX')) basePrice = 16000;
  if (symbol.includes('DJI')) basePrice = 39000;
  if (symbol.includes('NIFTY50') || symbol.includes('NSEI')) basePrice = 22500;
  if (symbol.includes('SENSEX') || symbol.includes('BSESN')) basePrice = 74000;
  if (symbol.includes('BANKNIFTY')) basePrice = 48000;
  if (symbol.includes('NIFTYIT')) basePrice = 35000;
  if (symbol.includes('FTSE')) basePrice = 79000;
  if (symbol.includes('DAX') || symbol.includes('GDAXI')) basePrice = 18000;
  
  const mockPrice = basePrice + (Math.random() * (basePrice * 0.01));
  const mockChange = (Math.random() * (basePrice * 0.02)) - (basePrice * 0.01);
  
  return {
    symbol,
    name: symbol,
    sector: 'Index / Sector',
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
