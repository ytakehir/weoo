import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const { priceId, customerEmail } = await req.json()

    if (!priceId) return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer_email: customerEmail,
      mode: 'subscription',
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      automatic_tax: { enabled: true }
    })
    return NextResponse.json({ sessionId: session.id }, { status: 200 })
    // biome-ignore lint/suspicious/noExplicitAny: try-catch
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
  }
}
