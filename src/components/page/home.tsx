'use client'

import type { User } from '@supabase/supabase-js'
import { A11y, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { differenceInCalendarDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useReducer, useState, useTransition } from 'react'
import { CardShowcase } from '@/components/card/card-showcase'
import { MissionCard } from '@/components/card/mission-card'
import { checkoutSubscribe } from '@/lib/stripe/subscription'
import type { MissionRow } from '@/lib/supabase/actions/mission'
import { createPost, getPostsByMission, getPostsCountByMission, type PostWithPage } from '@/lib/supabase/actions/post'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/tailwind'
import type { Viewer } from '@/types/viewer'
import { CardBack } from '../card/card-back'
import { SigninModal } from '../modal/signin-modal'
import { UpgradeModal } from '../modal/upgrade-modal'

type Props = {
  user: User | null
  missions: MissionRow[] | null
  isSubscription: boolean
  freeTrail: Viewer['freeTrail']
}

export function Home({ user, missions, isSubscription, freeTrail }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [active, setActive] = useState(0)
  const [mission, setMission] = useState<MissionRow | undefined>(missions?.[0])
  const [postCount, setPostCount] = useState<number>(0)
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
    setIsPosted(posts?.items.some((post) => post.profile_id === user?.id) ?? false)
  }, [posts, user?.id])

  const onUpload = async (file: File | null) => {
    window.scrollTo({ top: 0 })
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

  useEffect(() => {
    const m = missions?.[active]
    if (!m) return
    setMission(m)
    let canceled = false
    ;(async () => {
      const count = await getPostsCountByMission(m.id)
      const p = await getPostsByMission(m.id, isLatest ? 'desc' : 'asc')
      if (!canceled) {
        setPostCount(count ?? 0)
        if (p) setPosts(p)
      }
    })()
    return () => {
      canceled = true
    }
  }, [active, missions, isLatest])

  useEffect(() => {
    if (isPending) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isPending])

  return (
    <>
      {isOpen && !user && (
        <SigninModal
          isOpen={isOpen}
          onIsOpen={() => setIsOpen(!true)}
          onSubscribe={() => router.push('/signin?plan=pro')}
          onSignin={() => router.push('/signin')}
        />
      )}
      {isOpen &&
        user &&
        freeTrail.isActive &&
        differenceInCalendarDays(freeTrail.endDate, new Date()) <= 3 &&
        !isSubscription && (
          <UpgradeModal
            isOpen={isOpen}
            onIsOpen={() => setIsOpen(!true)}
            onSubscribe={() => checkoutSubscribe(7)}
            trailEndDate={freeTrail.endDate}
          />
        )}
      <div className={cn('flex w-[90%] flex-col items-center justify-center')}>
        {!user && (
          <button type='button' className='btn btn-link text-base-content' onClick={() => router.push('/signin')}>
            会員登録して今日のお題に参加しよう📮✨
          </button>
        )}
        {user && !isSubscription && (
          <button type='button' className='btn btn-link text-base-content' onClick={() => checkoutSubscribe(7)}>
            サブスク登録して過去のお題に参加しよう📮✨
          </button>
        )}
        <div className='flex items-center justify-center gap-4'>
          <ChevronLeft
            className={cn(
              'size-8 opacity-0',
              missions && missions?.length > 1 && (isSubscription || freeTrail.isActive) && 'opacity-100'
            )}
          />
          <h1 className='my-5 flex w-full items-end justify-center gap-x-0.5 font-semibold text-xl'>今日のお題</h1>
          <ChevronRight
            className={cn('size-8 opacity-0', active > 0 && (isSubscription || freeTrail.isActive) && 'opacity-100')}
          />
        </div>
        {isSubscription && (
          <Swiper
            dir='rtl'
            modules={[Navigation, A11y]}
            slidesPerView={1}
            resistanceRatio={0.5}
            speed={350}
            onSlideChange={(swiper) => setActive(swiper.activeIndex)}
            className='w-full'
            spaceBetween={'10%'}
          >
            {missions?.map((mission) => (
              <SwiperSlide key={mission.id} dir='ltr' className='w-[99%]'>
                <MissionCard mission={mission.title} onClickMission={onUpload} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {freeTrail.isActive && !isSubscription && (
          <MissionCard mission={missions?.[0].title ?? ''} onClickMission={onUpload} />
        )}
        {((!isSubscription && !freeTrail.isActive) || !user) && <CardBack />}
        {(isSubscription || freeTrail.isActive) && (
          <p className='mt-2 text-base-content text-xs'>💡 カードを左右にスワイプして今週のお題に参加しよう</p>
        )}
        <div className='mt-20 w-full px-5'>
          <CardShowcase
            user={user}
            mission={mission?.title.replace(/\\n/g, '')}
            posts={posts?.items}
            postCount={postCount}
            isLatest={isLatest}
            onLatest={() => setIsLatest(!isLatest)}
            isPosted={isPosted}
            isSubscription={isSubscription}
          />
          {posts && posts.items.length > 0 && (
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
        <div className='pointer-events-auto absolute top-0 left-0 z-1000 flex h-screen w-full items-center justify-center bg-black/50'>
          <span className='loading loading-spinner loading-xl text-primary' />
        </div>
      )}
    </>
  )
}
