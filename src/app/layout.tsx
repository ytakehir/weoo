import { cn } from '@/lib/tailwind'
import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Zen_Maru_Gothic } from 'next/font/google'

const zenmaru = Zen_Maru_Gothic({
  weight: '500',
  subsets: ['latin']
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja' data-theme='emerald'>
      <body
        className={cn(
          'mx-auto min-h-screen max-w-sm select-text bg-base-100 antialiased selection:bg-primary selection:text-primary-content md:max-w-md lg:max-w-md',
          zenmaru.className
        )}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
