import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { hasActiveSubscription } from '@/lib/stripe/subscription'
import { getMyStripeCustomerId } from '@/lib/supabase/actions/profile'
import { ensureStripeCustomer } from '@/lib/supabase/actions/subscription'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) next = '/'

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_BASE_URL ?? ''

  if (!code) {
    return NextResponse.redirect(`${origin}/error`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${origin}/error`)
  }

  await ensureStripeCustomer()
  const customerId = await getMyStripeCustomerId()
  if (!customerId) {
    return NextResponse.redirect(`${origin}/error`)
  }

  const subscribed = await hasActiveSubscription()

  if (!subscribed) {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIBE_PRICE_ID
    if (!priceId) return NextResponse.redirect(`${origin}/error`)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      automatic_tax: { enabled: true },
      billing_address_collection: 'required',
      customer_update: { address: 'auto' },
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      subscription_data: { trial_period_days: 14 }
    })

    if (!session.url) return NextResponse.redirect(`${origin}/error`)
    return NextResponse.redirect(session.url, { status: 302 })
  }

  return NextResponse.redirect(`${origin}${next}`)
}
