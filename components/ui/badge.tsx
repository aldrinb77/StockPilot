import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "danger" | "warning" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-tvGreen focus:ring-offset-2",
        {
          "bg-gray-800 text-foreground border border-transparent": variant === "default",
          "bg-tvGreen/20 text-tvGreen border border-transparent": variant === "success",
          "bg-tvRed/20 text-tvRed border border-transparent": variant === "danger",
          "bg-yellow-500/20 text-yellow-500 border border-transparent": variant === "warning",
          "text-foreground border border-gray-700/50": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
