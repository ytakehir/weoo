import type { Meta, StoryObj } from '@storybook/react'
import { CardBack } from '@/components/card/card-back'

const meta: Meta<typeof CardBack> = {
  component: CardBack
}

export default meta

export const Default: StoryObj<typeof CardBack> = {
  render: () => {
    return <CardBack />
  }
}
