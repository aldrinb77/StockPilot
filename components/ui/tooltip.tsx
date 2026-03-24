import * as React from "react"
import { cn } from "@/lib/utils"

export function Tooltip({
  content,
  children,
}: {
  content: string
  children: React.ReactNode
}) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm tooltip dark:bg-gray-700 whitespace-nowrap top-full mt-1 left-1/2 -translate-x-1/2 pointer-events-none fade-in">
          {content}
        </div>
      )}
    </div>
  )
}
