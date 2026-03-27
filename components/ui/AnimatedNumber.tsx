"use client";
import { useEffect, useRef, useState } from 'react';

export function AnimatedNumber({ 
  value, 
  prefix = '', 
  suffix = '', 
  decimals = 2,
  duration = 1000 
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef(Date.now());
  const startValue = useRef(0);
  
  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      const current = startValue.current + (value - startValue.current) * eased;
      setDisplayValue(current);
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className="tabular-nums font-mono">
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}
