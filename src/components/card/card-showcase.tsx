import type { User } from '@supabase/supabase-js'
import { format } from 'date-fns'
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'
import { ChevronDown, ChevronLeft, ChevronRight, Grid2x2, List } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import type { PostWithRelationsUrlAndReactions } from '@/lib/supabase/actions/post'
import { toggleReaction } from '@/lib/supabase/actions/reaction'
import { cn } from '@/lib/tailwind'
import type { Viewer } from '@/types/viewer'
import { Reaction } from './reaction'

type Props = {
  user: User | null
  mission?: string
  posts?: PostWithRelationsUrlAndReactions[]
  postCount: number
  isLatest: boolean
  onLatest: () => void
  isPosted: boolean
  isSubscription: boolean
  freeTrail: Viewer['freeTrail']
  type?: 'home' | 'seasons' | 'area'
}

export function CardShowcase({
  user,
  mission,
  posts,
  postCount,
  isLatest,
  onLatest,
  isPosted,
  isSubscription,
  freeTrail,
  type
}: Props) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [post, setPost] = useState<PostWithRelationsUrlAndReactions>()
  const lastTap = useRef<number>(0)

  const handleTap = (post: PostWithRelationsUrlAndReactions) => {
    const now = Date.now()
    const delta = now - lastTap.current
    if (delta < 300 && delta > 0) {
      // 300ms 以内にもう一度タップされたらダブルタップ
      setPost(post)
      setIsOpen(true)
    }
    lastTap.current = now
  }

  const handleEmoji = async (emoji: EmojiClickData) => {
    if (!post?.id) return
    await toggleReaction(post?.id, emoji.imageUrl)
    setIsOpen(false)
    router.refresh()
  }

  return (
    <div className='flex w-full flex-col'>
      {isOpen && (
        <dialog id='reaction-modal' className={cn('modal', isOpen && 'modal-open z-1000')}>
          <EmojiPicker
            className='modal-box rounded-b-box p-0'
            searchDisabled
            reactionsDefaultOpen={true}
            onEmojiClick={handleEmoji}
          />
          <form method='dialog' className='modal-backdrop'>
            <button type='button' onClick={() => setIsOpen(false)} />
          </form>
        </dialog>
      )}
      <div className='flex w-full items-center gap-x-4 pb-10'>
        <div className='inline-grid *:[grid-area:1/1]'>
          <div className='status status-lg status-accent animate-ping' />
          <div className='status status-lg status-accent' />
        </div>
        <h2 className='font-semibold text-xl'>
          <span
            className={cn(
              'underline decoration-primary/50 decoration-wavy',
              type === 'seasons' && 'decoration-[#5e81ac]/50',
              type === 'area' && 'decoration-accent/50'
            )}
          >
            みんなの
          </span>
          「{(isSubscription || freeTrail.isActive) && mission ? mission : '〇〇'}」
        </h2>
      </div>
      <h3 className='mt-2 mb-7 flex w-full items-end justify-center gap-x-0.5 font-semibold text-xl'>
        <span className='text-3xl'>{postCount ?? 0}</span>この投稿
      </h3>
      {isSubscription || (isPosted && freeTrail.isActive) ? (
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
                  <Grid2x2
                    className={cn(
                      'size-6 peer-checked:stroke-primary',
                      type === 'seasons' && 'peer-checked:stroke-[#5e81ac]',
                      type === 'area' && 'peer-checked:stroke-accent'
                    )}
                  />
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
                  <List
                    className={cn(
                      'size-6 peer-checked:stroke-primary',
                      type === 'seasons' && 'peer-checked:stroke-[#5e81ac]',
                      type === 'area' && 'peer-checked:stroke-accent'
                    )}
                  />
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
                  : 'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10'
              )}
            >
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className={cn(
                    'relative',
                    viewMode === 'grid' ? 'aspect-square' : 'card flex aspect-[3/4] flex-col items-center',
                    viewMode === 'list' && post.profile_id === user?.id && 'indicator w-full'
                  )}
                >
                  {viewMode === 'list' && (
                    <>
                      {post.profile_id === user?.id && (
                        <span className='indicator-item badge badge-info badge-soft right-12'>あなたの投稿</span>
                      )}
                      <button
                        type='button'
                        className='relative aspect-[3/4] w-full'
                        onDoubleClick={() => handleTap(post)}
                        onTouchEnd={() => handleTap(post)}
                      >
                        <Image
                          className={cn(
                            '!size-full pointer-events-none rounded-box object-cover shadow-sm',
                            post.profile_id === user?.id && 'ring-2 ring-info'
                          )}
                          src={post.image_url_signed ?? '/no_image.png'}
                          alt={post.id}
                          fill
                          priority
                        />
                        <div className='absolute bottom-0 left-0 h-20 w-full rounded-b-box bg-gradient-to-t from-black/60 to-transparent' />

                        <p className='absolute bottom-4 ml-4 text-nowrap text-right font-semibold text-white text-xs'>
                          {post.caption}
                        </p>
                      </button>

                      <div className='card-body flex w-full flex-row items-start justify-between gap-2 p-2'>
                        {post.reactions.length > 0 && (
                          <Reaction
                            postId={post.id}
                            user={user}
                            isGroup={false}
                            reactions={post.reactions}
                            onReaction={(postId: string, url: string) => {
                              toggleReaction(postId, url)
                              router.refresh()
                            }}
                          />
                        )}
                        <p className='text-nowrap text-right text-base-content text-sm'>
                          {format(new Date(post.updated_at), 'yyyy/MM/dd HH:mm')}
                        </p>
                      </div>
                    </>
                  )}
                  {viewMode === 'grid' && (
                    <button
                      type='button'
                      className='!size-full'
                      onClick={() => {
                        setSelectedIndex(i)
                        setTimeout(() => {
                          location.hash = `#item${i}`
                        }, 0)
                      }}
                    >
                      <Image
                        className='!size-full pointer-events-none object-cover'
                        src={post.image_url_signed ?? '/no_image.png'}
                        alt={post.id}
                        fill
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {selectedIndex !== null && (
              <dialog id='post-modal' className='modal modal-open text-white'>
                <div className='modal-box w-[85%] bg-transparent p-0 shadow-none'>
                  <div className='carousel w-full gap-x-8 rounded-box'>
                    {posts.map((post, i) => (
                      <button
                        type='button'
                        key={post.id}
                        className='carousel-item w-full'
                        id={`item${i}`}
                        onDoubleClick={() => handleTap(post)}
                        onTouchEnd={() => handleTap(post)}
                      >
                        <div className='card flex aspect-[3/4] w-full flex-col'>
                          <div className='relative aspect-[3/4] w-full'>
                            <Image
                              className='!size-full pointer-events-none rounded-box object-cover shadow-sm'
                              src={post.image_url_signed ?? '/no_image.png'}
                              alt={post.id}
                              fill
                            />
                            <div className='absolute bottom-0 left-0 h-20 w-full rounded-b-box bg-gradient-to-t from-black/60 to-transparent' />

                            <p className='absolute bottom-4 ml-4 text-nowrap text-right font-semibold text-white text-xs'>
                              {post.caption}
                            </p>
                          </div>

                          <div className='card-body flex w-full flex-row items-start justify-between gap-2 p-2'>
                            {post.reactions.length > 0 && (
                              <Reaction postId={post.id} user={user} isGroup reactions={post.reactions} />
                            )}
                            <p className='text-nowrap text-right text-sm text-white'>
                              {format(new Date(post.updated_at), 'yyyy/MM/dd HH:mm')}
                            </p>
                          </div>
                        </div>
                      </button>
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
          <p className='flex items-center justify-center py-20 text-center font-semibold text-base-content/70 text-lg'>
            まだ投稿がないみたい...
            <br />
            一番のりで投稿しよう！
          </p>
        )
      ) : (
        <p className='flex items-center justify-center py-20 text-center font-semibold text-base-content/70 text-lg'>
          達成した写真を投稿して
          <br />
          みんなの投稿をみよう
        </p>
      )}
    </div>
  )
}
