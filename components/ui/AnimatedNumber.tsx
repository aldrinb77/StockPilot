"use client"

import { useEffect, useRef } from "react"
import { useMotionValue, useSpring, useInView, animate } from "framer-motion"

export function AnimatedNumber({ 
  value, 
  prefix = "", 
  suffix = "", 
  decimals = 0 
}: { 
  value: number, 
  prefix?: string, 
  suffix?: string, 
  decimals?: number 
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration: 1 })
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`
      }
    })
  }, [springValue, prefix, suffix, decimals])

  return <span ref={ref} className="tabular-numbers" />
}
