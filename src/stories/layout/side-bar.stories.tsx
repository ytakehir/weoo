import type { Meta, StoryObj } from '@storybook/react'
import { SideBar } from '@/components/layout/side-bar'

const meta: Meta<typeof SideBar> = {
  component: SideBar
}

export default meta

export const Default: StoryObj<typeof SideBar> = {
  render: () => {
    return <SideBar isSubscription={true}/>
  }
}
