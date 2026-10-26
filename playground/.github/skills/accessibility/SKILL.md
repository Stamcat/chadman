---
name: accessibility
description: 'Accessibility conventions for the playground app, standing in for Figma-Make-generated app code consuming @stamcat/chadman. Use when creating or editing any component/markup under playground/src/.'
---

# Playground Accessibility (consumer-side)

Applies to playground app code (`playground/src/**`), which stands in for real Figma-Make-generated
application code. Every new or modified piece of markup here must be accessible — this is a
requirement, not a follow-up task.

## Semantic structure and labels

- Reach for semantic HTML5 elements (`main`, `nav`, `header`, `footer`, `section`, `h1`-`h6`,
  `button`, `a`, `label`) before adding ARIA roles.
- Every form control needs a programmatically associated label — either wrap it in a `<label>`
  with a matching `htmlFor`/`id` pair, or use `aria-label`/`aria-labelledby`. Placeholder text is
  never a substitute. See `playground/src/App.tsx`'s `<label htmlFor="subscribe">` +
  `<Checkbox id="subscribe" />` pairing — prefer the explicit `htmlFor`/`id` form over bare
  `<label>`-wraps-control, since `jsx-a11y/label-has-associated-control` doesn't reliably
  recognize the wrapping form for non-native controls like chadman's Base-UI-backed `Checkbox`.
- Icon-only buttons/links need an accessible name (visually-hidden text, `aria-label`, or
  `aria-labelledby`) — check the component's own `AGENTS.md` for which sizes/variants require one
  (e.g. chadman's `Button`/`Checkbox` docs).

## Prefer chadman's own accessible primitives

- Chadman's components (Base UI-backed `Button`, `Checkbox`, etc.) already handle keyboard
  operability, focus-visible styling, and ARIA state — use them instead of hand-rolling an
  interactive widget. Only build a custom interactive control when chadman has no equivalent, and
  in that case it must still be keyboard-reachable/operable and expose the relevant ARIA role/state.
- Preserve a visible focus indicator; never suppress it with `outline: none` without an equivalent
  focus style.

## Color and contrast

- Don't convey meaning (errors, required fields, status) through color alone.
- Style against chadman's `var(--background)`/`var(--foreground)`/etc. tokens rather than new
  literal colors — they're already vetted for contrast, including in dark mode.

## Enforcement

| Rule | Enforced by |
| --- | --- |
| Missing alt text / unlabeled controls / non-keyboard-operable custom widgets | `playground/.oxlintrc.json`'s `jsx-a11y/*` rules |

Color-contrast and "prefer chadman's primitives" aren't machine-enforced — check for them in
review, the same as chadman's own
[accessibility skill](../../../../.github/skills/accessibility/SKILL.md) leaves contrast
verification to Storybook's addon-a11y panel rather than lint.
