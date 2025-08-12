import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  nav: {
    title: string
    link: string
  }[]
  isSubscription: boolean
}

export async function Header({ nav, isSubscription }: Props) {
  return (
    <header className='fixed top-0 right-0 left-0 z-50 w-full bg-base-100'>
      <div className='container mx-auto px-4 py-4 sm:px-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Image src={'/logo.png'} alt='logo' width={32} height={32} />
            <Link href='/'>
              <h1 className='font-extrabold text-2xl text-primary/70'>weoo</h1>
            </Link>
          </div>

          <nav className='hidden items-center space-x-8 md:flex'>
            {nav.map((nav) => (
              <Link
                key={nav.title}
                href={nav.link}
                className='group relative text-base-content/70 transition-colors hover:text-base-content'
              >
                {nav.title}
                <span className='-bottom-1 absolute left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full' />
              </Link>
            ))}
          </nav>

          <div className='flex items-center space-x-4'>
            {!isSubscription ? (
              <label htmlFor='side-bar' className='drawer-button'>
                <Menu className='size-5' />
              </label>
            ) : (
              <Link href='/signin'>
                <button type='button' className='btn btn-sm btn-link text-sm no-underline'>
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
