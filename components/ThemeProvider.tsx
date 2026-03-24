"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useStore } from "@/store/store"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark")
  const { appearance } = useStore()

  useEffect(() => {
    const root = window.document.documentElement
    
    // Handle Theme Mode
    root.classList.remove("light", "dark")
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Handle Accent Color
    root.style.setProperty('--accent-color', appearance.accentColor)
    
    // Handle Font Size
    root.classList.remove("font-small", "font-medium", "font-large")
    root.classList.add(`font-${appearance.fontSize}`)

    // Handle Card Style (Apply as attribute for universal selector usage)
    root.setAttribute('data-card-style', appearance.cardStyle)

  }, [theme, appearance])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
