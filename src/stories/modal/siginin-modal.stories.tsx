import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from 'storybook/internal/test'
import { SigninModal } from '@/components/modal/signin-modal'

const meta: Meta<typeof SigninModal> = {
  component: SigninModal
}

export default meta

export const Default: StoryObj<typeof SigninModal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    return <SigninModal isOpen={isOpen} onIsOpen={() => setIsOpen(!true)} onSubscribe={fn()} onSignin={fn()} />
  }
}
