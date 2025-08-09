'use client'

import { useState } from 'react'
import { MyShowcase } from '@/components/card/my-showcase'

const posts = [
  {
    mission: (
      <>
        本屋に行って
        <br />
        お互いに本を
        <br />
        プレゼントしあう
      </>
    ),
    url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
    date: new Date()
  },
  {
    mission: (
      <>
        本屋に行って
        <br />
        お互いに本を
        <br />
        プレゼントしあう
      </>
    ),
    url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
    date: new Date()
  },
  {
    mission: (
      <>
        本屋に行って
        <br />
        お互いに本を
        <br />
        プレゼントしあう
      </>
    ),
    url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
    date: new Date()
  }
]

export default function Mypage() {
  const [isLatest, setIsLatest] = useState<boolean>(true)
  const [isPosted, setIsPosted] = useState<boolean>(true)
  const [sortPosts] = useState(
    posts.sort((a, b) => (isLatest ? b.date.getTime() - a.date.getTime() : a.date.getTime() - b.date.getTime()))
  )

  return (
    <div className='flex w-full flex-col items-center justify-start' data-theme='bumblebee'>
      <div className='w-full px-5'>
        <MyShowcase posts={sortPosts} isLatest={isLatest} onLatest={() => setIsLatest(!isLatest)} isPosted={isPosted} />
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
  )
}
