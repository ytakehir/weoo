'use client'

import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import { cn } from '@/lib/tailwind'

const notosan = Noto_Sans_JP({
  weight: '500',
  subsets: ['latin']
})

export default function Commerce() {
  const UPDATED_AT = new Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' }).format(new Date())

  return (
    <div className={cn('min-h-screen bg-background', notosan.className)}>
      <div className='container mx-auto max-w-4xl px-4 py-16'>
        {/* Hero */}
        <div className='mb-16 space-y-6 text-center'>
          <h1 className='font-bold text-4xl text-base-content'>特定商取引法に基づく表記</h1>
          <p className='text-base-content/70 text-xl'>
            本ページは、電気通信役務提供事業（サブスクリプション等）に係る表示です。
          </p>
          <p className='text-base-content/70 text-sm'>最終更新日：{UPDATED_AT}</p>
        </div>

        {/* Content */}
        <div className='prose prose-lg dark:prose-invert max-w-none space-y-8'>
          {/* 1 事業者情報 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>1. 事業者情報</h2>
            <div className='rounded-lg bg-base-200/30 p-6'>
              <p className='text-base-content/70'>法人名：請求があったら遅滞なく開示します</p>
              <p className='text-base-content/70'>オペレーション責任者：山田 剛大</p>
              <p className='text-base-content/70'>住所：ご請求があった場合には速やかに開示いたします</p>
              <p className='text-base-content/70'>電話番号：ご請求があった場合には速やかに開示いたします</p>
              <p className='text-base-content/70'>メールアドレス：{process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? ''}</p>
              <p className='mt-2 text-base-content/50 text-xs'>
                ※ お問い合わせは原則メールにて承っております（受付時間：平日10:00–17:00）。
              </p>
            </div>
          </section>

          {/* 2 販売価格・付帯費用 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>2. 販売価格・付帯費用</h2>
            <ul className='list-disc space-y-2 pl-6 text-base-content/70'>
              <li>月額：500円（税込）</li>
              <li>表示価格は消費税込みです。別途手数料は発生しません。</li>
              <li>通信費等はお客様のご負担となります。</li>
            </ul>
          </section>

          {/* 3 支払い方法・支払い時期 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>3. お支払い方法・お支払い時期</h2>
            <ul className='list-disc space-y-2 pl-6 text-base-content/70'>
              <li>
                お支払い方法：クレジットカード（Visa / Mastercard / Amex 等）、Apple Pay、Google Pay
                ほか、対応ブランドは端末・環境により異なります。
              </li>
              <li>お支払い時期：申込時に初回決済、以後は毎月同日に自動決済されます。</li>
            </ul>
          </section>

          {/* 4 提供時期 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>4. 提供時期</h2>
            <p className='text-base-content/70'>
              決済完了後、直ちに本サービスの利用が可能になります（無料トライアル期間がある場合は、申込後すぐにご利用いただけます）。
            </p>
          </section>

          {/* 5 継続課金・解約 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>5. 継続課金（サブスクリプション）・解約</h2>
            <ul className='list-disc space-y-2 pl-6 text-base-content/70'>
              <li>本サービスは自動継続となります。無料トライアル（14日）終了後は自動的に有料へ移行します。</li>
              <li>解約はマイページの「サブスクリプション管理（カスタマーポータル）」よりいつでも手続き可能です。</li>
              <li>解約後は次回更新日の以降の請求を停止します。すでにお支払い済みの利用期間の返金は行いません。</li>
            </ul>
          </section>

          {/* 6 返品・キャンセル・返金 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>6. 返品・キャンセル・返金</h2>
            <p className='text-base-content/70'>
              デジタルコンテンツの性質上、購入後の返品・返金には対応しておりません（法令に定めのある場合を除く）。
            </p>
          </section>

          {/* 7 動作環境 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>7. 動作環境</h2>
            <p className='text-base-content/70'>
              最新の主要ブラウザ（Chrome /
              Safari等）でのご利用を推奨しています。モバイル回線をご利用の際は十分な通信速度をご用意ください。
            </p>
          </section>

          {/* 8 特記事項（任意） */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>8. 特記事項</h2>
            <p className='text-base-content/70'>
              表示内容は予告なく変更される場合があります。最新情報は本ページをご確認ください。
            </p>
          </section>

          {/* 9 関連ポリシー */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>9. 関連ポリシー</h2>
            <p className='text-base-content/70'>
              ご利用前に以下のポリシーもご確認ください：
              <br />
              <Link className='link' href='/terms'>
                利用規約
              </Link>{' '}
              /{' '}
              <Link className='link' href='/privacy'>
                プライバシーポリシー
              </Link>
            </p>
          </section>
        </div>

        {/* Back */}
        <div className='mt-5 flex justify-center'>
          <Link href='/' className='text-base-content/80 text-sm transition-colors hover:text-info'>
            ← ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
