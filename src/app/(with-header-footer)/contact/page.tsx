import { Noto_Sans_JP } from 'next/font/google'
import { Contact } from '@/components/page/contact'

const notosan = Noto_Sans_JP({
  weight: '500',
  subsets: ['latin']
})

export default function ContactPage() {
  return (
    <div className={notosan.className}>
      <Contact />
    </div>
  )
}
