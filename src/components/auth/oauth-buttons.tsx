import { signIn } from 'next-auth/react'
import { FaApple, FaFacebook, FaGithub, FaGoogle, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6'

type Props = {
  isApple: boolean
  isFacebook: boolean
  isGithub: boolean
  isGoogle: boolean
  isInstagram: boolean
  isTikTok: boolean
  isX: boolean
}

export function OAuthButtons({
  isApple = true,
  isFacebook = true,
  isGithub = true,
  isGoogle = true,
  isInstagram = true,
  isTikTok = true,
  isX = true
}: Partial<Props>) {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-y-2'>
      <p className='text-base-content'>Continue with</p>
      {isApple && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => signIn('apple', { redirectTo: '/' })}>
          <div className='text-neutral'>
            <FaApple size={20} className='mr-2 size-5 fill-neutral-content' />
          </div>
          Apple
        </button>
      )}
      {isFacebook && (
        <button
          type='button'
          className='btn btn-neutral w-full'
          onClick={() => signIn('facebook', { redirectTo: '/' })}
        >
          <FaFacebook className='mr-2 size-5 fill-neutral-content' />
          Facebook
        </button>
      )}
      {isGithub && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => signIn('github', { redirectTo: '/' })}>
          <FaGithub className='mr-2 size-5 fill-neutral-content' />
          Github
        </button>
      )}
      {isGoogle && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => signIn('google', { redirectTo: '/' })}>
          <FaGoogle className='mr-2 size-5 fill-neutral-content' />
          Google
        </button>
      )}
      {isInstagram && (
        <button
          type='button'
          className='btn btn-neutral w-full'
          onClick={() => signIn('instagram', { redirectTo: '/' })}
        >
          <FaInstagram className='mr-2 size-5 fill-neutral-content' />
          Instagram
        </button>
      )}
      {isTikTok && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => signIn('tiktok', { redirectTo: '/' })}>
          <FaTiktok className='mr-2 size-5 fill-neutral-content' />
          TikTok
        </button>
      )}
      {isX && (
        <button type='button' className='btn btn-neutral w-full' onClick={() => signIn('twitter', { redirectTo: '/' })}>
          <FaXTwitter className='mr-2 size-5 fill-neutral-content' />X (Twitter)
        </button>
      )}
    </div>
  )
}
