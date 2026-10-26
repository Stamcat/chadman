---
name: styling
description: 'Sass/BEM styling conventions for consuming @stamcat/chadman from the playground app (standing in for Figma-Make-generated app code). Use when writing or editing any .scss file, or any className/style logic, under playground/src/.'
---

# Playground Styling (consumer-side)

Applies to playground app code (`playground/src/**`), which stands in for real Figma-Make-generated
application code consuming `@stamcat/chadman`. This is the opposite audience from
[chadman's own library-internal styling skill](../../../../.github/skills/styling/SKILL.md) —
see that file's intro for how the two rulesets relate.

## SCSS only, no Tailwind/CSS-in-JS

- Style with plain Sass only — no Tailwind utility classes, no `styled-components`, no
  `@emotion/react`/`@emotion/styled`. Chadman itself migrated away from Tailwind to Sass/BEM; a
  consuming app reintroducing a utility-CSS or CSS-in-JS layer around it fights that decision
  instead of building on it.
- `@use "@stamcat/chadman/styles/tokens";` at the top of a stylesheet to pull in chadman's CSS
  variables (colors, radius, fonts) — style against `var(--background)`, `var(--primary)`, etc.,
  not hardcoded literal values, so the app automatically follows chadman's light/dark tokens and
  any `ThemeProvider` override.
- Follow chadman's own BEM naming: block (`.app`), element (`.app__title`, `.app__row`), modifier
  (`.app--variant`) — see `playground/src/App.scss`.

## Don't declare a class for every element

- A `className` earns its place by defining a layout/structural block, or disambiguating sibling
  elements of the same tag that need different rules — not as a default habit on every element.
  Nest bare-element selectors (`h2`, `p`, `a`, ...) under the enclosing block class instead of
  inventing a BEM element class whose only job is to select "the one heading in this block."

## Prefer chadman components over hand-rolled markup/CSS

- Before writing custom markup or CSS for a UI element (buttons, checkboxes, inputs, etc.), check
  whether `@stamcat/chadman` already exports it — see
  [component-architecture](../component-architecture/SKILL.md). Only build custom
  markup/CSS for parts chadman doesn't cover (layout/composition around its components).

## Enforcement

| Rule | Enforced by |
| --- | --- |
| No Tailwind / `styled-components` / `@emotion/*` imports | `playground/.oxlintrc.json`'s `no-restricted-imports` |

BEM naming and the "don't add a class you don't need" convention aren't machine-enforced — check
for them in review.
