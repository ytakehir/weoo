import { Zen_Maru_Gothic } from 'next/font/google'
import { cn } from '@/lib/tailwind'

const zenmaru = Zen_Maru_Gothic({
  weight: '500',
  subsets: ['latin']
})

type Props = {
  mission: string
  onClickMission: (e: File | null) => void
}

export function MissionCard({ mission, onClickMission }: Props) {
  return (
    <div className='stack aspect-3/4 max-h-max w-96'>
      <div className={cn('card', zenmaru.className)}>
        <div className='card-body flex size-full flex-col justify-between rounded-box border-2 border-primary bg-base-100 shadow-sm'>
          <h2 className='card-title whitespace-pre-line text-left font-semibold text-4xl/relaxed'>
            {mission.replace(/\\n/g, '\n')}
          </h2>
          <label
            htmlFor='mission'
            className='card-actions btn btn-link relative items-center justify-center no-underline'
          >
            <input
              type='file'
              id='mission'
              accept='image/*'
              className='hidden'
              onChange={(e) => onClickMission(e.target.files?.[0] ?? null)}
            />
            <span className='absolute inline-flex size-2/3 animate-ping rounded-full bg-primary/75' />
            post photo!
          </label>
        </div>
      </div>
      <div className='card'>
        <div className='card-body size-full rounded-box bg-base-100 shadow-sm' />
      </div>
      <div className='card'>
        <div className='card-body size-full rounded-box bg-base-100 shadow-sm' />
      </div>
    </div>
  )
}
