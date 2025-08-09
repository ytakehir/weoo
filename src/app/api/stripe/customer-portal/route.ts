import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await supabaseServer
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.redirect('/signin')

    const { data } = await supabase.from('users').select('stripe_customer_id').eq('id', user.id).single()

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: data?.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`
    })

    return Response.json({ url: portalSession.url })
    // biome-ignore lint/suspicious/noExplicitAny: try-catch
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
  }
}
