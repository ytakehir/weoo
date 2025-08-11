import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { getMyStripeCustomerId } from '@/lib/supabase/actions/profile'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.redirect('/signin')

    const customerId = await getMyStripeCustomerId()

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId ?? '',
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`
    })

    return Response.json({ url: portalSession.url })
    // biome-ignore lint/suspicious/noExplicitAny: try-catch
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
  }
}
