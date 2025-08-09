import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react'
import { FormProvider, useForm } from 'react-hook-form'
import { fn } from 'storybook/test'
import * as z from 'zod'
import { ContactForm } from '@/components/contact/contact-form'
import type { ContactForm as ContactFormType } from '@/components/contact/type'

const meta: Meta<typeof ContactForm> = {
  component: ContactForm
}

export default meta

export const Default: StoryObj<typeof ContactForm> = {
  args: {
    onSubmit: fn()
  },
  render: (args) => {
    const schema = z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
      subject: z.string().min(0),
      message: z.string().min(1, { message: 'Message is required' })
    })

    const defaultValues: ContactFormType = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    const methods = useForm<ContactFormType>({
      defaultValues: defaultValues,
      resolver: zodResolver(schema)
    })

    return (
      <FormProvider {...methods}>
        <ContactForm {...args} />
      </FormProvider>
    )
  }
}
