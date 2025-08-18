import type { Meta, StoryObj } from '@storybook/react'
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

    return <PostModal isOpen={isOpen} onIsOpen={() => setIsOpen(!isOpen)} onSubmit={fn()} />
  }
}
