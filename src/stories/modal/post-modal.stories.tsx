import type { Meta, StoryObj } from '@storybook/react'
import { addDays } from 'date-fns'
import { useState } from 'react'
import { fn } from 'storybook/internal/test'
import { PostModal } from '@/components/modal/post-modal'

const meta: Meta<typeof PostModal> = {
  component: PostModal
}

export default meta

export const Default: StoryObj<typeof PostModal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    return (
      <PostModal
        isOpen={isOpen}
        onIsOpen={() => setIsOpen(!true)}
        onSubscribe={fn()}
        trailEndDate={addDays(new Date(), 7)}
      />
    )
  }
}
