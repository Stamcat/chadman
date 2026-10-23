import type { Preview } from '@storybook/react-vite'
import '../src/index.scss'
import { ThemeProvider } from '../src/styles/theme'
import { tealTheme } from '../src/stories/examples/themes/teal'

const THEMES = {
  default: undefined,
  teal: tealTheme,
} as const

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  globalTypes: {
    theme: {
      description: 'Runtime theme (ThemeProvider)',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: Object.keys(THEMES).map((value) => ({ value, title: value })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'default',
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={THEMES[context.globals.theme as keyof typeof THEMES]}>
        <Story />
      </ThemeProvider>
    ),
  ],
};


export default preview;
