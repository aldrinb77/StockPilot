"use client";
import { motion } from 'framer-motion';

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = 'up' 
}: { 
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={className}
      variants={{
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
    >
      {children}
    </motion.div>
  );
}
