import type { Meta, StoryObj } from '@storybook/react'
import { FlipCard } from '@/components/card/flip-card'

const meta: Meta<typeof FlipCard> = {
  component: FlipCard
}

export default meta

export const Default: StoryObj<typeof FlipCard> = {
  args: {
    post: {
      mission: (
        <>
          本屋に行って
          <br />
          お互いに本を
          <br />
          プレゼントしあう
        </>
      ),
      url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
      date: new Date()
    }
  },
  render: (args) => {
    return <FlipCard {...args} />
  }
}
