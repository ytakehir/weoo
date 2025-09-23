import { differenceInCalendarDays } from 'date-fns'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Viewer } from '@/types/viewer'

export const getViewer = cache(async (): Promise<Viewer> => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user)
    return { user: null, profile: null, isSubscription: false, freeTrail: { isActive: false, endDate: new Date() } }

  const [{ data: profile }, { data: sub }] = await Promise.all([
    supabase.from('profiles').select().eq('id', user.id).maybeSingle(),
    supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('profile_id', user.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle()
  ])

  return {
    user: user,
    profile: profile ?? null,
    isSubscription: sub ? new Date(sub.current_period_end) >= new Date() : false,
    freeTrail: {
      isActive: differenceInCalendarDays(profile.free_trial_end, new Date()) > 0,
      endDate: new Date(profile.free_trial_end)
    }
  }
})
