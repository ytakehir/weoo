'use client'

import type { User } from '@supabase/supabase-js'
import { useEffect, useReducer, useState } from 'react'
import { MyShowcase } from '@/components/card/my-showcase'
import { getPostsByUser, type PostWithPage } from '@/lib/supabase/actions/post'
import { cn } from '@/lib/tailwind'

type Props = {
  user: User | null
}

export function Mypage({ user }: Props) {
  const [isLatest, setIsLatest] = useState<boolean>(true)
  const [posts, setPosts] = useState<PostWithPage>()
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'INCREMENT':
          if (posts?.total && state.count >= posts?.total / posts?.limit) return { count: state.count }
          return { count: state.count + 1 }
        case 'DECREMENT':
          if (state.count <= 1) return { count: 1 }
          return { count: state.count - 1 }
        default:
          return state
      }
    },
    { count: 1 }
  )

  useEffect(() => {
    const fetchPost = async () => {
      const posts = await getPostsByUser(user?.id ?? '', isLatest ? 'desc' : 'asc', state.count)
      if (posts) {
        setPosts(posts)
      }
    }
    fetchPost()
  }, [user?.id, isLatest, state.count])

  return (
    <div className='flex w-[95%] flex-col items-center justify-start'>
      <MyShowcase posts={posts?.items} isLatest={isLatest} onLatest={() => setIsLatest(!isLatest)} />
      {posts && (
        <div className='join mt-20 grid grid-cols-2'>
          {state.count > 1 && (
            <button
              type='button'
              className={cn('join-item btn btn-outline', state.count > 1 && !posts.hasMore && 'col-span-2')}
              onClick={() => dispatch({ type: 'DECREMENT' })}
            >
              まえへ
            </button>
          )}
          {posts.hasMore && (
            <button
              type='button'
              className={cn('join-item btn btn-outline', state.count > 1 && !posts.hasMore && 'col-span-2')}
              onClick={() => dispatch({ type: 'INCREMENT' })}
            >
              つぎへ
            </button>
          )}
        </div>
      )}
    </div>
  )
}
