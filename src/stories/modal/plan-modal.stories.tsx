import type { Meta, StoryObj } from '@storybook/react'
import { addDays } from 'date-fns'
import { useState } from 'react'
import { fn } from 'storybook/internal/test'
import { PlanModal } from '@/components/modal/plan-modal'

const meta: Meta<typeof PlanModal> = {
  component: PlanModal
}

export default meta

export const Default: StoryObj<typeof PlanModal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    return (
      <PlanModal
        isOpen={isOpen}
        onIsOpen={() => setIsOpen(!isOpen)}
        onSubscribe={fn()}
        trailEndDate={addDays(new Date(), 7)}
      />
    )
  }
}
