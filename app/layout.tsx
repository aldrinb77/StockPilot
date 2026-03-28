import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/layout/Sidebar"
import TopBar from "@/components/layout/TopBar"
import MobileNav from "@/components/layout/MobileNav"
import { ThemeProvider } from "@/components/ThemeProvider"
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow"
import { CommandPalette } from "@/components/ui/CommandPalette"
import { Footer } from "@/components/layout/Footer"
import { AnimatedGrid } from "@/components/ui/AnimatedGrid"
import { BugFixClient } from "@/components/BugFixClient"

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0a0e17',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

import { ToastProvider } from "@/components/ui/Toast"
import { BottomStatusBar } from "@/components/layout/BottomStatusBar"
import { TickerTape } from "@/components/market/TickerTape"

export const metadata: Metadata = {
  title: "StoxPilot - Your Personal Trading Assistant",
  description: "Private institutional-grade trading intelligence engine tracking market behavior with precision.",
  manifest: '/manifest.json',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📈</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${inter.variable} ${mono.variable} font-sans antialiased`}>
        <ToastProvider>
          <ThemeProvider>
            <BugFixClient />
            <CommandPalette />
            <AnimatedGrid />
            <OnboardingFlow />
            <div className="flex h-screen overflow-hidden relative">
              <Sidebar />
              <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <TickerTape />
                <TopBar />
                <main className="flex-1 overflow-y-auto w-full relative flex flex-col custom-scrollbar pb-7 md:pb-12">
                  <div className="flex-1">
                    {children}
                  </div>
                  <Footer />
                </main>
                <MobileNav />
                <BottomStatusBar />
              </div>
            </div>
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

