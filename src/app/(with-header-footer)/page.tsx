'use client'

import { useState, useTransition } from 'react'
import { CardShowcase } from '@/components/card/card-showcase'
import { MissionCard } from '@/components/card/mission-card'
import { PlanModal } from '@/components/plan-modal'
import { getStripe } from '@/lib/stripe/client'

const posts = [
  {
    url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
    date: new Date('2025-05-01')
  },
  {
    url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
    date: new Date('2025-06-13')
  },
  {
    url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
    date: new Date('2025-08-22')
  }
]

const args = {
  mission: '本屋に行ってお互いに本をプレゼントしあう'
}

export default function Home() {
  const [isLatest, setIsLatest] = useState<boolean>(true)
  const [isPosted, setIsPosted] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [sortPosts] = useState(
    posts.sort((a, b) => (isLatest ? b.date.getTime() - a.date.getTime() : a.date.getTime() - b.date.getTime()))
  )
  const [isPending, startTransition] = useTransition()

  const handleSubscription = async (priceId: string) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/stripe/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            priceId
          })
        })

        const { sessionId } = await response.json()

        const stripe = await getStripe()
        stripe?.redirectToCheckout({ sessionId })
      } catch (error) {
        console.error('error:', error)
      }
    })
  }

  return (
    <>
      {isOpen && (
        <PlanModal
          isOpen={isOpen}
          onIsOpen={() => setIsOpen(!true)}
          onSubscribe={() => handleSubscription(process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIBE_PRICE_ID ?? '')}
          isPending={isPending}
        />
      )}
      <div className='flex w-full flex-col items-center justify-center'>
        <h1 className='my-5 flex w-full items-end justify-center gap-x-0.5 font-semibold text-xl'>今日のお題</h1>
        <MissionCard
          mission={
            <>
              本屋に行って
              <br />
              お互いに本を
              <br />
              プレゼントしあう
            </>
          }
          onClickMission={() => setIsPosted(true)}
        />
        <div className='mt-20 w-full px-5'>
          <CardShowcase
            {...args}
            posts={sortPosts}
            isLatest={isLatest}
            onLatest={() => setIsLatest(!isLatest)}
            isPosted={isPosted}
          />
          {isPosted && (
            <div className='join mt-20 grid grid-cols-2'>
              <button type='button' className='join-item btn btn-outline'>
                Previous page
              </button>
              <button type='button' className='join-item btn btn-outline'>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
