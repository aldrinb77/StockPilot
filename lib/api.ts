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

export async function fetchStockQuote(symbol: string, market: MarketRegion = 'US'): Promise<StockData> {
  const config = MARKETS[market];
  const fullSymbol = getSymbolWithSuffix(symbol, market);
  const popular = config.popularStocks.find(s => s.symbol === fullSymbol || s.symbol === symbol);
  
  // 1. Try Twelve Data
  try {
    const tdKey = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY;
    if (tdKey) {
      const res = await fetchWithTimeout(`https://api.twelvedata.com/quote?symbol=${fullSymbol}&apikey=${tdKey}`);
      const data = await res.json();
      if (!data.code && data.close) {
        return {
          symbol: fullSymbol,
          name: popular?.name || data.name || fullSymbol,
          sector: popular?.sector || 'Unknown',
          price: parseFloat(data.close),
          change: parseFloat(data.change),
          changePercent: parseFloat(data.percent_change),
          volume: parseInt(data.volume) || 0,
          high: parseFloat(data.high),
          low: parseFloat(data.low),
          open: parseFloat(data.open),
          prevClose: parseFloat(data.previous_close)
        };
      }
    }
  } catch (e) { console.warn('Twelve Data limit reached'); }

  // 2. Try Finnhub (Suffix logic might differ but we follow the request)
  try {
    const fhKey = process.env.NEXT_PUBLIC_FINNHUB_KEY;
    if (fhKey) {
      const res = await fetchWithTimeout(`https://finnhub.io/api/v1/quote?symbol=${fullSymbol}&token=${fhKey}`);
      const data = await res.json();
      if (data && data.c) {
        return {
          symbol: fullSymbol,
          name: popular?.name || fullSymbol,
          sector: popular?.sector || 'Unknown',
          price: data.c,
          change: data.d,
          changePercent: data.dp,
          volume: 0,
          high: data.h,
          low: data.l,
          open: data.o,
          prevClose: data.pc
        };
      }
    }
  } catch (e) { console.warn('Finnhub limit reached'); }

  // 3. Try Alpha Vantage
  try {
    const avKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;
    if (avKey) {
      const res = await fetchWithTimeout(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${fullSymbol}&apikey=${avKey}`);
      const data = await res.json();
      const quote = data['Global Quote'];
      if (quote && quote['05. price']) {
        return {
          symbol: fullSymbol,
          name: popular?.name || fullSymbol,
          sector: popular?.sector || 'Unknown',
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          high: parseFloat(quote['03. high']),
          low: parseFloat(quote['04. low']),
          open: parseFloat(quote['02. open']),
          prevClose: parseFloat(quote['08. previous close'])
        };
      }
    }
  } catch (e) { console.warn('Alpha Vantage limit reached'); }

  // 4. Fallback to Mock Data (Safe Educational Fallback)
  console.log(`[API Fallback] Using secure educational mock data for ${fullSymbol}`);
  return getMockQuote(fullSymbol, market);
}

export async function fetchHistoricalData(symbol: string, market: MarketRegion = 'US', range: string = 'ytd', interval: string = '1d'): Promise<OHLCV[]> {
  const fullSymbol = getSymbolWithSuffix(symbol, market);
  
  // 1. Try Twelve Data Time Series
  try {
    const tdKey = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY;
    if (tdKey) {
      const res = await fetchWithTimeout(`https://api.twelvedata.com/time_series?symbol=${fullSymbol}&interval=${interval}&outputsize=200&apikey=${tdKey}`);
      const data = await res.json();
      if (data.values && data.values.length > 0) {
        return data.values.reverse().map((v: any) => ({
          time: new Date(v.datetime).getTime() / 1000,
          open: parseFloat(v.open),
          high: parseFloat(v.high),
          low: parseFloat(v.low),
          close: parseFloat(v.close),
          volume: parseInt(v.volume)
        }));
      }
    }
  } catch (e) { console.warn('Twelve Data history limit reached'); }

  // Fallback to secure educational mock data
  console.log(`[API Fallback] Using secure educational historical mock data for ${fullSymbol}`);
  const stock = MOCK_STOCKS.find(s => s.symbol === fullSymbol) || MOCK_STOCKS[0];
  return getMockHistoricalData(stock.price);
}

export async function fetchMultipleQuotes(symbols: string[], market: MarketRegion = 'US'): Promise<StockData[]> {
  const promises = symbols.map(sym => fetchStockQuote(sym, market));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((res): res is PromiseFulfilledResult<StockData> => res.status === 'fulfilled')
    .map(res => res.value);
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

function getMockQuote(symbol: string, market: MarketRegion = 'US'): StockData {
  const config = MARKETS[market];
  const mockStock = MOCK_STOCKS.find(s => s.symbol === symbol);
  if (mockStock) return mockStock;
  
  const mockPrice = 150 + Math.random() * 50;
  const mockChange = (Math.random() * 10) - 5;
  const popular = config.popularStocks.find(s => s.symbol === symbol);
  
  return {
    symbol,
    name: popular?.name || symbol,
    sector: popular?.sector || 'Unknown',
    price: mockPrice,
    change: mockChange,
    changePercent: (mockChange / (mockPrice - mockChange)) * 100,
    volume: 1000000 + Math.floor(Math.random() * 5000000),
    high: mockPrice + 5,
    low: mockPrice - 5,
    open: mockPrice - mockChange,
    prevClose: mockPrice - mockChange
  };
}
