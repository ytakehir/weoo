'use server'

import { CheckoutForm } from '@/components/payment/checkout-form'
import { getIntent } from '@/lib/stripe/actions/intent'
import { getMyStripeCustomerId } from '@/lib/supabase/actions/profile'
import { getViewer } from '@/lib/viewer'

export default async function Payment() {
  const viewer = await getViewer()
  const customerId = await getMyStripeCustomerId()
  const clientSecret = await getIntent(customerId ?? undefined)

  return (
    <div id='checkout' className='flex min-h-screen w-full items-center justify-center'>
      <CheckoutForm clientSecret={clientSecret} user={viewer.user} customerId={customerId ?? undefined}/>
    </div>
  )
}
