"use client"

import { motion } from "framer-motion"

export function AnimatedGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 animated-grid opacity-[0.03]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-transparent to-transparent opacity-80" />
      
      <style jsx>{`
        .animated-grid {
          background-image: radial-gradient(
            circle, #00e676 1px, transparent 1px
          );
          background-size: 40px 40px;
          animation: gridPulse 8s ease-in-out infinite;
        }

        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
      
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
