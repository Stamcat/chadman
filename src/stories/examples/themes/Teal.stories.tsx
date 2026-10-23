import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/components/atoms/Button/Button"
import { ThemeProvider } from "@/styles/theme"
import { tealTheme } from "./teal"

const rowStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
} as const

const meta = {
  title: "Examples/Themes/Teal",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Runtime theme example built with `ThemeProvider`, re-skinning Button to match https://github.com/Stamcat/craftsman/tree/main/.storybook/themes/teal. See `src/stories/examples/themes/teal.ts` for the theme definition.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: () => (
    <ThemeProvider theme={tealTheme}>
      <div style={rowStyle}>
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="default" disabled>
          Disabled
        </Button>
      </div>
    </ThemeProvider>
  ),
}
