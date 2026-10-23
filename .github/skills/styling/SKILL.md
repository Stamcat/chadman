---
name: styling
description: 'Sass/BEM, design-token, and cascade-layer conventions for styling components inside the chadman library itself. Use when writing or editing any .scss file, or any className/style logic, under src/.'
---

# Chadman Styling (library-internal)

Applies to chadman's own source (`src/components/**/*.scss`, `src/styles/**`). This is the
opposite audience from the root `AGENTS.md`'s styling rules, which tell a *consuming app* how to
style around a chadman component from the outside — see
[CONTRIBUTING.md](../../../CONTRIBUTING.md) for how the rulesets relate.

## Plain Sass + BEM, not CSS Modules

- Components `import "./{Name}.scss"` directly as a global side-effect import — not CSS Modules,
  not Tailwind, not styled-components/emotion. A library ships its CSS as plain files a consumer's
  own bundler processes; CSS Modules would require every consumer's bundler to support the same
  module-scoping transform, which isn't guaranteed the way it is in a single app's own build.
- BEM naming: block (`.button`), modifier (`.button--default`, `.button--size-sm`), element
  (`.app__title`). Class names are always lowercase-kebab, even though the component's file and
  folder names are PascalCase (`Button.tsx` → `.button`).
- Don't invent a non-BEM class name or rely on nesting-by-tag-selector the way a *consuming* app's
  internal styling might (see the root `AGENTS.md`) — a library component's root class is itself
  the public styling hook a consumer may reasonably target, so it needs a stable, predictable BEM
  name.

## Design tokens, never literals

- Style with `var(--token-name)` from `src/styles/_tokens.scss` — never a literal hex/oklch color
  or a hardcoded border-radius pixel value. See `guidelines/setup.md`'s style-mapping tables for
  which token to reach for.
- A component's own `.scss` file does NOT re-`@use` the tokens partial — it relies on
  `src/index.scss` (or the consuming app's equivalent global entry) having loaded
  `styles/tokens` first. Re-importing it would duplicate the `:root`/`.dark` custom-property
  output.
- Always pair a background token with its matching `-foreground` token, never an arbitrary other
  text token (same rule the consuming-app `AGENTS.md` gives consumers — it's just as true for the
  component's own SCSS).

## Cascade layers — required for every new component

- Layer order is declared exactly once, in `src/styles/_tokens.scss`:
  `@layer chadman-base, chadman-component, chadman-theme;`. Never redeclare this order elsewhere.
- Every new component's `.scss` must wrap its rules in `@layer chadman-component { ... }` (see
  `Button.scss`). Skipping this means the component's unlayered CSS would always beat
  `ThemeProvider`'s layered `theme.components` overrides, regardless of load order — breaking
  runtime theming for that component.
- A shared base rule set reused by more than one component (e.g. `%button-base`) lives in its own
  `src/styles/_{name}.scss` Sass placeholder, also wrapped in `@layer chadman-component { ... }` at
  its point of definition — wrapping only the placeholder's declaration is sufficient; files that
  `@extend` it don't need their own separate layer wrap for that inherited portion.

## Variant/size scaling in SCSS

- See [component-architecture](../component-architecture/SKILL.md#variantsize-scaling-pattern) for
  the full pattern: one `--{component}-size` CSS variable set from TS, all magnitude math done here
  via `calc(<base> * var(--{component}-size, 1))`.
- Sizing math uses `rem`, not `px` — `calc(2rem * var(--button-size, 1))` — so component dimensions
  scale with the user/consuming-app's root font size rather than staying fixed regardless of
  accessibility zoom/font-size preferences. Tokens that are inherently fixed shape values (e.g.
  `--radius-lg`) can stay as whatever unit `_tokens.scss` already defines.

## Don't add a class you don't need

- Same underlying principle as the consuming-app `AGENTS.md`'s styling guidance: a class only
  earns its place when it's a BEM block/modifier/element that's actually referenced, or disambiguates
  siblings of the same tag. Don't add a wrapper `<div>`/extra class purely to have "somewhere to
  hang a style" — reach for the primitive's own `data-slot`/rendered element first.

## Enforcement

| Rule | Enforced by |
| --- | --- |
| Compiles without Sass errors | `npm run build` (runs `vite build`, which compiles all `.scss`) |
| No stray literal colors/radii, correct `@layer` wrap, no re-`@use` of tokens | review (not machine-enforced) |
