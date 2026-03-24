import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface SignalBadgeProps {
  type: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL'
  className?: string
}

export function SignalBadge({ type, className }: SignalBadgeProps) {
  let variant: 'success' | 'warning' | 'danger' = 'warning';
  let dot = '🟡';
  let label = 'HOLD';

  if (type === 'STRONG_BUY') { variant = 'success'; dot = '🟢'; label = 'STRONG BUY'; }
  else if (type === 'BUY') { variant = 'success'; dot = '🟢'; label = 'BUY'; }
  else if (type === 'SELL') { variant = 'danger'; dot = '🔴'; label = 'SELL'; }
  else if (type === 'STRONG_SELL') { variant = 'danger'; dot = '🔴'; label = 'STRONG SELL'; }

  return (
    <Badge variant={variant} className={cn("text-sm py-1 px-3 space-x-1.5 shadow-sm", className)}>
      <span>{dot}</span>
      <span className="font-bold tracking-wide">{label}</span>
    </Badge>
  )
}
