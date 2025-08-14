'use client'

// import { Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
// import { useActionState } from 'react'
// import { useFormStatus } from 'react-dom'
// import { type EmailSignInState, emailSignIn } from './actions'
import { OAuthButtons } from './oauth-buttons'

// function SubmitButton() {
//   const { pending } = useFormStatus()
//   return (
//     <button type='submit' className='btn btn-primary mt-4' disabled={pending}>
//       {pending && <span className='loading loading-spinner loading-sm mr-2 text-primary-content' />}
//       Sign in
//     </button>
//   )
// }

export function SignIn({ plan }: { plan: 'free' | 'pro' }) {
  // const initialState: EmailSignInState = { ok: false }
  // const [state, formAction] = useActionState(emailSignIn, initialState)

  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md space-y-6'>
        {/* Header */}
        <div className='space-y-4 text-center'>
          <div className='flex justify-center'>
            <Image src='/logo.png' alt='logo' width={64} height={64} />
          </div>
          <div>
            <h1 className='font-bold text-3xl text-base-content'>weoo</h1>
            <p className='my-4 text-base-content'>
              GOOGLEアカウント利用して、
              <br />
              サインインしてください
            </p>
            <p className='text-base-content/70 text-sm'>
              ※サブスクを選択された方は、ログイン後自動で決済画面に遷移します
            </p>
          </div>
        </div>

        <div className='flex w-full flex-col items-center justify-center'>
          <OAuthButtons plan={plan} />

          {/* <div className='divider'>OR</div>

          <form className='w-full' action={formAction}>
            <fieldset className='fieldset w-full rounded-box border border-base-300 bg-base-200 p-4'>
              <label className='label' htmlFor='email'>
                Email
              </label>
              <label className='input validator w-full' htmlFor='email'>
                <Mail className='size-5 text-base-content/50' />
                <input
                  type='hidden'
                  name='next'
                  value={new URLSearchParams(window.location.search).get('next') ?? '/'}
                />
                <input
                  id='email'
                  name='email'
                  type='email'
                  className='validator'
                  placeholder='email@example.com'
                  required
                />
              </label>

              {state.error && <p className='mt-2 text-error text-sm'>{state.error}</p>}
              {state.message && <p className='mt-2 text-sm text-success'>{state.message}</p>}

              <SubmitButton />
            </fieldset>
          </form> */}

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
