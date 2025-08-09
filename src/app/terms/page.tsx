'use client'

import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import { cn } from '@/lib/tailwind'

const notosan = Noto_Sans_JP({
  weight: '500',
  subsets: ['latin']
})

export default function Terms() {
  return (
    <div className={cn('min-h-screen bg-background', notosan.className)}>
      <div className='container mx-auto max-w-4xl px-4 py-16'>
        {/* Hero Section */}
        <div className='mb-16 space-y-6 text-center'>
          <h1 className='font-bold text-4xl text-base-content'>利用規約</h1>
          <p className='text-base-content/70 text-xl'>本規約は、本サービスのご利用条件を定めるものです。</p>
          <p className='text-base-content/70 text-sm'>
            最終更新日：{new Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' }).format(new Date())}
          </p>
        </div>

        {/* Terms Content */}
        <div className='prose prose-lg dark:prose-invert max-w-none space-y-8'>
          {/* 1 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>1. 規約への同意</h2>
            <p className='mb-4 text-base-content/70'>
              本サービス（以下「本サービス」）をご利用になる前に、本利用規約（以下「本規約」）を必ずお読みください。ユーザーは、本サービスにアクセス又は利用することにより、本規約に同意したものとみなします。本規約に同意いただけない場合は、本サービスをご利用いただけません。
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>2. サービスの概要</h2>
            <p className='mb-4 text-base-content/70'>
              本サービスは、「2人以上で挑戦できる“今日のお題（ミッション）”」を配信し、ユーザーがその体験を写真で投稿・閲覧できるプラットフォームです。いいね、コメント、外部SNSシェア等の機能は提供しません。最新のミッションは、未使用のお題、または前回の使用から2か月以上経過したお題の中からランダムに選定されます。
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>3. アカウント</h2>
            <h3 className='mb-3 font-semibold text-base-content text-xl'>3.1 作成と管理</h3>
            <p className='mb-4 text-base-content/70'>
              一部機能のご利用にはアカウント作成が必要です。ユーザーは正確かつ最新の情報を提供し、認証情報の管理に責任を負います。不正アクセス等を認識した場合は速やかに当方へご連絡ください。
            </p>
            <h3 className='mb-3 font-semibold text-base-content text-xl'>3.2 利用資格</h3>
            <p className='text-base-content/70'>
              原則として13歳以上の方がご利用いただけます。未成年の方は、法定代理人の同意を得た上でご利用ください。
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>4. サブスクリプションと課金</h2>
            <h3 className='mb-3 font-semibold text-base-content text-xl'>4.1 料金</h3>
            <p className='mb-4 text-base-content/70'>
              本サービスはサブスクリプション制です。料金、請求期間、支払方法はアプリ内または決済画面に表示される条件に従います。表示価格は税込／税抜いずれかを明記します。
            </p>
            <h3 className='mb-3 font-semibold text-base-content text-xl'>4.2 自動更新</h3>
            <p className='mb-4 text-base-content/70'>
              サブスクリプションは、ユーザーが解約するまで自動的に更新されます。更新日前に課金が行われる場合があります。
            </p>
            <h3 className='mb-3 font-semibold text-base-content text-xl'>4.3 解約・返金</h3>
            <p className='text-base-content/70'>
              解約はいつでも可能です。解約後も、当該請求期間の終了まではサービスを利用できます。期間途中の返金は原則として行いません（法令で認められる場合を除きます）。各ストア／決済事業者の規約が優先される場合があります。
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>5. 投稿コンテンツ</h2>
            <h3 className='mb-3 font-semibold text-base-content text-xl'>5.1 ユーザーの責任</h3>
            <p className='mb-4 text-base-content/70'>
              ユーザーは、自身が投稿する写真・テキスト等（以下「ユーザーコンテンツ」）について、適法性・権利処理（被写体の肖像権・著作権・利用許諾等）を含め、全責任を負います。第三者の権利・利益を侵害しないようご注意ください。
            </p>
            <h3 className='mb-3 font-semibold text-base-content text-xl'>5.2 ライセンス</h3>
            <p className='mb-4 text-base-content/70'>
              ユーザーは、ユーザーコンテンツに関する権利を保持します。ただし、本サービスの提供・運営・表示・品質改善のため、当方に対し、世界的かつ非独占的・無償で、ユーザーコンテンツを保存・複製・表示・加工（サムネイル生成等）する権利を許諾するものとします。
            </p>
            <h3 className='mb-3 font-semibold text-base-content text-xl'>5.3 表示範囲</h3>
            <p className='text-base-content/70'>
              投稿は登録ユーザーに限定して表示され、外部には公開されません（ただし、法令遵守・不正対策・システム保護の目的で必要な範囲を除きます）。
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>6. 禁止事項</h2>
            <p className='mb-4 text-base-content/70'>ユーザーは、以下の行為を行ってはなりません。</p>
            <ul className='list-disc space-y-2 pl-6 text-base-content/70'>
              <li>法令又は公序良俗に違反する行為</li>
              <li>第三者の権利（知的財産権、肖像権、プライバシー等）を侵害する行為</li>
              <li>差別・誹謗中傷・過度に暴力的/わいせつなコンテンツの投稿</li>
              <li>許可なく商用宣伝・勧誘を目的とする利用</li>
              <li>リバースエンジニアリングその他不正アクセスに該当する行為</li>
              <li>本サービスの運営・ネットワークを妨害する行為</li>
              <li>当方が不適切と合理的に判断する行為</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>7. サービスの変更・中断・終了</h2>
            <p className='text-base-content/70'>
              当方は、ユーザーへの事前通知の有無にかかわらず、本サービスの全部又は一部の内容を変更・一時停止・終了することができます。これによりユーザーに生じた損害について、法令で責任が認められる場合を除き、当方は責任を負いません。
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>8. 免責事項</h2>
            <p className='mb-4 text-base-content/70'>
              当方は、本サービスに関して、事実上又は法律上の瑕疵（安全性・信頼性・正確性・完全性・有効性・特定目的適合性・セキュリティ等）につき、明示的にも黙示的にも保証しません。
            </p>
            <p className='text-base-content/70'>
              当方は、ユーザー間又はユーザーと第三者との間で生じた紛争等について、一切の責任を負いません。ただし、当方の故意又は重過失に起因する場合はこの限りではありません。
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>9. プライバシー</h2>
            <p className='text-base-content/70'>
              当方の個人情報の取扱いは、別途定めるプライバシーポリシーによります。ユーザーは、プライバシーポリシーを確認・同意の上、本サービスを利用するものとします。
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>10. 規約の変更</h2>
            <p className='text-base-content/70'>
              当方は、必要に応じて本規約を変更できます。重要な変更を行う場合は、アプリ内表示その他適切な方法で周知します。変更後にユーザーが本サービスを利用した場合、当該変更に同意したものとみなします。
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>11. 準拠法・裁判管轄</h2>
            <p className='text-base-content/70'>
              本規約は日本法に準拠し解釈されます。本サービス又は本規約に関して当方とユーザーとの間で紛争が生じた場合、当方本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>12. 連絡先</h2>
            <p className='mb-4 text-base-content/70'>本規約に関するお問い合わせは、以下までご連絡ください。</p>
            <div className='space-y-2 rounded-lg bg-base-200/30 p-6'>
              <p className='text-base-content/70'>
                <strong>Email:</strong> {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@example.com'}
              </p>
            </div>
          </section>
        </div>
        <div className='mt-5 flex justify-center'>
          <Link href='/' className='text-base-content/80 text-sm transition-colors hover:text-info'>
            ← ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
