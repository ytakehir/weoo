import Image from 'next/image'

export default function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-base-100'>
      <div className='space-y-4 text-center'>
        <div className='flex items-center justify-center'>
          <div className='mx-auto flex size-16 items-center justify-center'>
            <Image src='/logo.png' alt='logo' width={64} height={64} />
          </div>
        </div>
        <div className='flex items-stretch justify-center gap-1 space-y-2'>
          <h2 className='font-semibold text-base-content text-lg'>Loading</h2>
          <span className='loading loading-dots loading-xs text-base-content' />
        </div>
      </div>
    </div>
  )
}
