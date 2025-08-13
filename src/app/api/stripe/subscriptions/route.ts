import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const { priceId, customerId } = await req.json()

    if (!priceId || !customerId) return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      automatic_tax: { enabled: true },
      billing_address_collection: 'required',
      customer_update: { address: 'auto' },
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      subscription_data: { trial_period_days: 14 }
    })
    return NextResponse.json({ sessionId: session.id, sessionUrl: session.url }, { status: 200 })
    // biome-ignore lint/suspicious/noExplicitAny: try-catch
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
  }
}
