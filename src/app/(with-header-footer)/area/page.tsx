'use server'

import { Area } from '@/components/page/area'
import { getAreaMissions } from '@/lib/supabase/actions/area_mission'
import { getViewer } from '@/lib/viewer'

export default async function AreaPage() {
  const viewer = await getViewer()
  const missions = await getAreaMissions()

  return (
    <Area user={viewer.user} missions={missions} isSubscription={viewer.isSubscription} freeTrail={viewer.freeTrail} />
  )
}
