import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import type { ContactForm } from './type'

export const useContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSuccess, setSuccess] = useState(false)

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
      const response = await fetch('/api/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          from: data.email,
          to: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? '',
          subject: data.subject,
          message: data.message
        })
      })
      setIsSubmitted(true)
      setSuccess(response.ok)
      window.scrollTo({ top: 0 })
      methods.reset()

      setTimeout(() => {
        setIsSubmitted(false)
        setSuccess(false)
      }, 10000)
    } catch (error) {
      console.error('error:', error)
    }
  }

  return {
    isSubmitted,
    setIsSubmitted,
    isSuccess,
    methods,
    onSubmit
  }
}
