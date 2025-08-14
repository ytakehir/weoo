import type { Meta, StoryObj } from '@storybook/react'
import { SignIn } from '@/components/auth/signin'

const meta: Meta<typeof SignIn> = {
  component: SignIn
}

export default meta

export const Default: StoryObj<typeof SignIn> = {
  render: () => {
    return <SignIn plan={'free'} />
  }
}
