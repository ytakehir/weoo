import { createClient } from '@/lib/supabase/server'

export const hasActiveSubscription = async (): Promise<boolean> => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('subscriptions')
    .select('id,status')
    .eq('profile_id', user.id)
    .in('status', ['active', 'trialing'])
    .maybeSingle()

  if (error) return false
  return !!data
}
