'use server'

import { redirect } from 'next/navigation'
import { Mypage } from '@/components/mypage'
import { getViewer } from '@/lib/viewer'

export default async function MypagePage() {
  const viewer = await getViewer()

  if (!viewer.isSubscription) {
    redirect('/signin')
  }

  return <Mypage user={viewer.user} />
}
