'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useReducer, useState, useTransition } from 'react'
import { CardShowcase } from '@/components/card/card-showcase'
import { MissionCard } from '@/components/card/mission-card'
import { PlanModal } from '@/components/plan-modal'
import type { MissionRow } from '@/lib/supabase/actions/mission'
import { createPost, getPostsByMission, type PostWithPage } from '@/lib/supabase/actions/post'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/tailwind'
import { CardBack } from './card/card-back'

type Props = {
  mission: MissionRow | null
  isSubscription: boolean
}

export function Home({ mission, isSubscription }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [isLatest, setIsLatest] = useState<boolean>(true)
  const [isPosted, setIsPosted] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [posts, setPosts] = useState<PostWithPage>()
  const [isPending, startTransition] = useTransition()
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
      const posts = await getPostsByMission(mission?.id ?? '', isLatest ? 'desc' : 'asc')
      if (posts) setPosts(posts)
    }
    fetchPost()
  }, [mission?.id, isLatest])

  const onUpload = async (file: File | null) => {
    startTransition(async () => {
      try {
        if (!file || !mission) return

        const {
          data: { user },
          error: userErr
        } = await supabase.auth.getUser()
        if (userErr || !user) return

        const ext = file.name.split('.').pop() ?? 'webp'
        const now = new Date()
        const y = now.getUTCFullYear()
        const m = String(now.getUTCMonth() + 1).padStart(2, '0')
        const d = String(now.getUTCDate()).padStart(2, '0')
        const objectPath = `${user.id}/${y}/${m}/${d}/${crypto.randomUUID()}.${ext}`

        const { error: upErr } = await supabase.storage.from('posts').upload(objectPath, file, { upsert: false })

        if (upErr) return

        await createPost({
          userId: user.id,
          missionId: mission.id,
          imageUrl: objectPath
        })

        setIsPosted(true)
        router.refresh()
      } catch (e) {
        console.error('[onUpload]', e)
      }
    })
  }
  return (
    <>
      {isOpen && !isSubscription && (
        <PlanModal isOpen={isOpen} onIsOpen={() => setIsOpen(!true)} onSubscribe={() => router.push('/signin')} />
      )}
      <div className='flex w-full flex-col items-center justify-center'>
        <h1 className='my-5 flex w-full items-end justify-center gap-x-0.5 font-semibold text-xl'>今日のお題</h1>
        {isSubscription ? <MissionCard mission={mission?.title ?? ''} onClickMission={onUpload} /> : <CardBack />}
        <div className='mt-20 w-full px-5'>
          <CardShowcase
            mission={mission?.title.replace(/\\n/g, '') ?? ''}
            posts={posts?.items}
            isLatest={isLatest}
            onLatest={() => setIsLatest(!isLatest)}
            isPosted={isPosted}
            isSubscription={isSubscription}
          />
          {isPosted && (
            <div className='join mt-20 grid grid-cols-2'>
              {state.count > 1 && (
                <button
                  type='button'
                  className={cn('join-item btn btn-outline', state.count > 1 && !posts?.hasMore && 'col-span-2')}
                  onClick={() => dispatch({ type: 'DECREMENT' })}
                >
                  まえへ
                </button>
              )}
              {posts?.hasMore && (
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
      </div>
      {isPending && (
        <div className='pointer-events-none absolute top-0 left-0 z-1000 flex size-full items-center justify-center bg-black/50'>
          <span className='loading loading-spinner loading-xl text-primary' />
        </div>
      )}
    </>
  )
}
