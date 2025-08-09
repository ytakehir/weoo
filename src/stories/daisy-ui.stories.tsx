import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  component: () => null
}

export default meta

export const Default: StoryObj = {
  render: () => {
    return (
      <div className='absolute top-0 left-0 w-full'>
        <iframe
          src='https://react.daisyui.com/?path=/docs/welcome--docs'
          style={{
            width: '100%',
            height: '800px'
          }}
          title='daisyUI Storybook'
        />
      </div>
    )
  }
}
