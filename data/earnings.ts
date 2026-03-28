export interface EarningsEvent {
  symbol: string;
  name: string;
  date: string;
  time: 'Before Open' | 'After Close';
  type: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Meeting' | 'Dividend' | 'Holiday';
  expectedEPS?: string;
  status?: string;
}

export const EARNINGS_DATA: EarningsEvent[] = [
  // India - Upcoming
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', date: '2026-04-20', time: 'After Close', type: 'Q4', expectedEPS: '₹18.4' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', date: '2026-04-12', time: 'After Close', type: 'Q4', expectedEPS: '₹68.5' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', date: '2026-04-18', time: 'After Close', type: 'Q4', expectedEPS: '₹12.2' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd.', date: '2026-04-14', time: 'Before Open', type: 'Q4', expectedEPS: '₹15.8' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', date: '2026-04-22', time: 'After Close', type: 'Q4', expectedEPS: '₹11.1' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', date: '2026-05-10', time: 'After Close', type: 'Q4' },
  { symbol: 'WIPRO.NS', name: 'Wipro Ltd.', date: '2026-04-16', time: 'Before Open', type: 'Q4' },
  
  // US - Upcoming
  { symbol: 'AAPL', name: 'Apple Inc.', date: '2026-04-28', time: 'After Close', type: 'Q2', expectedEPS: '$1.42' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', date: '2026-04-26', time: 'After Close', type: 'Q3', expectedEPS: '$2.82' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', date: '2026-04-25', time: 'After Close', type: 'Q1' },
  { symbol: 'TSLA', name: 'Tesla Inc.', date: '2026-04-19', time: 'After Close', type: 'Q1' },
  { symbol: 'AMZN', name: 'Amazon.com', date: '2026-04-27', time: 'After Close', type: 'Q1' },
  
  // Market Events
  { symbol: 'RBI', name: 'RBI Policy Meeting', date: '2026-04-05', time: 'Before Open', type: 'Meeting' },
  { symbol: 'FED', name: 'FOMC Interest Rate Decision', date: '2026-03-31', time: 'After Close', type: 'Meeting' },
  { symbol: 'USA', name: 'Good Friday - Market Holiday', date: '2026-04-03', time: 'Before Open', type: 'Holiday' },
  { symbol: 'IND', name: 'Mahavir Jayanti - Market Holiday', date: '2026-04-03', time: 'Before Open', type: 'Holiday' },
];
