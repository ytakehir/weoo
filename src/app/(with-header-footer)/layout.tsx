'use server'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { SideBar } from '@/components/layout/side-bar'
import { hasActiveSubscription } from '@/lib/stripe/subscription'
import { createClient } from '@/lib/supabase/server'
import '@/styles/globals.css'

export default async function HeaderFooterLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const isSubscription = user ? await hasActiveSubscription() : false

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
        isSubscription={isSubscription}
      />
      <SideBar />
      <div className='my-20 flex min-h-screen w-full justify-center'>{children}</div>
      <Footer />
    </div>
  )
}
