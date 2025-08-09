import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(req: Request) {
  const webhookEndpoint = process.env.STRIPE_WEBHOOK_SECRET ?? ''
  const rawBody = await req.text()
  const header = await headers()
  const signature = header.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookEndpoint)
    // biome-ignore lint/suspicious/noExplicitAny: try-catch
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (isSubscriptionEvent(event)) {
    const sub = event.data.object

    if (event.type === 'customer.subscription.deleted') {
      await supabaseAdmin.from('subscriptions').delete().eq('id', sub.id)
    } else {
      await supabaseAdmin.from('subscriptions').upsert({
        id: sub.id,
        customer_id: sub.customer,
        price_id: sub.items.data[0]?.price.id ?? null,
        status: sub.status,
        current_period_end: new Date(sub.items.data[0].current_period_end * 1000),
        user_id: await getUserIdFromCustomer(sub.customer)
      })
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}

function isSubscriptionEvent(event: Stripe.Event): event is Stripe.Event & { data: { object: Stripe.Subscription } } {
  return (
    ['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(
      event.type
    ) &&
    typeof event.data.object.object === 'string' &&
    event.data.object.object === 'subscription'
  )
}

async function getUserIdFromCustomer(
  customerId: string | Stripe.Customer | Stripe.DeletedCustomer
): Promise<string | null> {
  const { data } = await supabaseAdmin.from('users').select('id').eq('stripe_customer_id', customerId).single()
  return data?.id ?? null
}
