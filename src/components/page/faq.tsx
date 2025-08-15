'use client'

import { HelpCircle, MessageSquare } from 'lucide-react'
import Link from 'next/link'

const FAQ_ITEMS = [
  {
    id: 'mission',
    question: 'お題って何ですか？',
    answer:
      'お題は「今日はこれをやってみよう！」というお題です。2人以上で楽しめる、ちょっと変わった遊びや体験を毎日お届けします。',
    category: 'features'
  },
  {
    id: 'post',
    question: 'どうやって投稿できますか？',
    answer:
      'お題に挑戦して撮った写真をアップロードするだけでOKです。他の人の投稿も閲覧できたり、マイページに思い出として残ります。',
    category: 'features'
  },
  {
    id: 'pricing',
    question: '利用料金はいくらですか？',
    answer:
      '月額500円で全てのお題に参加でき、投稿・閲覧が無制限になります。初回は2週間の無料期間付きです。また、機能は少々制限されますが、1週間の無料トライアルもご用意しています',
    category: 'pricing'
  },
  {
    id: 'latest',
    question: '最新のお題はどうやって決まりますか？',
    answer: '未使用のお題、または2ヶ月以上経過したお題からランダムに選ばれます。毎日違う発見があるようにしています。',
    category: 'features'
  },
  {
    id: 'photo',
    question: '写真は必ず必要ですか？',
    answer: 'はい。このサービスは「体験をシェアする」ことが目的なので、必ず写真を1枚以上アップしてください。',
    category: 'rules'
  },
  {
    id: 'private',
    question: '投稿は誰に見られますか？',
    answer: '登録ユーザーのみが閲覧できます。外部には公開されないため、安心してシェアできます。',
    category: 'privacy'
  },
  {
    id: 'cancel',
    question: '解約は簡単にできますか？',
    answer:
      'はい。サイドバー内の「解約する」ボタンからいつでも解約できます。次回請求日まではサービスを利用できます。',
    category: 'pricing'
  }
]

export function FAQ() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-16'>
      {/* Hero Section */}
      <div className='mb-12 space-y-6 text-center'>
        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-info/20 to-info/10'>
          <HelpCircle className='h-8 w-8 text-info' />
        </div>
        <h1 className='font-bold text-4xl text-base-content'>よくある質問</h1>
        <p className='mx-auto max-w-2xl text-base-content/70 text-xl'>
          このサービスの使い方や料金、お題の仕組みなど、よくある質問をまとめました。
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className='space-y-4'>
        {FAQ_ITEMS.map((item, index) => (
          <div
            key={item.question}
            className='collapse-arrow collapse border border-base-300 bg-base-100'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <input type='radio' name='faq-accordion' defaultChecked={index === 0} />
            <div className='collapse-title font-semibold'>{item.question}</div>
            <div className='collapse-content text-base-content/70 text-sm'>{item.answer}</div>
          </div>
        ))}
      </div>

      {/* contact button */}
      <div className='mt-16 space-y-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center'>
        <h2 className='font-bold text-2xl text-base-content'>解決しませんでしたか？🤔</h2>
        <p className='text-base-content/70'>解決しない場合は、サポートまでお気軽にお問い合わせください。</p>
        <div className='flex flex-col items-center justify-center gap-4'>
          <Link href='/contact' className='btn btn-primary btn-lg w-full text-sm'>
            <MessageSquare className='mr-2 size-5' />
            お問い合わせフォーム
          </Link>
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? ''}`}
            className='btn btn-secondary btn-outline btn-lg w-full text-sm'
          >
            メールで問い合わせる
          </a>
        </div>
      </div>
    </div>
  )
}
