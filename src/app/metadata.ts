import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'weoo（ウィーオー）',
    template: '%s | weoo（ウィーオー）'
  },
  description:
    'weoo（ウィーオー）は、2人以上で挑戦できるデイリーミッション配信サービス。友達や恋人と毎日ちょっと特別な体験を楽しめます。デート、放課後、休日の新しい遊び方に。これから私たちは、何をするか迷った時もおすすめです。',
  keywords: [
    'weoo',
    'ウィーオー',
    'お題アプリ',
    'デイリーミッション',
    '友達と遊べるアプリ',
    'デートアプリ',
    'デートアイデア',
    '放課後の遊び',
    '写真映えスポット',
    'カップル向け',
    '友達向けアクティビティ'
  ],
  authors: [{ name: 'weoo' }],
  creator: 'weoo',
  publisher: 'weoo',
  metadataBase: new URL('https://weoo.jp'),
  alternates: {
    canonical: 'https://weoo.jp'
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://weoo.jp',
    title: 'weoo（ウィーオー） - 2人以上で楽しめるデイリーミッション',
    description:
      '友達や恋人と、毎日ちょっと特別な体験を。weooは、2人以上で挑戦できる「今日のお題」を毎日配信するサービスです。写真を撮って思い出を共有しよう。',
    siteName: 'weoo（ウィーオー）',
    images: [
      {
        url: 'https://weoo.jp/og-image.png',
        width: 1200,
        height: 630,
        alt: 'weoo（ウィーオー）のサービス紹介画像'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'weoo（ウィーオー） - 2人以上で楽しめるデイリーミッション',
    description:
      '友達や恋人と、毎日ちょっと特別な体験を。weooは、2人以上で挑戦できる「今日のお題」を毎日配信するサービスです。写真を撮って思い出を共有しよう。',
    images: ['https://weoo.jp/og-image.png'],
    creator: '@weoo_app'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  appleWebApp: {
    capable: true,
    title: 'weoo（ウィーオー）',
    statusBarStyle: 'default'
  }
}
