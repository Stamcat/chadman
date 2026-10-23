import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox"

const rowStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
} as const

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    defaultChecked: false,
    disabled: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
      description: "A named size, or any number used directly as the --checkbox-size scale",
    },
    disabled: {
      control: "boolean",
      description: "Disables the checkbox",
    },
    indeterminate: {
      control: "boolean",
      description: "Visual-only mixed state; managed separately from checked",
    },
    className: {
      control: "text",
      description: "Optional CSS class name",
    },
    style: {
      control: false,
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Indeterminate: Story = {
  args: {
    checked: false,
    indeterminate: true,
  },
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
      <Checkbox size="sm" defaultChecked />
      <Checkbox size="default" defaultChecked />
      <Checkbox size="lg" defaultChecked />
      <Checkbox size={1.75} defaultChecked />
    </div>
  ),
}

export const Invalid: Story = {
  args: {
    "aria-invalid": "true",
  },
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Only a real disable is supported — there's no style-only \"looks disabled\" class.",
      },
    },
  },
  render: () => (
    <div style={rowStyle}>
      <Checkbox disabled />
      <Checkbox disabled defaultChecked />
    </div>
  ),
}

export const SelectAll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A common tri-state pattern: the parent checkbox's checked state is fully controlled, and indeterminate is derived separately.",
      },
    },
  },
  render: () => {
    function SelectAllExample() {
      const [items, setItems] = useState([true, false, false])
      const allChecked = items.every(Boolean)
      const someChecked = items.some(Boolean)

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <Checkbox
              checked={allChecked}
              indeterminate={someChecked && !allChecked}
              onCheckedChange={(checked) => setItems(items.map(() => checked))}
            />
            Select all
          </label>
          {items.map((checked, index) => (
            <label key={index} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", paddingLeft: "1.25rem" }}>
              <Checkbox
                checked={checked}
                onCheckedChange={(next) =>
                  setItems(items.map((value, itemIndex) => (itemIndex === index ? next : value)))
                }
              />
              Item {index + 1}
            </label>
          ))}
        </div>
      )
    }

    return <SelectAllExample />
  },
}
