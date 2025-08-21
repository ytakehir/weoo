import type { Meta, StoryObj } from '@storybook/react'
import { Docs } from '@/components/layout/docs'

const meta: Meta<typeof Docs> = {
  component: Docs
}

export default meta

export const Default: StoryObj<typeof Docs> = {
  render: () => {
    return <Docs />
  }
}
