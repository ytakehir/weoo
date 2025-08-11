'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export type EmailSignInState = {
  ok: boolean
  message?: string
  error?: string
}

const schema = z.object({
  next: z.string().optional(),
  email: z.string().email('メールアドレスの形式が正しくありません')
})

export async function emailSignIn(_prevState: EmailSignInState, formData: FormData): Promise<EmailSignInState> {
  const parsed = schema.safeParse({ next: formData.get('next'), email: formData.get('email') })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? '入力内容を確認してください' }
  }
  const { email } = parsed.data

  const supabase = await createClient()

  const header = await headers()
  const origin = header.get('origin') ?? process.env.NEXT_PUBLIC_BASE_URL ?? ''

  let next = parsed.data.next ?? '/'

  if (!next.startsWith('/')) next = '/'
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` }
  })
  if (error) {
    return { ok: false, error: 'メール送信に失敗しました。時間をおいて再度お試しください。' }
  }

  return { ok: true, message: 'ログインリンクを送信しました。メールを確認してください！' }
}
