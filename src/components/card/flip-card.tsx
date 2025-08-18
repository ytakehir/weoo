import type { User } from '@supabase/supabase-js'
import { format } from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import type { PostWithRelationsUrlAndReactions } from '@/lib/supabase/actions/post'
import { cn } from '@/lib/tailwind'
import { Reaction } from './reaction'

type Props = {
  user: User | null
  post: PostWithRelationsUrlAndReactions
}

export function FlipCard({ user, post }: Props) {
  const [isFront, setIsFront] = useState<boolean>(true)

  return (
    <div
      role='none'
      className='perspective-midrange group aspect-3/4 w-full'
      onClick={() => setIsFront(!isFront)}
      onMouseEnter={() => setIsFront(false)}
      onMouseLeave={() => setIsFront(true)}
    >
      <div
        className={cn(
          'card transform-3d relative size-full transition-transform duration-500 group-hover:rotate-y-180',
          !isFront && 'rotate-y-180'
        )}
      >
        {/* Front */}
        <div className='card-body backface-hidden absolute flex size-full flex-col justify-between rounded-box bg-base-100 shadow-sm'>
          <h2 className='card-title whitespace-pre-line text-left font-semibold text-4xl/relaxed text-base-content'>
            {post.mission.title.replace(/\\n/g, '\n')}
          </h2>
          <button
            type='button'
            className='card-actions btn btn-link relative items-center justify-center text-info-content no-underline'
          >
            <span
              className={cn('absolute inline-flex size-2/3 animate-ping rounded-full bg-info/75', !isFront && 'hidden')}
            />
            tap!
          </button>
        </div>

        {/* Back */}
        <div className='card-body backface-hidden absolute inset-0 flex rotate-y-180 flex-col justify-between gap-0 p-0'>
          <div className='relative aspect-3/4 flex-1'>
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

          <div className='flex items-start justify-center gap-x-2 p-2'>
            <Reaction isGroup user={user} postId={post.id} reactions={post.reactions} />
            <p className='text-nowrap text-right text-base-content text-sm'>
              {format(new Date(post.updated_at), 'yyyy/MM/dd HH:mm')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
