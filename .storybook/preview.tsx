import type { Preview, ReactRenderer } from '@storybook/nextjs-vite'
import '../src/styles/globals.css'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { themes } from './themes'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      test: 'todo'
    },
    backgrounds: {
      default: 'custom',
      values: [
        {
          name: 'custom',
          value: '#fefefe' // 固定したい背景色（白、黒、灰色など）
        }
      ]
    }
  },
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: Object.fromEntries(themes.map((t: string) => [t, t])),
      defaultTheme: 'light',
      attributeName: 'data-theme'
    }),
    (Story) => {
      document.body.className = 'bg-base-100'

      return (
        <div className='relative flex min-h-screen items-start bg-base-100 p-10'>
          <Story />
        </div>
      )
    }
  ]
}

export default preview
