// src/repositories/posts.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type ProfileRow = Database['public']['Tables']['profiles']['Row']

async function getAuthedUid(): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error) throw error
  if (!user) throw new Error('UNAUTHORIZED')
  return user.id
}

/**
 * 自分の Stripe Customer ID を取得
 */
export async function getMyStripeCustomerId(): Promise<ProfileRow['stripe_customer_id'] | null> {
  const supabase = await createClient()
  const uid = await getAuthedUid()

  const { data, error } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', uid)
    .single<{ stripe_customer_id: string | null }>()

  if (error && error.code !== 'PGRST116') throw error
  return data?.stripe_customer_id ?? null
}
