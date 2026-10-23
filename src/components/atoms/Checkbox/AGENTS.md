# Checkbox — Agent Usage Notes

Import:

```tsx
import { Checkbox } from "@stamcat/chadman/Checkbox";
```

Props:

- Inherits all `@base-ui/react/checkbox` `Checkbox.Root` props (`checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `readOnly`, `required`, `indeterminate`, `name`, `value`, `form`, `inputRef`, etc.), plus native `<span>`/hidden-`<input>` wiring handled by the primitive. `className`/`style` accept either a value or a `(state) => value` function.
- `size?: "default" | "sm" | "lg" | number` (default: `"default"`)

Behavior notes:

- There is no `variant` prop — Checkbox has a single look (unchecked: bordered box using `--input`/`--background`; checked or indeterminate: filled with `--primary`/`--primary-foreground`).
- Renders a `Check` icon when checked and a `Minus` icon when `indeterminate` is `true` (both from `lucide-react`). The icon itself is only mounted while ticked/indeterminate — handled by `@base-ui/react`'s `Checkbox.Indicator`, not conditional logic in this component.
- `indeterminate` is visual-only (per Base UI): it does not affect `checked`/`onCheckedChange` — manage `checked` yourself and set `indeterminate` separately for a tri-state UI (e.g. a "select all" checkbox).
- Use `checked`/`onCheckedChange` for a controlled checkbox, or `defaultChecked` for an uncontrolled one — never both.
- `aria-invalid="true"` applies the same tinted-destructive border/focus ring as `Button`'s invalid state; pass it manually (this component is not wrapped in a Base UI `Field.Root`, so no `data-invalid` is computed automatically).
- Only real disable is supported (`disabled={true}`); there's no style-only "looks disabled" class.
- When `size` is a named size, its scale is looked up in `SIZE_SCALE`; when `size` is a number, it's used directly as the scale. Either way, Checkbox sets a single `--checkbox-size` CSS variable inline; all scaling math lives in SCSS:
  - `width`/`height`: `calc(1rem * var(--checkbox-size, 1))`
  - indicator icon `width`/`height`: `calc(0.875rem * var(--checkbox-size, 1))`
  - This is the standard sizing pattern used across chadman components (see `Button`'s `AGENTS.md`) — one scale CSS variable, all magnitude math done in SCSS.
- `className` is preserved and merged after the component's own classes.
- A checkbox has no visible text content of its own — always pair it with a `<label>` (wrapping the checkbox or using `htmlFor`/`id`) so it has an accessible name; don't rely on `aria-label` alone unless there is genuinely no visible label text.

Example:

```tsx
const [checked, setChecked] = useState(false);

<label>
  <Checkbox checked={checked} onCheckedChange={setChecked} /> Accept terms
</label>
```

Story-aligned usage examples:

```tsx
// Uncontrolled
<Checkbox defaultChecked />

// Indeterminate ("select all" pattern) — indeterminate is visual-only, checked is managed separately
<Checkbox checked={allChecked} indeterminate={someChecked && !allChecked} onCheckedChange={setAllChecked} />

// Sizes
<Checkbox size="sm" />
<Checkbox size="lg" />

// Invalid state
<Checkbox aria-invalid="true" />

// Disabled
<Checkbox disabled defaultChecked />
```

Implementation caution:

- Size scaling depends on the `--radius-sm` design token defined globally in `src/index.scss`; `Checkbox.scss` assumes it's already in scope.
