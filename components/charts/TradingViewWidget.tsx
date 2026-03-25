"use client";
import { useEffect, useRef } from 'react';

export default function TradingViewWidget({ 
  symbol, 
  theme = 'dark', 
  height = 450 
}: { 
  symbol: string; 
  theme?: 'dark' | 'light'; 
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      height: height,
      width: "100%",
      studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
    });
    
    containerRef.current.appendChild(script);
    return () => { if (containerRef.current) containerRef.current.innerHTML = ''; };
  }, [symbol, theme, height]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700/30">
      <div ref={containerRef} style={{ height }} />
      <p className="text-xs text-gray-500 text-center py-1 bg-[#131722]/50">
        Chart by TradingView • Educational use only
      </p>
    </div>
  );
}
