'use client'

import Link from 'next/link'

export default function Privacy() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto max-w-4xl px-4 py-16'>
        {/* Hero Section */}
        <div className='mb-16 space-y-6 text-center'>
          <h1 className='font-bold text-4xl text-base-content'>プライバシーポリシー</h1>
          <p className='text-base-content/70 text-xl'>
            本ポリシーは、本サービスにおける個人情報の取扱い方針を定めるものです。
          </p>
          <p className='text-base-content/70 text-sm'>
            最終更新日：{new Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' }).format(new Date())}
          </p>
        </div>

        {/* Privacy Content */}
        <div className='prose prose-lg dark:prose-invert max-w-none space-y-8'>
          {/* 1 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>1. 適用範囲</h2>
            <p className='text-base-content/70'>
              本プライバシーポリシー（以下「本ポリシー」）は、当方が提供する本サービスの利用に伴い取得するユーザーの個人情報、利用情報その他の情報の取扱いに適用されます。
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>2. 取得する情報</h2>
            <p className='mb-4 text-base-content/70'>
              当方は、本サービスの提供にあたり、以下の情報を取得することがあります。
            </p>
            <ul className='list-disc space-y-2 pl-6 text-base-content/70'>
              <li>氏名、メールアドレス、プロフィール画像等のアカウント情報</li>
              <li>端末情報（端末ID、OS、ブラウザ情報等）</li>
              <li>アクセスログ、利用履歴、検索履歴</li>
              <li>位置情報（ユーザーが許可した場合）</li>
              <li>お問い合わせ内容等、ユーザーから任意で提供された情報</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>3. 利用目的</h2>
            <p className='mb-4 text-base-content/70'>取得した情報は、以下の目的のために利用します。</p>
            <ul className='list-disc space-y-2 pl-6 text-base-content/70'>
              <li>本サービスの提供・運営</li>
              <li>本人確認、認証機能の提供</li>
              <li>利用状況の分析、サービス改善、新機能開発</li>
              <li>不正利用・セキュリティ対策</li>
              <li>ユーザーからの問い合わせ対応</li>
              <li>法令遵守や権利保護のため</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>4. クッキー等の利用</h2>
            <p className='text-base-content/70'>
              当方は、クッキー（Cookie）、ローカルストレージ、類似技術を使用して、ユーザーの利便性向上やアクセス解析を行います。ブラウザの設定によりこれらを無効化できますが、本サービスの一部機能が利用できなくなる場合があります。
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>5. 第三者提供</h2>
            <p className='text-base-content/70'>
              当方は、法令に基づく場合、本人の同意がある場合、またはサービス提供に必要な業務委託先への提供を除き、ユーザーの個人情報を第三者に提供しません。
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>6. 委託先の管理</h2>
            <p className='text-base-content/70'>
              当方は、業務委託先に対して、契約により個人情報保護を義務付け、適切に監督します。
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>7. 保管期間</h2>
            <p className='text-base-content/70'>
              当方は、利用目的の達成に必要な期間、または法令で定められた期間、ユーザーの情報を保存します。
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>8. ユーザーの権利</h2>
            <p className='mb-4 text-base-content/70'>
              ユーザーは、当方が保有する自己の個人情報について、開示、訂正、削除、利用停止等を求めることができます。これらの請求は、下記「お問い合わせ先」までご連絡ください。
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>9. セキュリティ対策</h2>
            <p className='text-base-content/70'>
              当方は、取得した情報の漏洩、滅失、毀損を防止するため、適切な安全管理措置を講じます。
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>10. プライバシーポリシーの変更</h2>
            <p className='text-base-content/70'>
              当方は、必要に応じて本ポリシーを変更することがあります。重要な変更がある場合は、サイト内通知等でお知らせします。
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className='mb-4 font-bold text-2xl text-base-content'>11. お問い合わせ先</h2>
            <p className='mb-4 text-base-content/70'>本ポリシーに関するお問い合わせは、以下までご連絡ください。</p>
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
