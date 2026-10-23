import type { Meta, StoryObj } from "@storybook/react-vite"
import { Loader2, Mail, Plus, Trash2 } from "lucide-react"
import type { CSSProperties } from "react"
import { Button } from "@/components/atoms/Button/Button"

const rowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
}

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "default",
    type: "button",
    disabled: false,
  },
  argTypes: {
    children: {
      control: "text",
      description: "Button label content",
    },
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
      description: "A named size, or any number used directly as the --button-size scale",
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "Native button type attribute",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    className: {
      control: "text",
      description: "Optional CSS class name",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label when text content is not descriptive",
    },
    style: {
      control: false,
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = {
  args: {
    variant: "outline",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
}

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
}

export const Link: Story = {
  args: {
    variant: "link",
  },
}

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: "All variants side by side for a quick visual diff.",
      },
    },
  },
  render: () => (
    <div style={rowStyle}>
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "No special integration needed — icons are just children, scaled relative to --button-size alongside the text.",
      },
    },
  },
  render: () => (
    <div style={rowStyle}>
      <Button variant="default">
        <Mail /> Email
      </Button>
      <Button variant="outline">
        New <Plus />
      </Button>
      <Button variant="destructive" size="icon" aria-label="Delete">
        <Trash2 />
      </Button>
    </div>
  ),
}

export const MultipleSizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "Named sizes and raw numeric scales can be mixed on the same layout without affecting each other.",
      },
    },
  },
  render: () => (
    <div style={rowStyle}>
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size={0.5}>size=0.5</Button>
      <Button size={1.75}>size=1.75</Button>
    </div>
  ),
}

export const Mini: Story = {
  args: {
    children: "Mini",
    variant: "secondary",
    size: 0.5,
  },
}

export const XL: Story = {
  args: {
    children: "XL",
    variant: "secondary",
    size: 1.75,
  },
}

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
}

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "No built-in loading state — show a spinner icon as the child content, disable the button, and let the consuming app's CSS animate it.",
      },
    },
  },
  args: {
    children: (
      <>
        <Loader2 /> Please wait
      </>
    ),
    disabled: true,
  },
}

export const AsSubmit: Story = {
  args: {
    children: "Save",
    type: "submit",
    "aria-label": "Save form",
  },
}

export const WithClassName: Story = {
  args: {
    children: "Class + Variant",
    variant: "secondary",
    className: "custom-cta",
  },
}

export const WithAriaLabel: Story = {
  args: {
    children: <Plus />,
    size: "icon",
    variant: "outline",
    "aria-label": "Add item",
  },
}

export const WithCustomStyles: Story = {
  args: {
    children: "Custom Style",
    variant: "outline",
    style: {
      borderStyle: "dashed",
      borderColor: "var(--destructive)",
      color: "var(--destructive)",
    },
  },
}
