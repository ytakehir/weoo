import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createMissionSubmissions } from '@/lib/supabase/actions/mission'

export type MissionForm = {
  title: string
}

export const useMissionForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [_, startTransition] = useTransition()

  const schema = z.object({
    title: z.string().min(2, { message: '2文字以上入力してください' }).max(50, { message: 'お題は50文字までです' })
  })

  const defaultValues: MissionForm = {
    title: ''
  }

  const methods = useForm<MissionForm>({
    mode: 'onTouched',
    defaultValues: defaultValues,
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: MissionForm) => {
    try {
      createMissionSubmissions(data.title)
      setIsSubmitted(true)
      methods.reset()

      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (error) {
      console.error('error:', error)
    }
  }

  const handlePortal = async () => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/stripe/customer-portal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const { url } = await response.json()
        window.location.href = url
      } catch (error) {
        console.error('error:', error)
      }
    })
  }

  return {
    isSubmitted,
    setIsSubmitted,
    methods,
    onSubmit,
    handlePortal
  }
}
