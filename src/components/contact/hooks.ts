import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import type { ContactForm } from './type'

export const useContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const schema = z.object({
    name: z.string().min(1, { message: '名前は必須です' }),
    email: z
      .string()
      .min(1, { message: 'メールアドレスは必須です' })
      .email({ message: '正しい形式のメールアドレスを入力してください' }),
    subject: z.string().min(0),
    message: z.string().min(1, { message: '名前は必須です' }).max(1000, { message: 'メッセージは1000文字以内です' })
  })

  const defaultValues: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }

  const methods = useForm<ContactForm>({
    mode: 'onTouched',
    defaultValues: defaultValues,
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: ContactForm) => {
    try {
      await fetch('/api/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? '',
          to: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? '',
          replyTo: data.email,
          subject: data.subject,
          message: data.message
        })
      })
      setIsSubmitted(true)
      methods.reset()

      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (error) {
      console.error('error:', error)
    }
  }

  return {
    isSubmitted,
    setIsSubmitted,
    methods,
    onSubmit
  }
}
