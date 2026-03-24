import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Client Intake — In The Past AI',
  description: 'Configure your AI receptionist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={inter.variable}
        style={{
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          background: '#0A0A0F',
          margin: 0,
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  )
}
