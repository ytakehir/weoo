## quick start
### create .env file & setup husky
1. run `cp .env.example .env`
1. run `npm run prepare`

### setting NextAuth.js
1. npm run auth
1. `AUTH_SECRET` copy `env.local` to `.env`

### setting Supabase
1. create project & get secret key (`NEXT_PUBLIC_SUPABASE_URL` `NEXT_PUBLIC_SUPABASE_ANON_KEY` `SUPABASE_URL` `SUPABASE_SERVICE_ROLE_KEY`)

### setting Prisma
1. connect Supabase & get `DATABASE_URL` `DIRECT_URL`
2. run `npm run prisma:migrate`

### setting Stripe
1. create project & get secret key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` `STRIPE_SECRET_KEY`)
1. install [Stripe CLI](https://docs.stripe.com/stripe-cli#install)
1. create local webhook key `npm run stripe:webhook`
1. create products & get product ID
1. set webhook URL

### setting Resend
1. create project & get secret key (`RESEND_KEY`)
1. your email address to `RESEND_FROM`


## Tech Stack
### FrontEnd
- [Next.js(App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://ja.react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
  - [Storybook](https://react.daisyui.com/?path=/story/utils-theme--default)
  - [Figma](https://www.figma.com/community/file/1329403370748903347/daisyui-tailwind-components-community-design-system)
- [Lucide React](https://lucide.dev/)
- [react-icons](https://react-icons.github.io/react-icons/)
- [Storybook](https://storybook.js.org/)

### BackEnd
- [Next.js(App Router)](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Prisma](https://www.prisma.io/)

### Third Party
#### Auth
- [NextAuth.js](https://next-auth.js.org/)

#### Payment
- [Stripe](https://stripe.com/jp)

#### Mail
- [Resend](https://resend.com/)
- [Cloudflare Email Routing](https://www.cloudflare.com/ja-jp/developer-platform/products/email-routing/)

#### Form
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

#### Lint
- [Biome](https://biomejs.dev/)
- [husky](https://typicode.github.io/husky/)

#### Deployment
- [Vercel](https://vercel.com/)

#### Observability
- [Vercel Web Analytics](https://vercel.com/docs/analytics)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
