import { format } from 'date-fns'
import { Zen_Maru_Gothic } from 'next/font/google'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/tailwind'

const zenmaru = Zen_Maru_Gothic({
  weight: '500',
  subsets: ['latin']
})

type Props = {
  post: {
    mission: React.ReactNode
    url: string
    date: Date
  }
}

export function FlipCard({ post }: Props) {
  const [isFront, setIsFront] = useState<boolean>(true)

  return (
    <div
      role='none'
      className={cn('perspective-midrange group aspect-3/4 w-96', zenmaru.className)}
      onClick={() => setIsFront(!isFront)}
    >
      <div
        className={cn(
          'card transform-3d relative size-full transition-transform duration-500 group-hover:rotate-y-180',
          !isFront && 'rotate-y-180'
        )}
      >
        {/* Front */}
        <div className='card-body backface-hidden absolute flex size-full flex-col justify-between rounded-box bg-base-100 shadow-sm'>
          <h2 className='card-title text-left font-semibold text-4xl/relaxed'>{post.mission}</h2>
          <button
            type='button'
            className='card-actions btn btn-link relative items-center justify-center text-info-content no-underline'
          >
            <span className='absolute inline-flex size-2/3 animate-ping rounded-full bg-info/75' />
            tap!
          </button>
        </div>

        {/* Back */}
        <div className='card-body backface-hidden absolute inset-0 flex rotate-y-180 flex-col justify-between gap-0 p-0'>
          <div className='relative flex-1'>
            <Image className='!size-full rounded-box object-cover shadow-sm' src={post.url} alt={post.url} fill />
          </div>

          <div className='p-2'>
            <p className='text-right text-base-content text-sm'>{format(post.date, 'yyyy/MM/dd')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
