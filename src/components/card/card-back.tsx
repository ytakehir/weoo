import Image from 'next/image'

export function CardBack() {
  return (
    <div className='stack aspect-3/4 max-h-max w-full'>
      <div className='card'>
        <div className='card-body flex size-full flex-col items-center justify-center rounded-box border-2 border-primary bg-base-100 shadow-sm'>
          <Image src={'/logo.png'} alt='logo' width={120} height={120} />
          <h2 className='card-title font-semibold text-4xl text-primary'>weoo</h2>
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
