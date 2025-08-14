import type { Meta, StoryObj } from '@storybook/react'
import { addDays } from 'date-fns'
import { useState } from 'react'
import { fn } from 'storybook/internal/test'
import { UpgradeModal } from '@/components/modal/upgrade-modal'

const meta: Meta<typeof UpgradeModal> = {
  component: UpgradeModal
}

export default meta

export const Default: StoryObj<typeof UpgradeModal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    return (
      <UpgradeModal
        isOpen={isOpen}
        onIsOpen={() => setIsOpen(!true)}
        onSubscribe={fn()}
        trailEndDate={addDays(new Date(), 7)}
      />
    )
  }
}
