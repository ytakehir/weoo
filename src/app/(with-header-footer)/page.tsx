'use server'

import { Home } from '@/components/page/home'
import { getWeekMissions } from '@/lib/supabase/actions/mission'
import { getViewer } from '@/lib/viewer'

export default async function HomePage() {
  const viewer = await getViewer()
  const missions = await getWeekMissions()

  return (
    <Home user={viewer.user} missions={missions} isSubscription={viewer.isSubscription} freeTrail={viewer.freeTrail} />
  )
}
