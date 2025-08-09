import { Resend } from 'resend'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_KEY ?? '')

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'takegryffindor@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
})
