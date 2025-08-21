import { cn } from '@/lib/tailwind'

type Props = {
  type?: 'home' | 'seasons' | 'area'
  mission: string
  onClickMission: () => void
  disable?: boolean
}

export function MissionCard({ type = 'home', mission, onClickMission, disable }: Props) {
  return (
    <div className='stack aspect-3/4 max-h-max w-full'>
      <div className='card'>
        <div
          className={cn(
            'card-body flex size-full flex-col justify-between rounded-box border-2 border-primary bg-base-100 shadow-sm',
            type === 'seasons' && 'border-[#5e81ac]',
            type === 'area' && 'border-accent'
          )}
        >
          <h2 className='card-title whitespace-pre-line text-left font-semibold text-4xl/relaxed'>
            {mission.replace(/\\n/g, '\n')}
          </h2>
          {!disable && (
            <button
              type='button'
              className={cn(
                'card-actions btn btn-link relative w-full items-center justify-center no-underline',
                type === 'seasons' && 'text-[#5e81ac]',
                type === 'area' && 'text-accent'
              )}
              onClick={onClickMission}
            >
              <span
                className={cn(
                  'absolute inline-flex size-2/3 animate-ping rounded-full bg-primary/75',
                  type === 'seasons' && 'bg-[#5e81ac]',
                  type === 'area' && 'bg-accent'
                )}
              />
              post photo!
            </button>
          )}
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
