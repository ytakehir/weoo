import type { User } from '@supabase/supabase-js'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { ProfileRow } from './supabase/actions/profile'

type Viewer = {
  user: User | null
  profile: ProfileRow | null
  isSubscription: boolean
}

export const getViewer = cache(async (): Promise<Viewer> => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { user: null, profile: null, isSubscription: false }

  const [{ data: profile }, { data: sub }] = await Promise.all([
    supabase.from('profiles').select().eq('id', user.id).maybeSingle(),
    supabase
      .from('subscriptions')
      .select('status')
      .eq('profile_id', user.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle()
  ])

  return {
    user: user,
    profile: profile ?? null,
    isSubscription: !!sub
  }
})
