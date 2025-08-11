import { format } from 'date-fns'
import { ChevronDown, ChevronLeft, ChevronRight, Grid2x2, List } from 'lucide-react'
import { Zen_Maru_Gothic } from 'next/font/google'
import Image from 'next/image'
import { useState } from 'react'
import type { PostWithRelationsAndUrl } from '@/lib/supabase/actions/post'
import { cn } from '@/lib/tailwind'

const zenmaru = Zen_Maru_Gothic({
  weight: '500',
  subsets: ['latin']
})

type Props = {
  mission: string
  posts?: PostWithRelationsAndUrl[]
  isLatest: boolean
  onLatest: () => void
  isPosted: boolean
  isSubscription: boolean
}

export function CardShowcase({ mission, posts, isLatest, onLatest, isPosted, isSubscription }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <div className={cn('flex w-full flex-col', zenmaru.className)}>
      <div className='flex w-full items-center gap-x-4 pb-10'>
        <div className='inline-grid *:[grid-area:1/1]'>
          <div className='status status-lg status-accent animate-ping' />
          <div className='status status-lg status-accent' />
        </div>
        <h2 className='font-semibold text-xl'>
          <span className='underline decoration-primary/50 decoration-wavy'>みんなの</span>「{mission}」
        </h2>
      </div>
      <h3 className='mt-2 mb-7 flex w-full items-end justify-center gap-x-0.5 font-semibold text-xl'>
        <span className='text-3xl'>{posts?.length ?? 0}</span>この投稿
      </h3>
      {!isPosted && isSubscription ? (
        posts && posts.length > 0 ? (
          <>
            <div className='mb-5 flex w-full items-center justify-end gap-x-4'>
              <div className='flex items-center gap-x-4'>
                <label htmlFor='grid'>
                  <input
                    type='radio'
                    id='grid'
                    name='view'
                    className='peer hidden'
                    onChange={() => setViewMode('grid')}
                  />
                  <Grid2x2 className='size-6 peer-checked:stroke-primary' />
                </label>
                <label htmlFor='list'>
                  <input
                    type='radio'
                    id='list'
                    name='view'
                    className='peer hidden'
                    onChange={() => setViewMode('list')}
                    defaultChecked
                  />
                  <List className='size-6 peer-checked:stroke-primary' />
                </label>
              </div>
              <div className='dropdown dropdown-end dropdown-hover'>
                <button tabIndex={0} type='button' className='btn btn-ghost m-1 items-center p-0 text-md'>
                  {isLatest ? 'あたらしい' : 'ふるい'}
                  <ChevronDown className='size-6' />
                </button>
                <ul className='dropdown-content menu z-1 mt-1 w-52 rounded-box bg-base-100 p-2 shadow-sm'>
                  <li>
                    <button type='button' onClick={onLatest}>
                      あたらしい
                    </button>
                  </li>
                  <li>
                    <button type='button' onClick={onLatest}>
                      ふるい
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={cn(
                'w-full',
                viewMode === 'grid'
                  ? 'grid grid-cols-3 gap-0.5 sm:grid-cols-4 md:grid-cols-5'
                  : 'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8'
              )}
            >
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className={cn(
                    'relative',
                    viewMode === 'grid' ? 'aspect-square' : 'card flex aspect-[3/4] flex-col items-center'
                  )}
                >
                  {viewMode === 'list' && (
                    <>
                      <div className='relative aspect-[3/4] w-full'>
                        <Image
                          className='!size-full rounded-box object-cover shadow-sm'
                          src={post.image_url_signed ?? '/no_image.png'}
                          alt={post.id}
                          fill
                        />
                      </div>

                      <div className='card-body w-full items-end gap-0 p-2'>
                        <p className='text-right text-base-content text-sm'>
                          {format(new Date(post.updated_at), 'yyyy/MM/dd')}
                        </p>
                      </div>
                    </>
                  )}
                  {viewMode === 'grid' && (
                    <Image
                      className='!size-full object-cover'
                      src={post.image_url_signed ?? '/no_image.png'}
                      alt={post.id}
                      fill
                      onClick={() => {
                        setSelectedIndex(i)
                        setTimeout(() => {
                          location.hash = `#item${i}`
                        }, 0)
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            {selectedIndex !== null && (
              <dialog id='post-modal' className='modal modal-open text-white'>
                <div className='modal-box w-[85%] bg-transparent p-0 shadow-none'>
                  <div className='carousel w-full gap-x-8 rounded-box'>
                    {posts.map((post, i) => (
                      <div className='carousel-item w-full' id={`item${i}`}>
                        <div className='card flex aspect-[3/4] w-full flex-col'>
                          <div className='relative aspect-[3/4] w-full'>
                            <Image
                              className='!size-full rounded-box object-cover shadow-sm'
                              src={post.image_url_signed ?? '/no_image.png'}
                              alt={post.id}
                              fill
                            />
                          </div>

                          <div className='card-body gap-0 p-2'>
                            <p className='text-right font-semibold text-sm'>
                              {format(new Date(post.updated_at), 'yyyy/MM/dd')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='flex items-center justify-center gap-x-4 pt-5'>
                    <ChevronLeft className='size-4 stroke-2' />
                    <span className='inline-block align-text-top font-semibold'>swipe!</span>
                    <ChevronRight className='size-4 stroke-2' />
                  </div>
                </div>
                <form method='dialog' className='modal-backdrop'>
                  <button type='submit' onClick={() => setSelectedIndex(null)} />
                </form>
              </dialog>
            )}
          </>
        ) : (
          <p className='flex items-center justify-center py-20 font-semibold text-base-content/70 text-lg'>
            まだ投稿がないみたい、、
            <br />
            一番のりで投稿しよう！
          </p>
        )
      ) : (
        <p className='flex items-center justify-center py-20 font-semibold text-base-content/70 text-lg'>
          達成した写真を投稿して、
          <br />
          みんなの投稿をみよう
        </p>
      )}
    </div>
  )
}
