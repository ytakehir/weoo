import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/internal/test'
import { MissionCard } from '@/components/card/mission-card'

const meta: Meta<typeof MissionCard> = {
  component: MissionCard
}

export default meta

export const Default: StoryObj<typeof MissionCard> = {
  args: {
    mission: (
      <>
        本屋に行って
        <br />
        お互いに本を
        <br />
        プレゼントしあう
      </>
    ),
    onClickMission: fn()
  },
  render: (args) => {
    return <MissionCard {...args} />
  }
}
