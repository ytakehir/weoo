'use server'

import { redirect } from 'next/navigation'
import { Mypage } from '@/components/page/mypage'
import { getViewer } from '@/lib/viewer'

export default async function MypagePage() {
  const viewer = await getViewer()

  if (!viewer.user) {
    redirect('/signin')
  }

  return <Mypage user={viewer.user} isSubscription={viewer.isSubscription} freeTrail={viewer.freeTrail}/>
}
