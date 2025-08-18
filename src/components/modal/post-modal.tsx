import { format } from 'date-fns'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/tailwind'
import type { PostForm } from '../page/home/hooks'

type Props = {
  isOpen: boolean
  onIsOpen: () => void
  onSubmit: (data: PostForm) => void
}

export function PostModal({ isOpen, onIsOpen, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useFormContext<PostForm>()
  const [photo, setPhoto] = useState<File | null>(null)

  return (
    <dialog id='plan-modal' className={cn('modal', isOpen && 'modal-open')}>
      <div className='modal-box relative flex flex-col items-center justify-center overflow-visible p-0'>
        <form method='dialog'>
          <button
            type='submit'
            className='btn btn-xs btn-circle -top-2 -right-2 absolute border-none bg-base-100/50'
            onClick={onIsOpen}
          >
            <X className='size-4 text-base-content/70' />
          </button>
        </form>
        <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col items-center justify-center gap-y-4 p-6'>
            {/* <h3 className='text-center font-bold text-lg'>
              「{mission}」
              <br />
              に投稿する📮
            </h3> */}
            <div className={'card relative flex aspect-[3/4] w-full flex-col items-center'}>
              <div className='card-body absolute inset-0 flex flex-col justify-between gap-0 p-0'>
                <div className='relative flex flex-1 items-center justify-center'>
                  {photo ? (
                    <>
                      <Image
                        className='!size-full pointer-events-none rounded-box object-cover shadow-sm'
                        src={URL.createObjectURL(photo) ?? ''}
                        alt={photo?.name ?? ''}
                        fill
                      />
                      <button
                        type='submit'
                        className='btn btn-xs btn-circle -top-3 -right-2 absolute border-none bg-base-100/70'
                        onClick={() => setPhoto(null)}
                      >
                        <X className='size-4 text-base-content/70' />
                      </button>
                      <div className='absolute bottom-0 left-0 h-20 w-full rounded-b-box bg-gradient-to-t from-black/60 to-transparent' />
                    </>
                  ) : (
                    <label
                      htmlFor='photo'
                      className='card-actions btn btn-link relative w-full items-center justify-center no-underline'
                    >
                      <input
                        type='file'
                        id='photo'
                        accept='image/*'
                        className='hidden'
                        {...register('file', {
                          onChange: (e) => setPhoto(e.target.files?.[0] ?? null)
                        })}
                      />
                      <span className='absolute inline-flex size-2/3 animate-ping rounded-full bg-primary/75' />
                      select photo!
                    </label>
                  )}
                </div>
                {photo && (
                  <>
                    <input
                      type='text'
                      className='input validator input-ghost input-sm !text-white absolute bottom-12 ml-2 font-medium text-xs placeholder-white caret-white focus-within:border-none focus-within:bg-transparent focus-within:outline-none focus-within:ring-0 focus:border-none focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:border-none focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-0'
                      placeholder='ここをタップして思い出を書き残そう！'
                      {...register('caption')}
                    />
                    <div className='p-2'>
                      <p className='text-right text-base-content text-sm'>{format(new Date(), 'yyyy/MM/dd HH:mm')}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className='flex w-full flex-col items-center justify-center gap-y-2'>
              {errors.caption && <p className='validator-hint'>{errors.caption.message}</p>}
              <div className='flex w-full items-center justify-start gap-x-2'>
                <input type='checkbox' className='checkbox checkbox-neutral checkbox-xs' {...register('isPublic')} />
                <p className='w-full text-base-content/70 text-xs'>
                  <a
                    className='link link-info mr-1'
                    href='https://www.tiktok.com/@weoo_official'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    weoo 公式TikTok
                  </a>
                  への掲載を許可する
                </p>
              </div>
              <p className='w-full text-base-content/70 text-xs'>※ キャプションは20文字までです</p>
              <p className='w-full text-base-content/70 text-xs'>⚠️ 各種SNSのアカウントなどの記載は禁止しています</p>
            </div>
            <button type='submit' className='btn btn-neutral btn-wide mt-4' disabled={!photo || isSubmitting}>
              {isSubmitting ? (
                <span className='loading loading-spinner loading-sm mr-2 text-neutral-content' />
              ) : (
                '投稿する'
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
