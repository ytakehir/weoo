import Link from 'next/link'
import { FaInstagram, FaTiktok } from 'react-icons/fa6'

export function Footer() {
  return (
    <footer className='footer footer-horizontal footer-center w-screen rounded bg-base-200 p-10 text-base-content'>
      <nav className='grid grid-flow-col gap-4'>
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
          Privacy policy
        </Link>
        <Link className='link link-hover' href='/terms'>
          Terms
        </Link>
      </nav>
      <nav>
        <div className='grid grid-flow-col gap-4'>
          <Link href='/'>
            <FaInstagram className='size-6' />
          </Link>
          <Link href='/'>
            <FaTiktok className='size-6' />
          </Link>
        </div>
      </nav>
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by weoo</p>
      </aside>
    </footer>
  )
}
