'use server'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { SideBar } from '@/components/layout/side-bar'
import { getViewer } from '@/lib/viewer'
import { ViewerProvider } from '@/providers/view-providers'
import '@/styles/globals.css'

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
          isSubscription={viewer.isSubscription}
        />
        <SideBar />
        <div className='my-20 flex min-h-screen w-full justify-center'>{children}</div>
        <Footer />
      </div>
    </ViewerProvider>
  )
}
