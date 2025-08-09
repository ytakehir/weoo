import type { Meta, StoryObj } from '@storybook/react'
import { Header } from '@/components/layout/header'

const meta: Meta<typeof Header> = {
  component: Header
}

export default meta

export const Default: StoryObj<typeof Header> = {
  args: {
    nav: [
      {
        title: ' Features',
        link: ' #features'
      },
      {
        title: ' Pricing',
        link: '#pricing'
      },
      {
        title: ' FAQ',
        link: '/FAQ'
      },
      {
        title: ' Contact',
        link: '/contact'
      }
    ]
  },
  render: (args) => {
    return <Header {...args} />
  }
}
