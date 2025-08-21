'use client'

import type { User } from '@supabase/supabase-js'
import { A11y, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { differenceInCalendarDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FormProvider } from 'react-hook-form'
import { CardShowcase } from '@/components/card/card-showcase'
import { MissionCard } from '@/components/card/mission-card'
import { PostModal } from '@/components/modal/post-modal'
import { checkoutSubscribe } from '@/lib/stripe/subscription'
import type { SeasonsMissionRow } from '@/lib/supabase/actions/seasons_mission'
import { cn } from '@/lib/tailwind'
import type { Viewer } from '@/types/viewer'
import { CardBack } from '../../card/card-back'
import { PlanModal } from '../../modal/plan-modal'
import { SigninModal } from '../../modal/signin-modal'
import { UpgradeModal } from '../../modal/upgrade-modal'
import { useHome } from './hooks'

type Props = {
  user: User | null
  missions: SeasonsMissionRow[] | null
  isSubscription: boolean
  freeTrail: Viewer['freeTrail']
}

export function Seasons({ user, missions, isSubscription, freeTrail }: Props) {
  const {
    router,
    active,
    setActive,
    mission,
    postCount,
    isLatest,
    setIsLatest,
    isPosted,
    isOpen,
    setIsOpen,
    isOpenPlanModal,
    setIsOpenPlanModal,
    isOpenPostModal,
    setIsOpenPostModal,
    posts,
    isPending,
    state,
    dispatch,
    methods,
    onSubmit
  } = useHome(user, missions)

  return (
    <>
      {isOpen && !user && (
        <SigninModal
          isOpen={isOpen}
          onIsOpen={() => setIsOpen(!isOpen)}
          onSubscribe={() => router.push('/signin?plan=pro')}
          onSignin={() => router.push('/signin')}
        />
      )}
      {isOpen && user && !isSubscription && (
        <PlanModal
          isOpen={isOpenPlanModal}
          onIsOpen={() => setIsOpenPlanModal(!isOpen)}
          onSubscribe={() => checkoutSubscribe(30)}
        />
      )}
      {isOpen &&
        user &&
        freeTrail.isActive &&
        differenceInCalendarDays(freeTrail.endDate, new Date()) <= 7 &&
        !isSubscription && (
          <UpgradeModal
            isOpen={isOpen}
            onIsOpen={() => setIsOpen(!isOpen)}
            onSubscribe={() => checkoutSubscribe(30)}
            trailEndDate={freeTrail.endDate}
          />
        )}
      {isOpen && user && (freeTrail.isActive || isSubscription) && (
        <FormProvider {...methods}>
          <PostModal
            type='seasons'
            isOpen={isOpenPostModal}
            onIsOpen={() => setIsOpenPostModal(!isOpenPostModal)}
            // mission={mission?.title.replace(/\\n/g, '') ?? ''}
            onSubmit={onSubmit}
          />
        </FormProvider>
      )}
      <div className={cn('flex w-[90%] flex-col items-center justify-center')}>
        {!user && (
          <button type='button' className='btn btn-link text-base-content' onClick={() => router.push('/signin')}>
            会員登録して今日のお題に参加しよう📮✨
          </button>
        )}
        {user && !isSubscription && (
          <button type='button' className='btn btn-link text-base-content' onClick={() => setIsOpenPlanModal(true)}>
            サブスク登録して過去のお題に参加しよう📮✨
          </button>
        )}
        <div className='flex items-center justify-center gap-4'>
          <ChevronLeft className={cn('size-8 opacity-0', missions && missions?.length > 1 && 'opacity-100')} />
          <h1 className='my-5 flex w-full items-end justify-center gap-x-0.5 font-semibold text-xl'>季節のお題</h1>
          <ChevronRight className={cn('size-8 opacity-0', active > 0 && 'opacity-100')} />
        </div>
        {freeTrail.isActive && isSubscription && (
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
                <MissionCard type='seasons' mission={mission.title} onClickMission={() => setIsOpenPostModal(true)} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {((!isSubscription && !freeTrail.isActive) || !user || !(missions && missions?.length > 0)) && (
          <CardBack type='seasons' />
        )}
        {(isSubscription || freeTrail.isActive) && (
          <p className='mt-2 text-base-content text-xs'>💡 カードを左右にスワイプして他のお題にも参加しよう</p>
        )}
        <div className='mt-20 w-full px-5'>
          <CardShowcase
            type='seasons'
            user={user}
            mission={mission?.title.replace(/\\n/g, '')}
            posts={posts?.items}
            postCount={postCount}
            isLatest={isLatest}
            onLatest={() => setIsLatest(!isLatest)}
            isPosted={isPosted}
            isSubscription={isSubscription}
            freeTrail={freeTrail}
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
