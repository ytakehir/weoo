'use server'

import { Seasons } from '@/components/page/seasons'
import { getSeasonsMissions } from '@/lib/supabase/actions/seasons_mission'
import { getViewer } from '@/lib/viewer'

export default async function SeasonsPage() {
  const viewer = await getViewer()
  // const missions = (await getWeekMissions())
  const missions = await getSeasonsMissions()

  return (
    <Seasons
      user={viewer.user}
      missions={missions}
      isSubscription={viewer.isSubscription}
      freeTrail={viewer.freeTrail}
    />
  )
}
