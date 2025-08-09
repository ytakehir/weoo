'use client'

import { Send, X } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import type { ContactForm as ContactFormType } from './type'

type Props = {
  onSubmit: (data: ContactFormType) => Promise<void>
}

export function ContactForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useFormContext<ContactFormType>()

  return (
    <form className='size-full space-y-6' onSubmit={handleSubmit(onSubmit)}>
      <fieldset className='fieldset size-full rounded-box border border-base-300 bg-base-200 p-4'>
        <div className='flex items-center gap-x-2 pb-4'>
          <Send className='h-5 w-5' />
          <span className='font-bold text-[14px] text-base-content'>お問い合わせ</span>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className='rounded-lg border border-error/20 bg-error/10 p-4'>
            <h4 className='mb-2 font-medium text-error'>以下の内容を確認してください：</h4>
            <ul className='space-y-1 text-error text-sm'>
              {errors.name && (
                <li>
                  <div className='flex items-center gap-x-2'>
                    <X className='size-4' /> {errors.name.message}
                  </div>
                </li>
              )}
              {errors.email && (
                <li>
                  <div className='flex items-center gap-x-2'>
                    <X className='size-4' /> {errors.email.message}
                  </div>
                </li>
              )}
              {errors.message && (
                <li>
                  <div className='flex items-center gap-x-2'>
                    <X className='size-4' /> {errors.message.message}
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* お名前 */}
        <label className='label font-bold' htmlFor='name'>
          お名前 <span className='text-error'>*</span>
        </label>
        <label className='input validator w-full' htmlFor='name'>
          <input
            id='name'
            type='text'
            className='validator'
            placeholder='例）山田 太郎'
            required
            {...register('name')}
          />
        </label>
        {errors.name && <p className='validator-hint hidden'>{errors.name.message}</p>}

        {/* メールアドレス */}
        <label className='label font-bold' htmlFor='email'>
          メールアドレス <span className='text-error'>*</span>
        </label>
        <label className='input validator w-full' htmlFor='email'>
          <input
            id='email'
            type='email'
            className='validator'
            placeholder='example@example.com'
            required
            {...register('email')}
          />
        </label>
        {errors.email && <p className='validator-hint hidden'>{errors.email.message}</p>}

        {/* 件名（任意） */}
        <label className='label font-bold' htmlFor='subject'>
          件名（任意）
        </label>
        <label className='input validator w-full' htmlFor='subject'>
          <input
            id='subject'
            type='text'
            className='validator'
            placeholder='お問い合わせの概要（任意）'
            {...register('subject')}
          />
        </label>
        {errors.subject && <p className='validator-hint hidden'>{errors.subject.message}</p>}

        {/* メッセージ */}
        <label className='label font-bold' htmlFor='message'>
          メッセージ <span className='text-error'>*</span>
        </label>
        <label className='validator w-full' htmlFor='message'>
          <textarea
            id='message'
            className='textarea validator h-24 w-full'
            placeholder='ご用件（お題や投稿、料金、解約方法など）をできるだけ具体的にご記入ください。'
            required
            {...register('message')}
          />
        </label>
        <div className='flex justify-between text-base-content/70 text-xs'>
          <span>できるだけ具体的にご記入ください</span>
          <span>最大 1000 文字</span>
        </div>
        {errors.message && <p className='validator-hint hidden'>{errors.message.message}</p>}

        <button type='submit' className='btn btn-neutral mt-4' disabled={isSubmitting}>
          <Send className='mr-2 size-4' />
          {isSubmitting && <span className='loading loading-spinner loading-sm mr-2 text-neutral-content' />}
          送信する
        </button>
      </fieldset>
    </form>
  )
}
