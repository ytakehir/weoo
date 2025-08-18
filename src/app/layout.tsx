import { cn } from '@/lib/tailwind'
import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'

const notosan = Noto_Sans_JP({
  weight: '500',
  subsets: ['latin']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja' data-theme='emerald'>
      <body
        className={cn(
          'mx-auto min-h-screen w-sm select-text bg-base-100 antialiased selection:bg-primary selection:text-primary-content sm:w-full md:w-md lg:w-md',
          notosan.className
        )}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
