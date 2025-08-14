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

export const checkoutSubscribe = async (trialPeriodDays: number) => {
  try {
    const response = await fetch('/api/stripe/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIBE_PRICE_ID ?? '',
        trialPeriodDays
      })
    })

    const { url } = await response.json()
    window.location.href = url
  } catch (error) {
    console.error('error:', error)
  }
}
