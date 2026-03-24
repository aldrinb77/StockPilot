import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tvGreen focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-tvGreen text-white hover:bg-tvGreen/90": variant === "default",
            "border border-gray-700/50 bg-transparent hover:bg-gray-800 text-foreground": variant === "outline",
            "hover:bg-gray-800 hover:text-foreground text-foreground": variant === "ghost",
            "bg-tvRed text-white hover:bg-tvRed/90": variant === "destructive",
            "h-9 px-3": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-11 rounded-md px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
