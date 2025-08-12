'use server'

import { Home } from '@/components/home'
import { getOrPickTodayMission } from '@/lib/supabase/actions/mission'
import { getViewer } from '@/lib/viewer'

export default async function HomePage() {
  const viewer = await getViewer()
  const mission = await getOrPickTodayMission()

  return <Home user={viewer.user} mission={mission} isSubscription={viewer.isSubscription} />
}
