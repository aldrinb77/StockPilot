import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/layout/Sidebar"
import TopBar from "@/components/layout/TopBar"
import MobileNav from "@/components/layout/MobileNav"
import { ThemeProvider } from "@/components/ThemeProvider"
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow"
import { CommandPalette } from "@/components/ui/CommandPalette"
import { DisclaimerModal } from "@/components/legal/DisclaimerModal"
import { DisclaimerBanner } from "@/components/legal/DisclaimerBanner"
import { CookieConsent } from "@/components/legal/CookieConsent"
import { Footer } from "@/components/layout/Footer"

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

import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "StoxPilot - Educational Stock Analysis",
  description: "Rule-based technical analysis stock education. 100% Free, NO AI.",
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
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${jakarta.variable} ${inter.variable} ${mono.variable} font-sans bg-background text-foreground min-h-screen antialiased selection:bg-tvGreen/30 selection:text-tvGreen`}>
          <ThemeProvider>
            <DisclaimerModal />
            <CookieConsent />
            <CommandPalette />
            <OnboardingFlow />
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <DisclaimerBanner />
                <TopBar />
                <main className="flex-1 overflow-y-auto w-full relative flex flex-col">
                  {children}
                  <Footer />
                </main>
              <MobileNav />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
