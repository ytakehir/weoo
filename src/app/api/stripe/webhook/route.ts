export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-06-30.basil'
})

// Webhook では service role を使う（Cookie不要＆RLSを越えて書き込める）
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

export async function POST(req: Request) {
  const sig = (await headers()).get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
    // biome-ignore lint/suspicious/noExplicitAny: try-catch
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

      // profiles から profile_id を特定（stripe_customer_id で引く）
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle()

      const profile_id = profile?.id ?? null

      // subscription レコードを upsert（削除も canceled 更新で保持）
      const payload = {
        id: sub.id,
        profile_id, // null になり得る → 後で補完も可
        customer_id: customerId,
        price_id: sub.items.data[0]?.price?.id ?? null,
        status: event.type === 'customer.subscription.deleted' ? 'canceled' : sub.status,
        current_period_end: sub.items.data[0].current_period_end
          ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
          : null
      }

      await supabaseAdmin.from('subscriptions').upsert(payload)
      break
    }

    case 'checkout.session.completed': {
      // 任意：初回の checkout で profiles.stripe_customer_id を埋めるならここで
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as Stripe.Customer | string
      const profileId = session.metadata?.profile_id // ← 事前に metadata へ埋めておくと楽
      if (profileId && typeof customerId === 'string') {
        await supabaseAdmin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', profileId)
      }
      break
    }

    default:
      // 他のイベントは無視
      break
  }

  return NextResponse.json({ received: true })
}
