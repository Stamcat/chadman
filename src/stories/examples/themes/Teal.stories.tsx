import type { Meta, StoryObj } from "@storybook/react-vite"

const usageExample = `import { ThemeProvider } from "@stamcat/chadman/theme";
import { Button } from "@stamcat/chadman/Button";

const tealTheme = {
  colors: {
    "--primary": "#068089",
    "--primary-foreground": "#ffffff",
    "--border": "#068089",
    "--ring": "#068089",
    "--radius": "0.5rem",
  },
  components: {
    // raw CSS for states that aren't exposed as standalone tokens
    button: \`.button--outline { color: #068089; }\`,
  },
};

<ThemeProvider theme={tealTheme}>
  <Button>Themed button</Button>
</ThemeProvider>`

const preStyle = {
  background: "var(--muted)",
  color: "var(--muted-foreground)",
  padding: "1rem",
  borderRadius: "var(--radius-md)",
  overflowX: "auto",
} as const

const meta = {
  title: "Guides/Theming",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "How to re-skin components at runtime with `ThemeProvider`. Use the **Theme** toolbar control at the top of Storybook to switch every story between `default` and `teal` live — it's wired up in `.storybook/preview.tsx` using this exact theme, so that control doubles as the working example instead of a separate live-demo story here.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const HowTo: Story = {
  render: () => (
    <div>
      <p>
        <code>theme.colors</code> overrides design tokens (covers most variants for free);{" "}
        <code>theme.components</code> is raw CSS for states a token doesn't cover (e.g. a specific
        variant's hover color). Wrap whatever part of the tree should be themed:
      </p>
      <pre style={preStyle}>
        <code>{usageExample}</code>
      </pre>
      <p>
        See <code>src/styles/theme/AGENTS.md</code> for the full <code>Theme</code> shape and hard
        rules (never pass untrusted/user-supplied strings into it), and{" "}
        <code>src/stories/examples/themes/teal.ts</code> for this Storybook's actual teal theme
        definition.
      </p>
    </div>
  ),
}
