import { StockData, OHLCV } from './types';
import { POPULAR_STOCKS } from './constants';

export async function fetchStockQuote(symbol: string): Promise<StockData> {
  try {
    const res = await fetch(`/api/stock/${symbol}?range=1d&interval=1d`);
    if (!res.ok) throw new Error('Network response was not ok');
    
    const data = await res.json();
    
    if (data.error || !data.chart?.result?.[0]) {
      throw new Error(data.error || 'Invalid data structure');
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];
    
    const price = meta.regularMarketPrice || 0;
    const prevClose = meta.previousClose || 0;
    const change = price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
    
    // Attempt to match symbol to getting name & sector
    const popular = POPULAR_STOCKS.find(s => s.symbol === symbol);

    return {
      symbol,
      name: popular?.name || symbol,
      sector: popular?.sector || 'Unknown',
      price,
      change,
      changePercent,
      volume: quote?.volume?.[quote.volume.length - 1] || meta.regularMarketVolume || 0,
      high: meta.regularMarketDayHigh || quote?.high?.[quote.high.length - 1] || 0,
      low: meta.regularMarketDayLow || quote?.low?.[quote.low.length - 1] || 0,
      open: meta.regularMarketDayOpen || quote?.open?.[quote.open.length - 1] || price,
      prevClose,
    };
  } catch (error) {
    console.warn(`[fetchStockQuote] Failed for ${symbol}, using mock data`, error);
    return getMockQuote(symbol);
  }
}

export async function fetchHistoricalData(symbol: string, range: string, interval: string): Promise<OHLCV[]> {
  try {
    const res = await fetch(`/api/stock/${symbol}?range=${range}&interval=${interval}`);
    if (!res.ok) throw new Error('Network response was not ok');
    
    const data = await res.json();
    if (data.error || !data.chart?.result?.[0]) {
      throw new Error(data.error || 'Invalid history structure');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};
    
    const ohlcv: OHLCV[] = [];
    
    for (let i = 0; i < timestamps.length; i++) {
      if (
        quote.open?.[i] !== null && quote.open?.[i] !== undefined &&
        quote.high?.[i] !== null &&
        quote.low?.[i] !== null &&
        quote.close?.[i] !== null
      ) {
        ohlcv.push({
          time: timestamps[i],
          open: quote.open[i],
          high: quote.high[i],
          low: quote.low[i],
          close: quote.close[i],
          volume: quote.volume?.[i] || 0
        });
      }
    }
    
    return ohlcv.sort((a, b) => a.time - b.time);
  } catch (error) {
    console.warn(`[fetchHistoricalData] Failed for ${symbol}`, error);
    return [];
  }
}

export async function fetchMultipleQuotes(symbols: string[]): Promise<StockData[]> {
  const promises = symbols.map(sym => fetchStockQuote(sym));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((res): res is PromiseFulfilledResult<StockData> => res.status === 'fulfilled')
    .map(res => res.value);
}

export async function searchStocks(query: string): Promise<{symbol: string, name: string}[]> {
  if (!query) return [];
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return await res.json();
  } catch (err) {
    const qLower = query.toLowerCase();
    return POPULAR_STOCKS.filter(stock => 
      stock.symbol.toLowerCase().includes(qLower) || 
      stock.name.toLowerCase().includes(qLower)
    ).slice(0, 5);
  }
}

function getMockQuote(symbol: string): StockData {
  const mockPrice = 150 + Math.random() * 50;
  const mockChange = (Math.random() * 10) - 5;
  const popular = POPULAR_STOCKS.find(s => s.symbol === symbol);
  
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
