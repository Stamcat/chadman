# Message — Agent Usage Notes

Import:

```tsx
import { Message, MessageGroup, MessageAvatar, MessageContent, MessageHeader, MessageFooter } from "@stamcat/chadman/ai/Message";
```

Ported from shadcn/ui's [Message](https://ui.shadcn.com/docs/ai-elements/base/message) AI Elements pattern — one turn in a chat/agent thread (the person's message, or the agent's reply with its actions). Unlike `Button`/`Checkbox`, this is plain styled `<div>` composition, not a Base UI primitive — there's no keyboard/focus behavior to wire up, it's purely a layout/visual pattern.

Exports:

- `Message` — the turn's root container. `align?: "start" | "end"` (default: `"start"`) controls which side the turn renders on (use `"end"` for the person's own messages, `"start"` for the agent's replies). All other props are native `<div>` props.
- `MessageGroup` — wraps multiple consecutive `Message`s into a vertical stack (e.g. grouping an agent's reply with a follow-up tool call).
- `MessageAvatar` — the turn's avatar slot. Automatically shifts upward via CSS when a `MessageFooter` is present in the same `Message`, so it visually sits beside the content instead of the footer.
- `MessageContent` — the turn's main body (text, markdown, or a `Bubble`-wrapped quote). When the parent `Message` has `align="end"`, every direct child with a `data-slot` attribute (e.g. a nested `Bubble`) self-aligns to the right.
- `MessageHeader` — optional small-text header above the content (e.g. a sender name or timestamp).
- `MessageFooter` — optional action row below the content (e.g. copy/retry/feedback buttons); right-aligns automatically when the parent `Message` has `align="end"`.

All six components are plain native `<div>` wrappers — every prop is a standard `ComponentProps<"div">` prop (no `className`/`style` render-prop function support, unlike `Button`/`Checkbox`, since there's no Base UI primitive underneath). `className` is preserved and merged after the component's own class.

Behavior notes:

- No `variant`/`size` prop and no `--{component}-size` scaling — Message is a structural/layout pattern, not a sizable visual control.
- Each component renders a `data-slot` attribute (`message`, `message-group`, `message-avatar`, `message-content`, `message-header`, `message-footer`) matching shadcn's original naming, useful for targeting with a consumer's own CSS if needed.
- This is a first-pass, intentionally thin port (`ai` tier POC) — it ports Message's own structure only. It does NOT yet port `Bubble` or `Tooltip`, which shadcn's own Message usage examples compose alongside it (e.g. wrapping the person's text in a `Bubble` with `align="end" variant="muted"`). Bring those in separately before reproducing shadcn's full usage examples.

Example:

```tsx
<Message align="end">
  <MessageContent>How do I add a settings dialog?</MessageContent>
</Message>
<Message>
  <MessageContent>
    <p>Install Dialog, then open it from the gear button.</p>
    <MessageFooter>
      <Button variant="ghost" size="icon-sm" aria-label="Copy">
        <CopyIcon />
      </Button>
    </MessageFooter>
  </MessageContent>
</Message>
```
