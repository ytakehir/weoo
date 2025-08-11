import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'weoo',
    short_name: 'weoo',
    description: '',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192x192.webp',
        sizes: '192x192',
        type: 'image/webp'
      },
      {
        src: '/icon-512x512.webp',
        sizes: '512x512',
        type: 'image/webp'
      }
    ],
    categories: ['sns'],
    lang: 'jp',
    dir: 'ltr'
  }
}
