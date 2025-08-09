'use client'

import { Home, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useVerify } from './hooks'

export default function Verify() {
  const { cooldown, handleResend } = useVerify()

  return (
    <div className='flex min-h-screen items-center justify-center bg-base-100 p-4'>
      <div className='mx-auto max-w-md space-y-6 text-center'>
        <div className='mx-auto flex size-16 items-center justify-center'>
          <Image src='/logo.png' alt='サービスロゴ' width={64} height={64} />
        </div>

        <div className='space-y-2'>
          <div className='flex items-stretch justify-center gap-1'>
            <h2 className='font-semibold text-base-content text-lg'>メールを確認してください</h2>
            <span className='loading loading-dots loading-xs text-base-content' />
          </div>
          <p className='text-base-content/80'>
            サインイン用のリンクを送信しました。受信メールのリンクをタップして続行してください。
          </p>
          <p className='text-base-content/60'>数分待っても届かない場合は、迷惑メールフォルダもご確認ください。</p>
        </div>

        <div className='flex flex-col justify-center gap-3 sm:flex-row'>
          <button
            type='button'
            className='btn btn-primary w-full sm:w-auto'
            onClick={handleResend}
            disabled={cooldown > 0}
          >
            <Send className='mr-2 size-4' />
            {cooldown > 0 ? `再送まで ${cooldown} 秒` : 'メールを再送する'}
          </button>

          <Link href='/'>
            <button type='button' className='btn w-full sm:w-auto'>
              <Home className='mr-2 size-4' />
              ホームへ戻る
            </button>
          </Link>
        </div>

        <div className='pt-4'>
          <Link href='/' className='text-base-content/80 text-sm transition-colors hover:text-info'>
            ← ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
