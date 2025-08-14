import type { Meta, StoryObj } from '@storybook/react'
import { FAQ } from '@/components/page/faq'

const meta: Meta<typeof FAQ> = {
  component: FAQ
}

export default meta

export const Default: StoryObj<typeof FAQ> = {
  render: () => {
    return <FAQ />
  }
}
