import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useVerify = () => {
  const RESEND_INTERVAL = 60
  const [email, setEmail] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState<number>(0)

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email')
    const lastSentAt = sessionStorage.getItem('magiclink_last_sent')
    setEmail(storedEmail)

    if (lastSentAt) {
      const diff = Math.floor((+lastSentAt + RESEND_INTERVAL * 1000 - Date.now()) / 1000)
      if (diff > 0) setCooldown(diff)
    }
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) clearInterval(interval)
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldown])

  const handleResend = async () => {
    if (!email || cooldown > 0) return

    await signIn('resend', { email, redirectTo: '/' })
    const now = Date.now()
    sessionStorage.setItem('magiclink_last_sent', String(now))
    setCooldown(RESEND_INTERVAL)
  }

  return { cooldown, handleResend }
}
