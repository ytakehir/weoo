import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import type { SignInForm } from './type'

export const useAuthForm = () => {
  const schema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' })
  })

  const defaultValues: SignInForm = {
    email: ''
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInForm>({
    mode: 'onTouched',
    defaultValues: defaultValues,
    resolver: zodResolver(schema)
  })

  const handleSignIn = async (data: SignInForm) => {
    const { email } = data
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('email', email)
    }

    await signIn('resend', { email, redirectTo: '/' })
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleSignIn
  }
}
