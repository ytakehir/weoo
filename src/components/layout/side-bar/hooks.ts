import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export type MissionForm = {
  title: string
}

export const useMissionForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)

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
      await fetch('/api/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
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
