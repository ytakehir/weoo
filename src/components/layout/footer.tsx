import Link from 'next/link'
import { FaTiktok } from 'react-icons/fa6'

export function Footer() {
  return (
    <footer className='footer footer-horizontal footer-center w-screen rounded bg-base-200 p-10 text-base-content'>
      <nav className='grid grid-cols-5 gap-4'>
        <Link className='link link-hover' href='/signin'>
          Signin
        </Link>
        <Link className='link link-hover' href='/contact'>
          Contact
        </Link>
        <Link className='link link-hover' href='/faq'>
          FAQ
        </Link>
        <Link className='link link-hover' href='/privacy'>
          Privacy
        </Link>
        <Link className='link link-hover' href='/terms'>
          Terms
        </Link>
        <Link className='link link-hover col-span-5' href='/commerce'>
          特定商取引法に基づく表記
        </Link>
      </nav>
      <nav>
        <div className='grid grid-flow-col gap-4'>
          <Link className='flex items-center gap-x-2' href='https://www.tiktok.com/@weoo_official'>
            <FaTiktok className='size-6' />
            <span className='font-semibold text-lg'>TikTok</span>
          </Link>
        </div>
      </nav>
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by weoo</p>
      </aside>
    </footer>
  )
}
