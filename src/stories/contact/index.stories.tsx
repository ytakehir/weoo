import type { Meta, StoryObj } from '@storybook/react'
import { Contact } from '@/components/page/contact'

const meta: Meta<typeof Contact> = {
  component: Contact
}

export default meta

export const Default: StoryObj<typeof Contact> = {
  render: () => {
    return <Contact />
  }
}

export const Send: StoryObj<typeof Contact> = {
  render: () => {
    return <Contact />
  }
}
