import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface SignalBadgeProps {
  type: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH'
  className?: string
}

export function SignalBadge({ type, className }: SignalBadgeProps) {
  let variant: 'success' | 'warning' | 'danger' = 'warning';
  let dot = '🟡';
  let label = 'HOLD';

  if (type === 'STRONG_BULLISH') { variant = 'success'; dot = '🟢'; label = 'STRONG BULLISH'; }
  else if (type === 'BULLISH') { variant = 'success'; dot = '🟢'; label = 'BULLISH'; }
  else if (type === 'BEARISH') { variant = 'danger'; dot = '🔴'; label = 'BEARISH'; }
  else if (type === 'STRONG_BEARISH') { variant = 'danger'; dot = '🔴'; label = 'STRONG BEARISH'; }

  return (
    <Badge variant={variant} className={cn("text-sm py-1 px-3 space-x-1.5 shadow-sm", className)}>
      <span>{dot}</span>
      <span className="font-bold tracking-wide">{label}</span>
    </Badge>
  )
}
