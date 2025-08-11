import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const { priceId, customerId } = await req.json()

    if (!priceId) return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      success_url: `${origin ?? process.env.NEXT_PUBLIC_BASE_URL ?? ''}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin ?? process.env.NEXT_PUBLIC_BASE_URL ?? ''}/`,
      automatic_tax: { enabled: true },
      subscription_data: {
        trial_period_days: 7
      },
      customer_update: {
        address: 'auto'
      }
    })
    return NextResponse.json({ sessionId: session.id, sessionUrl: session.url }, { status: 200 })
    // biome-ignore lint/suspicious/noExplicitAny: try-catch
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
  }
}
