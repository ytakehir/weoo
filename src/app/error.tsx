'use client'

import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-base-100 p-4'>
      <div className='mx-auto max-w-md space-y-6 text-center'>
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-error-500/20 to-error-500/10'>
          <AlertTriangle className='size-16 text-error' />
        </div>

        <div className='space-y-2'>
          <h1 className='font-bold text-2xl text-base-content'>Something went wrong</h1>
          <p className='text-base-content'>
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className='mt-4 rounded-lg bg-base-300 p-4 text-left'>
              <summary className='cursor-pointer font-medium text-sm'>Error Details</summary>
              <pre className='mt-2 overflow-auto text-base-content text-xs'>{error.message}</pre>
            </details>
          )}
        </div>

        <div className='flex flex-col justify-center gap-3 sm:flex-row'>
          <button type='button' className='btn btn-primary w-full sm:w-auto' onClick={reset}>
            <RefreshCw className='mr-2 size-4' />
            Try Again
          </button>
          <Link href='/'>
            <button type='button' className='btn w-full sm:w-auto'>
              <Home className='mr-2 size-4' />
              Go Home
            </button>
          </Link>
        </div>

        <div className='pt-4'>
          <Link href='/contact' className='text-base-content text-sm transition-colors hover:text-info'>
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  )
}
