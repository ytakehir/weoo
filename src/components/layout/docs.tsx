'use client'

import { Calendar1, House, Map as MapIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function Docs() {
  const [active, setActive] = useState<'home' | 'seasons' | 'area'>('home')
  return (
    <div className='dock dock-sm bottom-10 z-900 mx-auto w-[95%] rounded-full shadow-md'>
      <Link
        href={'/seasons'}
        className={active === 'seasons' ? 'dock-active after:text-primary' : ''}
        onClick={() => setActive('seasons')}
      >
        <Calendar1 />
      </Link>

      <Link
        href={'/'}
        className={active === 'home' ? 'dock-active after:text-primary' : ''}
        onClick={() => setActive('home')}
      >
        <House />
      </Link>

      <Link
        href={'/area'}
        className={active === 'area' ? 'dock-active after:text-primary' : ''}
        onClick={() => setActive('area')}
      >
        <MapIcon />
      </Link>
    </div>
  )
}
