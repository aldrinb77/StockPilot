"use client";
import { useState, useEffect } from 'react';
import { isGodMode } from '@/lib/simpleAuth';

export function useAppMode() {
  const [godMode, setGodMode] = useState(false);

  useEffect(() => {
    setGodMode(isGodMode());

    const handleStorage = () => {
      setGodMode(isGodMode());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    isGodMode: godMode,
    refreshMode: () => setGodMode(isGodMode()),
  };
}
