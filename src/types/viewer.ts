import type { User } from '@supabase/supabase-js'
import type { ProfileRow } from '@/lib/supabase/actions/profile'

export type Viewer = {
  user: User | null
  profile: ProfileRow | null
  isSubscription: boolean
  freeTrail: { isActive: boolean; endDate: Date }
}
