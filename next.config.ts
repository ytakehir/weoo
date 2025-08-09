import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://fashionsnap-assets.com/**')]
  }
}

export default nextConfig
