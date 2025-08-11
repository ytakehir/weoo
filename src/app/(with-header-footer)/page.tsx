'use server'

import { Home } from '@/components/home'
import { hasActiveSubscription } from '@/lib/stripe/subscription'
import { getOrPickTodayMission } from '@/lib/supabase/actions/mission'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const [
    {
      data: { user }
    },
    mission
  ] = await Promise.all([supabase.auth.getUser(), getOrPickTodayMission()])
  const isSubscription = user ? await hasActiveSubscription() : false

  return <Home mission={mission} isSubscription={isSubscription} />
}
