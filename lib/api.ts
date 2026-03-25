import { StockData, OHLCV } from './types';
import { POPULAR_STOCKS } from './constants';
import { MOCK_STOCKS, getMockHistoricalData } from './mockData';
import { MarketRegion, MARKETS } from './markets';

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

export async function fetchStockQuote(symbol: string): Promise<StockData & { isMockData?: boolean }> {
  const apiKey = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;
  
  if (!apiKey) {
    console.warn('No API key found, using mock data');
    const mock = getMockQuote(symbol);
    return { ...mock, isMockData: true };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('API response not ok');
    
    const data = await response.json();
    
    if (data.code === 400 || data.status === 'error') {
      throw new Error(data.message || 'API error');
    }

    return {
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
  } catch (error) {
    console.warn(`Failed to fetch quote for ${symbol}:`, error);
    const mock = getMockQuote(symbol);
    return { ...mock, isMockData: true };
  }
}

export async function fetchHistoricalData(
  symbol: string, 
  range: string = '3mo',
  interval: string = '1day'
): Promise<OHLCV[]> {
  const apiKey = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;
  
  if (!apiKey) {
    return getMockHistorical(symbol);
  }

  // Map range to outputsize
  const sizeMap: Record<string, number> = {
    '1mo': 30, '3mo': 90, '6mo': 180, '1y': 365, '5y': 500
  };
  const outputsize = sizeMap[range] || 200;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

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
  
  for (let i = 0; i < symbols.length; i++) {
    try {
      const quote = await fetchStockQuote(symbols[i]);
      results.push(quote);
      
      // Rate limit: wait 1 second between requests
      if (i < symbols.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
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
  
  const mockPrice = 150 + Math.random() * 50;
  const mockChange = (Math.random() * 10) - 5;
  
  return {
    symbol,
    name: symbol,
    sector: 'Unknown',
    price: mockPrice,
    change: mockChange,
    changePercent: (mockChange / (mockPrice - mockChange)) * 100,
    volume: 1000000 + Math.floor(Math.random() * 5000000),
    high: mockPrice + 5,
    low: mockPrice - 5,
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
