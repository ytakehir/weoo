import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pyczzkmwevupfiphktwc.supabase.co',
        pathname: '/storage/v1/object/**'
      }
    ],
    minimumCacheTTL: 60
  }
}

export default nextConfig
