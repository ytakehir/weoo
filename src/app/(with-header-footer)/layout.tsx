'use client'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { SideBar } from '@/components/layout/side-bar'
import '@/styles/globals.css'
import { useTransition } from 'react'

export default function HeaderFooterLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const [_, startTransition] = useTransition()
  const handlePortal = async (customerId: string) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/stripe/customer-portal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerId
          })
        })

        const { url } = await response.json()
        window.location.href = url
      } catch (error) {
        console.error('error:', error)
      }
    })
  }

  return (
    <div className='flex flex-col items-center'>
      <Header
        nav={[
          {
            title: ' FAQ',
            link: '/faq'
          },
          {
            title: ' Contact',
            link: '/contact'
          }
        ]}
      />
      <div className='my-20 flex min-h-screen justify-center'>
        <SideBar onUnsubscribe={() => handlePortal('')} />
        {children}
      </div>
      <Footer />
    </div>
  )
}
