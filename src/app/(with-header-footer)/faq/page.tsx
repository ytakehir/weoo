import { Noto_Sans_JP } from 'next/font/google'
import { FAQ } from '@/components/faq'

const notosan = Noto_Sans_JP({
  weight: '500',
  subsets: ['latin']
})

export default function FAQPage() {
  return (
    <div className={notosan.className}>
      <FAQ />
    </div>
  )
}
