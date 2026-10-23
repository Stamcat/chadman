# Agent Instructions — styles/theme

This folder implements `ThemeProvider`, published via the package's `./theme` subpath export.
It lets a consuming app override design tokens and per-component styles at runtime without
touching `src/styles/_tokens.scss` or any component's own `.scss` file.

## Using ThemeProvider

```tsx
import { ThemeProvider } from "@stamcat/chadman/theme";

<ThemeProvider
  theme={{
    colors: { "--primary": "oklch(0.6 0.2 250)" },
    components: { button: { borderRadius: "999px" } },
  }}
>
  <App />
</ThemeProvider>
```

- `theme.colors` overrides any CSS custom property from `src/styles/_tokens.scss` (see
  `TokenVariableName` for the full list) — values must already be valid CSS (e.g. `oklch(...)`,
  `0.625rem`), same as the tokens themselves.
- `theme.root` is a raw escape hatch written to `:root` ahead of `colors` — accepts a `CSSObject`,
  an Emotion-style `SerializedStyles`, or a literal CSS string.
- `theme.components` overrides styles per registered component, keyed by its lowercased name (e.g.
  `button`), targeting the selector in `componentSelectors` (`button, .button` — both the native
  element and the BEM class, since `<button>` is also a native HTML tag).
- `ThemeProvider` renders a `<style>` tag via React's style hoisting (`precedence="high"` by
  default) and otherwise behaves as a pass-through (`children` render unchanged).

## Cascade layers

`src/styles/_tokens.scss` declares the layer order once — `@layer chadman-base, chadman-component,
chadman-theme;` — and wraps its own `:root`/`.dark` defaults in `chadman-base`. Component
stylesheets (e.g. `Button.scss`, `_button.scss`) wrap their rules in `chadman-component`.
`ThemeProvider`'s generated CSS is wrapped in `chadman-theme` by default (`layered: true`), which
always wins over both — regardless of load order — as long as `_tokens.scss` is imported (already
required by every consumer, see `guidelines/setup.md`). Set `layered: false` only if `_tokens.scss`
isn't loaded; overrides then fall back to plain unlayered CSS, relying on DOM/source order to win.

## Build-time vs. runtime overrides

`ThemeProvider` is for runtime theming only. For a static rebrand baked in at build time (no JS,
no runtime switching), configure `_tokens.scss`'s `!default` Sass variables instead via
`@use ... with (...)` — see "Build-time token overrides" in `guidelines/setup.md`. The two
mechanisms don't conflict: `ThemeProvider`'s `chadman-theme` layer always wins over whatever
build-time defaults `_tokens.scss` compiled in.

## Hard rules for agents

1. Do not pass untrusted/user-supplied strings into `theme.root`, `theme.components`, or any
   `CSSObject`/string value — they're written into the DOM via `dangerouslySetInnerHTML` as raw
   CSS text with no escaping. Only use developer-authored values (e.g. design tokens from a
   build-time config), never render user input through this API.
2. Any new component's `.scss` must wrap its rules in `@layer chadman-component { ... }` (see
   `Button.scss`/`_button.scss`) — otherwise its unlayered CSS would always beat `ThemeProvider`'s
   layered `theme.components` overrides, regardless of layer order.
3. `componentSelectors` (in `components.ts`) is derived automatically from
   `src/components/index.ts`'s exports — do not hand-maintain a separate list. When a new
   component needs a non-default selector (e.g. a future `Checkbox` rendered as
   `input[type="checkbox"]`), add it to `componentSelectorTargets` in `components.ts`, not here.
4. Do not hardcode a list of CSS variable names anywhere except `TokenVariableName` in `types.ts`
   — keep that union in sync with `src/styles/_tokens.scss` whenever tokens are added/renamed.
