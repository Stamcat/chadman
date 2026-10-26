import type { Meta, StoryObj } from "@storybook/react-vite"
import { Message, MessageContent, MessageFooter } from "@/components/ai/Message/Message"

const meta = {
  title: "AI Elements/Message",
  component: Message,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["start", "end"],
      description: "Which side the turn renders on",
    },
    className: {
      control: "text",
      description: "Optional CSS class name",
    },
  },
} satisfies Meta<typeof Message>

export default meta
type Story = StoryObj<typeof meta>

export const PersonTurn: Story = {
  args: {
    align: "end",
  },
  render: (args) => (
    <Message {...args}>
      <MessageContent>How do I add a settings dialog?</MessageContent>
    </Message>
  ),
}

export const AgentTurnWithFooter: Story = {
  args: {
    align: "start",
  },
  render: (args) => (
    <Message {...args}>
      <MessageContent>
        <p>Install Dialog, then open it from the gear button.</p>
        <MessageFooter>Copy · Retry</MessageFooter>
      </MessageContent>
    </Message>
  ),
}
