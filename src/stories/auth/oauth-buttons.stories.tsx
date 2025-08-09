import type { Meta, StoryObj } from '@storybook/react'
import { OAuthButtons } from '@/components/auth/oauth-buttons'

const meta: Meta<typeof OAuthButtons> = {
  component: OAuthButtons
}

export default meta

export const Default: StoryObj<typeof OAuthButtons> = {
  render: () => {
    return <OAuthButtons />
  }
}
