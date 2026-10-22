# Project Setup

## Required CSS imports

Components ship their styles as a side effect of importing them — no separate stylesheet import is needed for a component itself:

```tsx
import { Button } from "@stamcat/chadman/Button";
```

Design tokens (CSS custom properties for color and shape) are a separate import and must be included once, globally, before any component is rendered:

```ts
import "@stamcat/chadman/styles/tokens";
```

## Design tokens

All colors and shape values are unitless-free CSS custom properties (already valid CSS values, e.g. `oklch(...)`, `0.625rem`) — use `var(--token-name)` directly, with no multiplication or unit conversion needed.

Semantic tokens (prefer these over anything else):
- Surfaces: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`
- Actions: `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`
- Status: `--destructive`
- Form/interactive: `--border`, `--input`, `--ring`
- Shape: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-3xl`, `--radius-4xl`
- Type: `--font-sans`, `--font-heading`

Dark mode is a `.dark` class applied to an ancestor element (typically `<html>` or `<body>`); it redefines the same custom properties, so components never need dark-mode-specific styling of their own.

## Style mapping (read this before styling anything)

Chadman uses Sass + plain CSS custom properties, not Tailwind. A token name like `--primary` or `--radius-lg` doesn't describe *when* to use it the way a Tailwind utility class does (`bg-brand-primary` tells you both the value and the intent in the class name itself). With `var(--token)`, that intent has to be documented explicitly, or it's lost. Use the decision tables below instead of guessing from a token's name alone.

**Backgrounds:**

| Token | When to reach for it |
|---|---|
| `--background` | Page/app background |
| `--card` | Elevated surfaces — cards, panels, popovers (pair with `--card-foreground`) |
| `--primary` | Primary action fills (filled buttons) |
| `--secondary` | Secondary/supporting action fills |
| `--muted` | Low-emphasis fills, hover backgrounds on neutral elements |
| `--accent` | Hover/active background for ghost or outline elements |
| `--destructive` | Destructive actions — mix with `transparent` via `color-mix()` for a tinted fill rather than using it as a solid background (see `Button.scss`'s `--destructive` variant) |

**Text:**

| Token | When to reach for it |
|---|---|
| `--foreground` | Default body text on `--background` |
| `--primary-foreground` | Text/icons on top of a `--primary` fill |
| `--secondary-foreground` | Text/icons on top of a `--secondary` fill |
| `--muted-foreground` | De-emphasized text (captions, placeholders) |
| `--accent-foreground` | Text/icons on top of an `--accent` fill |
| `--destructive` | Destructive text (used directly as text color, not paired with a `-foreground` token) |

**Borders & focus rings:**

| Token | When to reach for it |
|---|---|
| `--border` | Default element borders (outline buttons, inputs, dividers) |
| `--input` | Form control borders specifically, where it should differ from `--border` |
| `--ring` | Focus-visible outlines/box-shadows |

**Shape:** pick the smallest radius token that isn't visually too subtle for the element's size — `--radius-sm`/`--radius-md` for small controls, `--radius-lg` for default-sized containers, `--radius-xl` and above only for large, prominent surfaces.

## Rules

- Do not hardcode hex/rgb colors or border-radius pixel values — use the tokens above via `var()`.
- Always pair a background token with its matching `-foreground` token (e.g. `--primary` with `--primary-foreground`), not an arbitrary other text token.
- Never guess a token's purpose from its name alone — consult the style mapping tables above.
- Do not reach into `@stamcat/chadman/src/styles/...` directly; the only documented style entry point is `@stamcat/chadman/styles/tokens`.
