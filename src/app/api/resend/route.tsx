import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_KEY ?? '')

export async function POST(req: NextRequest) {
  try {
    const { name, from, to, subject, message } = await req.json()

    if (!name || !from || !to || !subject || !message)
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })

    const { data, error } = await resend.emails.send({
      from: `${name} <${from}>`,
      to: `weoo サポートチーム <${to}>`,
      replyTo: from,
      subject: subject,
      text: `From: ${name} <${from}>\n\n${message}`
    })

    if (error) {
      return NextResponse.json({ error: error }, { status: 400 })
    }

    return NextResponse.json({ data: data }, { status: 200 })
    // biome-ignore lint/suspicious/noExplicitAny: try-catch
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
  }
}
