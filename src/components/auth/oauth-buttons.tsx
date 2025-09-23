'use client'
import { FaApple, FaFacebook, FaGithub, FaGoogle, FaXTwitter } from 'react-icons/fa6'
import { createClient } from '@/lib/supabase/client'

export function OAuthButtons({
  isApple = false,
  isFacebook = false,
  isGithub = false,
  isGoogle = true,
  isX = false
}: Partial<{
  isApple: boolean
  isFacebook: boolean
  isGithub: boolean
  isGoogle: boolean
  isX: boolean
}>) {
  const supabase = createClient()

  const go = async (provider: 'google' | 'github' | 'apple' | 'facebook' | 'twitter') => {
    const next = new URLSearchParams(window.location.search).get('next') ?? '/'
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      }
    })
  }

  return (
    <div className='flex w-full flex-col items-center justify-center gap-y-2'>
      <p className='text-base-content'>Continue with</p>

      {isApple && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => go('apple')}>
          <FaApple className='mr-2 size-5 fill-neutral-content' /> Apple
        </button>
      )}

      {isFacebook && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => go('facebook')}>
          <FaFacebook className='mr-2 size-5 fill-neutral-content' /> Facebook
        </button>
      )}

      {isGithub && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => go('github')}>
          <FaGithub className='mr-2 size-5 fill-neutral-content' /> GitHub
        </button>
      )}

      {isGoogle && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => go('google')}>
          <FaGoogle className='mr-2 size-5 fill-neutral-content' /> Google
        </button>
      )}

      {isX && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => go('twitter')}>
          <FaXTwitter className='mr-2 size-5 fill-neutral-content' /> X (Twitter)
        </button>
      )}
    </div>
  )
}
