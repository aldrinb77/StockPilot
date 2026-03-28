import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const range = searchParams.get('range') || '1d';
  const interval = searchParams.get('interval') || '1m';

  if (!symbol) {
    return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });
  }

  try {
    // Attempt 1: Standard Yahoo Finance Chart API
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
    
    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://finance.yahoo.com',
        'Referer': 'https://finance.yahoo.com',
      },
      next: { revalidate: 30 }
    });

    if (!response.ok) {
        console.error(`Yahoo API error for ${symbol}: ${response.status}`);
        if (response.status === 404) {
            return NextResponse.json({ error: 'Ticker not found' }, { status: 404 });
        }
        throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Route Final Exception:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
