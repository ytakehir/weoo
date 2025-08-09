import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from '@/components/layout/footer'

const meta: Meta<typeof Footer> = {
  component: Footer
}

export default meta

export const Default: StoryObj<typeof Footer> = {
  render: () => {
    return <Footer />
  }
}
