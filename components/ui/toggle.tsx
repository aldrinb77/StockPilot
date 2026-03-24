import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
        <input type="checkbox" className="sr-only peer" ref={ref} {...props} />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-tvGreen rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tvGreen"></div>
        {label && <span className="ml-3 text-sm font-medium text-foreground">{label}</span>}
      </label>
    )
  }
)
Toggle.displayName = "Toggle"

export { Toggle }
