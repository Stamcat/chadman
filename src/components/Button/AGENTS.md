# Button — Agent Usage Notes

Import:

```tsx
import { Button } from "@stamcat/chadman/Button";
```

Props:

- Inherits all `@base-ui/react/button` `Button` props (which in turn inherit native `<button>` props and support `className`/`style` as either a value or a `(state) => value` function).
- `variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"` (default: `"default"`)
- `size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | number` (default: `"default"`)

Behavior notes:

- `type` defaults to `"button"` (inherited from the native element, not set explicitly by this component).
- `variant` and, for named sizes, `size` are always appended to `className` as `button--{variant}` / `button--size-{size}`; a numeric `size` is not (there's no matching modifier class for arbitrary numbers).
- `default` is the solid primary look; `secondary` is a muted filled look; `outline` and `ghost` are low-emphasis, bordered vs. borderless; `destructive` is a tinted danger look; `link` is borderless and underlines on hover.
- Each `variant` already applies the correct design tokens internally (see `Button.scss`) — do not pass a `className`/`style` override to recolor a variant when a different variant already matches the intent:

  | `variant` | Background token | Text token |
  |---|---|---|
  | `default` | `--primary` | `--primary-foreground` |
  | `secondary` | `--secondary` | `--secondary-foreground` |
  | `outline` | `--background` (bordered with `--border`) | `--foreground` |
  | `ghost` | transparent (hover: `--muted`) | `--foreground` |
  | `destructive` | tinted `--destructive` (via `color-mix()`) | `--destructive` |
  | `link` | transparent | `--primary` |
- Base button styles (`%button-base`) live in `src/styles/_button.scss`, a Sass placeholder extended by `.button` in `Button.scss` — not the bare `button` element. Plain `<button>` markup without the `.button` class receives no library styling, and other components can `@use "../../styles/button"` and `@extend %button-base;` to reuse it.
- `className` is preserved and merged after the component's own classes.
- When `size` is a named size, its scale is looked up in `SIZE_SCALE`; when `size` is a number, it's used directly as the scale. Either way, Button sets a single `--button-size` CSS variable inline; all scaling math lives in SCSS:
  - `height: calc(2rem * var(--button-size, 1))`
  - `gap: calc(0.375rem * var(--button-size, 1))`
  - `padding: 0 calc(0.625rem * var(--button-size, 1))`
  - `font-size: calc(0.875rem * var(--button-size, 1))`
  - `icon`/`icon-*` sizes additionally set `width` to the same `height` formula (square) and zero out padding; `xs`/`sm`/`icon-xs`/`icon-sm` also clamp `border-radius` since that isn't a linear function of scale.
  - This is the standard sizing pattern to follow for future components: expose one scale CSS variable, and let SCSS do the `calc()` work.
- There is no dedicated icon/loading prop. Icons, spinners, and mixed content are passed as `children`; there's also no built-in loading state — show a spinner icon as a child and set `disabled` yourself.
- Only real disable is supported (`disabled={true}`); there's no style-only "looks disabled" class.
- Native button modes are supported (`type="button" | "submit" | "reset"`).
- Accessibility props such as `aria-label` pass through unchanged.

Example:

```tsx
<Button variant="default" onClick={onSave}>Save</Button>
```

Story-aligned usage examples:

```tsx
// Scaled compact button (size can be a named size or any number used directly as the scale)
<Button variant="secondary" size={0.5}>Mini Action</Button>

// Icon content
<Button variant="outline">
  New <Plus />
</Button>

// Loading content (no built-in loading state; disable it yourself)
<Button disabled>
  <Loader2 /> Please wait
</Button>

// Icon-only button needs an accessible label
<Button variant="destructive" size="icon" aria-label="Delete">
  <Trash2 />
</Button>

// Native submit behavior
<Button type="submit" aria-label="Save form">Save</Button>
```

Implementation caution:

- Size scaling depends on the `--radius-lg`/`--radius-md` design tokens defined globally in `src/index.scss`; `Button.scss` assumes they're already in scope.
