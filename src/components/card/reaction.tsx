import type { User } from '@supabase/supabase-js'
import Image from 'next/image'
import type { ReactionWithCount } from '@/lib/supabase/actions/post'
import { cn } from '@/lib/tailwind'

export function Reaction({
  user,
  postId,
  reactions,
  isGroup,
  onReaction
}: {
  user: User | null
  postId: string
  reactions: ReactionWithCount[]
  isGroup: boolean
  onReaction?: (postId: string, url: string) => void
}) {
  return isGroup ? (
    <div className='badge badge-dash badge-sm badge-info items-center bg-base-100 font-semibold'>
      {reactions.map((reaction) => (
        <Image key={reaction.url} src={reaction.url} alt={reaction.url} width={16} height={16} />
      ))}
      {reactions.reduce((prev, current) => prev + current.count, 0) > 99
        ? '99+'
        : reactions.reduce((prev, current) => prev + current.count, 0) > 99}
    </div>
  ) : (
    <div className='flex w-full flex-wrap items-center gap-2 font-semibold'>
      {reactions.map((reaction) => (
        <button
          type='button'
          key={reaction.url}
          className={cn(
            'badge badge-sm badge-info items-center',
            reaction.rows.some((row) => row.profile_id === user?.id) ? 'badge-soft' : 'badge-dash bg-base-100'
          )}
          onClick={onReaction && (() => onReaction(postId, reaction.url))}
        >
          <Image src={reaction.url} alt={reaction.url} width={16} height={16} />
          {reaction.count > 9 ? '9+' : reaction.count}
        </button>
      ))}
    </div>
  )
}
