'use server'

import { Docs } from '@/components/layout/docs'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { SideBar } from '@/components/layout/side-bar'
import { cn } from '@/lib/tailwind'
import { getViewer } from '@/lib/viewer'
import { ViewerProvider } from '@/providers/view-providers'
import '@/styles/globals.css'
import { Zen_Maru_Gothic } from 'next/font/google'

const zenmaru = Zen_Maru_Gothic({
  weight: '500',
  subsets: ['latin']
})

export default async function HeaderFooterLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const viewer = await getViewer()
  return (
    <ViewerProvider initial={viewer}>
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
          user={viewer.user}
        />
        <SideBar isSubscription={viewer.isSubscription} freeTrail={viewer.freeTrail} />
        <Docs />
        <div className={cn('my-20 flex min-h-screen w-full justify-center', zenmaru.className)}>{children}</div>
        <Footer />
      </div>
    </ViewerProvider>
  )
}
