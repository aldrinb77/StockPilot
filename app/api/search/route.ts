import { NextResponse } from 'next/server';
import { POPULAR_STOCKS } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json([]);
  }

  const results = POPULAR_STOCKS.filter(stock => 
    stock.symbol.toLowerCase().includes(query) || 
    stock.name.toLowerCase().includes(query)
  ).slice(0, 10);

  return NextResponse.json(results);
}
