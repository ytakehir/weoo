// src/repositories/subscriptions.ts
'use server'

import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row']
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

/**
 * 1件取得（ID = Stripe subscription id）
 * RLS: 課金者本人 or service_role で読める想定
 */
export const getSubscriptionById = async (id: string): Promise<SubscriptionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('subscriptions').select('*').eq('id', id).single()

  if (error) {
    // PGRST116 = no rows
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data ?? null
}

/**
 * プロフィール（ユーザー）に紐づく全件取得
 */
export const getSubscriptionsByProfileId = async (profileId: string): Promise<SubscriptionRow[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * 作成
 * 通常は Webhook（service_role）から叩く想定。
 */
export const createSubscription = async (input: SubscriptionInsert): Promise<SubscriptionRow> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('subscriptions').insert(input).select('*').single()

  if (error) throw error
  return data
}

/**
 * 更新
 */
export const updateSubscription = async (id: string, updates: SubscriptionUpdate): Promise<SubscriptionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('subscriptions').update(updates).eq('id', id).select('*').single()

  if (error) throw error
  return data ?? null
}

/**
 * 削除
 */
export const deleteSubscription = async (id: string): Promise<boolean> => {
  const supabase = await createClient()
  const { error } = await supabase.from('subscriptions').delete().eq('id', id)
  if (error) throw error
  return true
}

/**
 * 便利関数：customer_id から最新1件を取得
 * （Stripe 顧客IDで引くケース用）
 */
export const getLatestByCustomerId = async (customerId: string): Promise<SubscriptionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) throw error
  return data?.[0] ?? null
}

/**
 * 便利関数：Webhook からの upsert（id=StripeSubscriptionIdで衝突時更新）
 * service_role 実行前提
 */
export const upsertFromStripe = async (payload: SubscriptionInsert): Promise<SubscriptionRow> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export const ensureStripeCustomer = async () => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, stripe_customer_id, email')
    .eq('id', user.id)
    .maybeSingle()

  let customerId = profile?.stripe_customer_id ?? null
  if (customerId) {
    try {
      await stripe.customers.retrieve(customerId)
      return customerId // 有効
    } catch {
      customerId = null
    }
  }

  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: profile?.display_name ?? undefined,
    metadata: { profile_id: user.id }
  })

  await supabase.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id)

  return customer.id
}
