'use client'

import { Home, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-base-100 p-4'>
      <div className='mx-auto max-w-md space-y-6 text-center'>
        <div className='mx-auto flex size-16 items-center justify-center'>
          <Image src={'/logo.png'} alt='logo' width={64} height={64} />
        </div>

        <div className='space-y-2'>
          <h1 className='font-bold text-6xl text-base-content'>404</h1>
          <h2 className='font-semibold text-2xl text-base-content'>Page Not Found</h2>
          <p className='text-base-content'>The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className='flex flex-col justify-center gap-3 sm:flex-row'>
          <Link href='/'>
            <button type='button' className='btn btn-primary w-full sm:w-auto'>
              <Home className='mr-2 size-4' />
              Go Home
            </button>
          </Link>
          <Link href='/faq'>
            <button type='button' className='btn w-full sm:w-auto'>
              <MessageSquare className='mr-2 size-4' />
              FAQ
            </button>
          </Link>
        </div>

        <div className='pt-4'>
          <Link href='/' className='text-base-content text-sm transition-colors hover:text-info'>
            ← Back to
          </Link>
        </div>
      </div>
    </div>
  )
}
