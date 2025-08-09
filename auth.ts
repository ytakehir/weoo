import { PrismaAdapter } from '@auth/prisma-adapter'
import jwt from 'jsonwebtoken'
import NextAuth from 'next-auth'
import Apple from 'next-auth/providers/apple'
import Facebook from 'next-auth/providers/facebook'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Instagram from 'next-auth/providers/instagram'
import Resend from 'next-auth/providers/resend'
import TikTok from 'next-auth/providers/tiktok'
import X from 'next-auth/providers/twitter'
import { prisma } from '@/lib/prisma/client'
import { stripe } from '@/lib/stripe/server'

export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Apple,
    Facebook,
    GitHub,
    Google,
    Instagram,
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY ?? '',
      from: process.env.RESEND_FROM ?? ''
    }),
    TikTok,
    X
  ],
  pages: {
    signIn: '/signin',
    verifyRequest: '/verify'
    // newUser: '/onboarding'
  },
  callbacks: {
    async signIn({ user }) {
      // ここでは重複チェックだけ、createUserでStripe作成
      const existing = await prisma.user.findUnique({ where: { id: user.id } })
      return !!existing
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (typeof token?.id === 'string' && session.user) {
        session.user.id = token.id
      }

      const signingSecret = process.env.SUPABASE_JWT_SECRET
      if (signingSecret && token?.id) {
        session.supabaseAccessToken = jwt.sign(
          {
            aud: 'authenticated',
            exp: Math.floor(new Date(session.expires).getTime() / 1000),
            sub: token.id, // ←ここもtoken.idに
            email: session.user.email,
            role: 'authenticated'
          },
          signingSecret
        )
      }

      return session
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) return `${baseUrl}/pricing`
      return url
    }
  },
  events: {
    async createUser({ user }) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined
      })

      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: customer.id
        }
      })
    }
  }
})
