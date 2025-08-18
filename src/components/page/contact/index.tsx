'use client'

import { ArrowLeft, CheckCircle, CircleAlert, Clock, Mail } from 'lucide-react'
import Link from 'next/link'
import { FormProvider } from 'react-hook-form'
import { ContactForm } from './contact-form'
import { useContactForm } from './hooks'

export function Contact() {
  const { isSubmitted, setIsSubmitted, isSuccess, methods, onSubmit } = useContactForm()

  if (isSubmitted) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background p-4'>
        <div className='mx-auto max-w-md space-y-6 text-center'>
          {isSuccess ? (
            <div className='mx-auto flex h-16 w-16 animate-scale-in items-center justify-center rounded-2xl bg-gradient-to-br from-success/20 to-success/10'>
              <CheckCircle className='h-8 w-8 text-success' />
            </div>
          ) : (
            <div className='mx-auto flex h-16 w-16 animate-scale-in items-center justify-center rounded-2xl bg-gradient-to-br from-error/20 to-error/10'>
              <CircleAlert className='h-8 w-8 text-error' />
            </div>
          )}
          <h1 className='font-bold text-2xl text-base-content'>
            {isSuccess ? '送信完了しました' : '送信に失敗しました'}
          </h1>
          <p className='text-base-content/70'>
            {isSuccess
              ? 'お問い合わせありがとうございます。通常1営業日以内にご返信いたします。'
              : '申し訳ございませんが、入力項目を見直しの上、時間をおいて再度お試しください。'}
          </p>
          <div className='flex flex-col justify-center gap-3 sm:flex-row'>
            <Link href='/'>
              <button type='button' className='btn btn-outline btn-neutral'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                ホームへ戻る
              </button>
            </Link>
            <button type='button' className='btn btn-neutral' onClick={() => setIsSubmitted(false)}>
              もう一度送信する
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto max-w-6xl px-4 py-16'>
      <div className='grid grid-cols-1 gap-12'>
        {/* Contact Information */}
        <div className='space-y-8'>
          <div className='space-y-4'>
            <h1 className='font-bold text-4xl text-base-content'>お問い合わせ</h1>
            <p className='text-base-content/70 text-xl'>
              お題や投稿方法、料金についてなど、ご不明な点があればお気軽にご連絡ください。
            </p>
          </div>

          <div className='space-y-6'>
            <div className='flex items-start space-x-4'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-info/20 to-info/10'>
                <Mail className='h-6 w-6 text-info' />
              </div>
              <div>
                <h3 className='mb-1 font-semibold text-base-content'>メールでのお問い合わせ</h3>
                <p className='mb-2 text-base-content/70 text-sm'>
                  アカウントや料金、操作方法などに関するご質問はこちらからお願いいたします。
                  <br />
                  下の「お問い合わせフォーム」からも送信いただけます。
                </p>
                <p className='mb-2 text-base-content/70 text-sm'>
                  イベント企画やコラボ、メディア取材のご相談もこちらからお願いいたします。
                </p>
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? ''}`}
                  className='font-medium text-primary hover:underline'
                >
                  {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? ''}
                </a>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10'>
                <Clock className='h-6 w-6 text-accent' />
              </div>
              <div>
                <h3 className='mb-1 font-semibold text-base-content'>返信までの目安</h3>
                <p className='text-base-content/70 text-sm'>通常1営業日以内にご返信いたします。</p>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className='rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6'>
            <h3 className='mb-2 font-semibold text-base-content'>すぐに解決したい場合</h3>
            <p className='mb-4 text-base-content/70 text-sm'>
              FAQページに、サービスの使い方や料金の詳細をまとめています。
              <br />
              解約方法なども記載ありますので、ご確認ください。
            </p>
            <Link href='/faq'>
              <button type='button' className='btn btn-outline btn-sm btn-neutral'>
                よくある質問を見る
              </button>
            </Link>
          </div>
        </div>

        {/* Contact Form */}
        <FormProvider {...methods}>
          <ContactForm onSubmit={onSubmit} />
        </FormProvider>
      </div>
    </div>
  )
}
