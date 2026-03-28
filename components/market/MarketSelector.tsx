"use client";

import { useStore } from "@/store/store";
import { MARKETS, MarketRegion } from "@/lib/markets";
import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const MarketSelector = () => {
  const { selectedMarket, setSelectedMarket } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const marketList = Object.values(MARKETS);
  const currentMarket = MARKETS[selectedMarket];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mr-2" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#1E222D] border border-gray-700/50 hover:border-tvGreen/50 rounded-lg transition-all active:scale-95 group shadow-sm"
      >
        <span className="text-lg">{currentMarket.flag}</span>
        <span className="text-xs font-bold text-gray-200 group-hover:text-white uppercase tracking-wider">
          {currentMarket.currency}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full z-50 w-64 mt-2 overflow-hidden bg-[#1E222D]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/40"
          >
            <div className="p-3 border-b border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Select Market</h3>
            </div>
            
            <div className="py-1 max-h-[350px] overflow-y-auto custom-scrollbar">
              {marketList.map((m) => {
                const isActive = selectedMarket === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMarket(m.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all ${
                      isActive 
                        ? 'bg-tvGreen/10 border-l-2 border-tvGreen' 
                        : 'hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{m.flag}</span>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isActive ? 'text-tvGreen' : 'text-gray-200'}`}>
                          {m.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {m.currency} ({m.currencySymbol})
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-tvGreen" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="p-3 bg-black/20 border-t border-white/5">
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                App layout and signals will update to reflect {currentMarket.name} market standards.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
