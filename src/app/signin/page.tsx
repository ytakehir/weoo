'use client'

import { useSearchParams } from 'next/navigation'
import { SignIn } from '@/components/auth/signin'

export default function Pricing() {
  const plan = useSearchParams()
  const isPlan = (plan: string | null) => {
    switch (plan) {
      case 'free':
        return 'free'
      case 'pro':
        return 'pro'
      default:
        return 'free'
    }
  }

  return <SignIn plan={isPlan(plan.get('plan'))} />
}
