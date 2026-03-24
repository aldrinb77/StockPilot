import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import MobileNav from '@/components/layout/MobileNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StockPilot - Free Rule-Based Stock Trading Guidance',
  description: 'A beginner-friendly stock market guidance platform that acts as a spoon-feeder, telling you EXACTLY when to buy, sell, or hold. No AI, just math.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-tvGreen selection:text-white`}>
        <ThemeProvider>
          <div className="flex h-screen overflow-hidden">
            <div className="hidden md:block">
              <Sidebar />
            </div>
            
            <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
              <TopBar />
              
              <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8 relative">
                <div className="max-w-[1600px] mx-auto w-full">
                  {children}
                </div>
              </main>

              <div className="md:hidden">
                <MobileNav />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
