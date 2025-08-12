'use client'

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek
} from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PostWithRelationsAndUrl } from '@/lib/supabase/actions/post'
import { cn } from '@/lib/tailwind'

type Props = {
  initialMonth?: Date
  posts: PostWithRelationsAndUrl[]
  onClick: (index: number) => void
}

function makeMonthMatrix(month: Date) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
  return eachDayOfInterval({ start, end })
}

export function Calendar({ initialMonth = new Date(), posts, onClick }: Props) {
  const postsByDay = useMemo(() => {
    const map = new Map<string, { thumbUrl: string | null; fullUrl?: string | null }[]>()
    for (const p of posts) {
      const d = new Date(p.created_at)
      const key = format(d, 'yyyy-MM-dd')
      const arr = map.get(key) ?? []
      arr.push({ thumbUrl: p.image_url_signed ?? null, fullUrl: p.image_url_signed ?? null })
      map.set(key, arr)
    }
    return Object.fromEntries(map)
  }, [posts])

  const oldestMonthStart = useMemo(() => {
    if (!posts.length) return startOfMonth(initialMonth)
    const oldest = posts.reduce(
      (min, p) => (new Date(p.created_at) < min ? new Date(p.created_at) : min),
      new Date(posts[0].created_at)
    )
    return startOfMonth(oldest)
  }, [posts, initialMonth])

  const [months, setMonths] = useState<Date[]>([initialMonth])

  const scrollerRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const ioRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    ioRef.current?.disconnect()
    ioRef.current = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        setMonths((m) => {
          const next = addMonths(m[m.length - 1], -1)
          if (oldestMonthStart && next < oldestMonthStart) {
            ioRef.current?.disconnect()
            return m
          }
          return [...m, next]
        })
      },
      { rootMargin: '600px' }
    )
    const node = topSentinelRef.current
    if (node) ioRef.current.observe(node)
    return () => ioRef.current?.disconnect()
  }, [oldestMonthStart])

  const now = new Date()

  return (
    <div
      ref={scrollerRef}
      className='flex max-h-[80vh] w-full flex-col-reverse space-y-10 space-y-reverse overflow-y-auto'
    >
      {months.map((m) => {
        const days = makeMonthMatrix(m)
        return (
          <section key={m.toISOString()}>
            <div className='mb-3 flex items-center justify-between'>
              <h2 className='w-full text-center font-semibold text-md'>{format(m, 'yyyy年 M月', { locale: ja })}</h2>
            </div>

            <div className='grid grid-cols-7 gap-3'>
              {days.map((d, index) => {
                const key = format(d, 'yyyy-MM-dd')
                const items = postsByDay[key] ?? []
                const cover = items[0]?.thumbUrl ?? null
                const dimOutOfMonth = !isSameMonth(d, m)
                const future = d > now

                // 未来日はセル確保だけして非表示
                if (future) {
                  return (
                    <div
                      key={key}
                      className='pointer-events-none relative aspect-square rounded-full opacity-0'
                      aria-hidden
                    />
                  )
                }

                return (
                  <button
                    key={key}
                    type='button'
                    onClick={() => onClick(index)}
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-full',
                      dimOutOfMonth && 'pointer-events-none opacity-0'
                    )}
                  >
                    {cover && (
                      <Image className='!size-full rounded-full object-cover brightness-95' src={cover} alt='' fill loading='lazy' />
                    )}
                    <span
                      className={cn(
                        'pointer-events-none absolute inset-0 grid place-items-center font-semibold',
                        items.length ? 'text-white' : 'text-base-content/50'
                      )}
                    >
                      {format(d, 'd')}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* flex-col-reverse なので“最後の子”が見た目の上端 */}
      <div ref={topSentinelRef} className='h-8' />
    </div>
  )
}
