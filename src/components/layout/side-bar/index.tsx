'use client'

import { CircleQuestionMark, LogIn, LogOut, MailQuestionMark, PanelRightClose, Send, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { FaTiktok } from 'react-icons/fa6'
import type { Viewer } from '@/types/viewer'
import { useMissionForm } from './hooks'

type Props = {
  isSubscription: boolean
  freeTrail: Viewer['freeTrail']
}

export function SideBar({ isSubscription, freeTrail }: Props) {
  const { isSubmitted, methods, onSubmit, handlePortal, handleSubscribe } = useMissionForm()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods

  const pathname = usePathname()

  // biome-ignore lint/correctness/useExhaustiveDependencies: watch pathname
  useEffect(() => {
    const drawerToggle = document.getElementById('side-bar') as HTMLInputElement | null
    if (drawerToggle) {
      drawerToggle.checked = false
    }
  }, [pathname])

  return (
    <div className='drawer drawer-end z-1000'>
      <input id='side-bar' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content' />
      <div className='drawer-side'>
        <label htmlFor='side-bar' aria-label='close sidebar' className='drawer-overlay' />
        <ul className='menu h-full w-80 bg-base-100 p-4 text-base-content'>
          <div className='flex items-center justify-between'>
            <label htmlFor='side-bar' className='drawer-button btn btn-circle btn-sm border-none bg-base-100'>
              <PanelRightClose className='size-5' />
            </label>
            <Link type='button' className='btn btn-circle btn-sm border-none bg-base-100' href='/mypage'>
              <User className='size-5' />
            </Link>
          </div>
          <div className='mt-5 flex flex-1 flex-col justify-between'>
            <nav>
              <li>
                <Link className='link link-hover' href='/mypage'>
                  <div className='flex items-center gap-x-5'>
                    <User className='size-4' />
                    Mypage
                  </div>
                </Link>
              </li>
              <li>
                <Link className='link link-hover' href='/contact'>
                  <div className='flex items-center gap-x-5'>
                    <MailQuestionMark className='size-4' />
                    Contact
                  </div>
                </Link>
              </li>
              <li>
                <Link className='link link-hover' href='/faq'>
                  <div className='flex items-center gap-x-5'>
                    <CircleQuestionMark className='size-4' />
                    FAQ
                  </div>
                </Link>
              </li>
              <li>
                {isSubscription ? (
                  <button type='button' className='link link-error link-hover' onClick={() => handlePortal()}>
                    <div className='flex items-center gap-x-5'>
                      <LogOut className='size-4' />
                      サブスクを解約する
                    </div>
                  </button>
                ) : freeTrail.endDate > new Date() ? (
                  <div
                    className='tooltip tooltip-right tooltip-open tooltip-neutral w-fit pr-0 drop-shadow-md before:p-1 before:text-xs'
                    data-tip='追加 30日間無料✨'
                  >
                    <button type='button' className='link link-primary link-hover' onClick={() => handleSubscribe()}>
                      <div className='flex items-center gap-x-5'>
                        <LogIn className='size-4' />
                        サブスクに加入する
                      </div>
                    </button>
                  </div>
                ) : (
                  <button type='button' className='link link-primary link-hover' onClick={() => handleSubscribe()}>
                    <div className='flex items-center gap-x-5'>
                      <LogIn className='size-4' />
                      サブスクに加入する
                    </div>
                  </button>
                )}
              </li>
            </nav>
            <div className='flex flex-col items-center justify-center gap-y-5'>
              <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <fieldset className='fieldset size-full rounded-box border border-base-300 bg-base-200 p-4'>
                  <div>
                    <legend className='fieldset-legend'>💡2人以上でやりたくなるお題を考えよう！</legend>
                    <input
                      type='text'
                      className='input validator'
                      placeholder='例）本屋に行ってお互いに本をプレゼントしあう'
                      {...register('title')}
                    />
                    {errors.title && <p className='validator-hint hidden'>{errors.title.message}</p>}
                    <p className='label w-full justify-end'>50文字以内</p>
                    {isSubmitted && (
                      <p className='mt-2 text-center text-base-content text-sm'>投稿してくれてありがとう🙇🏻🙇🏻</p>
                    )}
                  </div>
                  <button type='submit' className='btn btn-neutral mt-4' disabled={isSubmitting}>
                    <Send className='mr-2 size-4' />
                    {isSubmitting && <span className='loading loading-spinner loading-sm mr-2 text-neutral-content' />}
                    送信する
                  </button>
                </fieldset>
              </form>
              <button
                type='button'
                className='btn btn-link font-medium text-base-content'
                onClick={() => {
                  navigator.share({
                    title: 'weoo（ウィーオー）',
                    text: 'シェアしてくれた人と一緒にお題に参加しよう！！',
                    url: 'https://weoo.jp'
                  })
                }}
              >
                恋人や友達にシェアしよう👀
              </button>
              <div className='mb-10 grid grid-flow-col gap-4'>
                <a
                  className='flex items-center gap-x-2'
                  href='https://www.tiktok.com/@weoo_official'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaTiktok className='size-6' />
                  <span className='font-semibold text-lg'>TikTok</span>
                </a>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  )
}
