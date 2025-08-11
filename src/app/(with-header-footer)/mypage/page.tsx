'use server'

import { redirect } from 'next/navigation'
import { Mypage } from '@/components/mypage'
import { hasActiveSubscription } from '@/lib/stripe/subscription'
import { createClient } from '@/lib/supabase/server'

export default async function MypagePage() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const isSubscription = user ? await hasActiveSubscription() : false

  if (!isSubscription) {
    redirect('/signin')
  }

  return <Mypage user={user} />
}
