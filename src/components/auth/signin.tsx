'use client'

import { Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthForm } from './hooks'

export function SignIn() {
  const { register, handleSubmit, errors, isSubmitting, handleSignIn } = useAuthForm()

  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md space-y-6'>
        {/* Header */}
        <div className='space-y-4 text-center'>
          <div className='flex justify-center'>
            <Image src={'/logo.png'} alt='logo' width={64} height={64} />
          </div>
          <div>
            <h1 className='font-bold text-3xl text-base-content'>weoo</h1>
            <p className='text-base-content'>メールアドレスを入力して、サインインしてください</p>
          </div>
        </div>

        <div className='flex w-full flex-col items-center justify-center'>
          {/* <OAuthButtons />

          <div className='divider'>OR</div> */}

          <form className='w-full' onSubmit={handleSubmit(handleSignIn)}>
            <fieldset className='fieldset w-full rounded-box border border-base-300 bg-base-200 p-4'>
              <label className='label' htmlFor='email'>
                Email
              </label>
              <label className='input validator w-full' htmlFor='email'>
                <Mail className='size-5 text-base-content/50' />
                <input
                  id='email'
                  type='email'
                  className='validator'
                  placeholder='email@exapmle.com'
                  required
                  {...register('email')}
                />
              </label>
              {errors.email && <p className='validator-hint hidden'>{errors.email.message}</p>}

              <button type='submit' className='btn btn-primary mt-4' disabled={isSubmitting}>
                {isSubmitting && <span className='loading loading-spinner loading-sm mr-2 text-primary-content' />}
                Sign in
              </button>
            </fieldset>
          </form>

          {/* Footer */}
          <div className='mt-4 text-center text-muted-foreground text-xs'>
            <Link href='/' className='hover:underline'>
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
