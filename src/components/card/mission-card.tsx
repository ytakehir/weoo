type Props = {
  mission: string
  onClickMission: () => void
}

export function MissionCard({ mission, onClickMission }: Props) {
  return (
    <div className='stack aspect-3/4 max-h-max w-full'>
      <div className='card'>
        <div className='card-body flex size-full flex-col justify-between rounded-box border-2 border-primary bg-base-100 shadow-sm'>
          <h2 className='card-title whitespace-pre-line text-left font-semibold text-4xl/relaxed'>
            {mission.replace(/\\n/g, '\n')}
          </h2>
          <button
            type='button'
            className='card-actions btn btn-link relative w-full items-center justify-center no-underline'
            onClick={onClickMission}
          >
            <span className='absolute inline-flex size-2/3 animate-ping rounded-full bg-primary/75' />
            post photo!
          </button>
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
