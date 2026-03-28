"use client"

import { motion } from "framer-motion"

export function AnimatedGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 animated-grid animate-grid-pulse opacity-[0.03]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-transparent to-transparent opacity-80" />
      
      {/* Floating Alpha Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
           key={i}
           initial={{ 
             opacity: 0, 
             x: Math.random() * 100 + "%", 
             y: Math.random() * 100 + "%" 
           }}
           animate={{ 
             opacity: [0, 0.15, 0],
             y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
             x: [Math.random() * 100 + "%", Math.random() * 100 + "%"]
           }}
           transition={{
             duration: 10 + Math.random() * 20,
             repeat: Infinity,
             ease: "linear"
           }}
           className="absolute w-1 h-1 bg-[#00e676] rounded-full blur-[2px]"
        />
      ))}
    </div>
  )
}
