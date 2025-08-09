import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CardShowcase } from '@/components/card/card-showcase'

const meta: Meta<typeof CardShowcase> = {
  component: CardShowcase
}

export default meta

export const Default: StoryObj<typeof CardShowcase> = {
  args: {
    mission: '本屋に行ってお互いに本をプレゼントしあう',
    posts: [
      {
        url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
        date: new Date()
      },
      {
        url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
        date: new Date()
      },
      {
        url: 'https://fashionsnap-assets.com/asset/format=auto,width=1008/article/images/2025/05/korekara-watashitachiha-2025051312-0453afa0-e0b1-46fd-af4f-81fdd9930c72.jpeg',
        date: new Date()
      }
    ]
  },
  render: (args) => {
    const [isLatest, setIsLatest] = useState<boolean>(true)

    return <CardShowcase {...args} isLatest={isLatest} onLatest={() => setIsLatest(!isLatest)} />
  }
}
