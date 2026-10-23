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
- `href` defaults to a hash of the generated CSS text, not a fixed string. React dedupes hoisted
  `<style href>` resources by `href` and never updates an already-mounted one's content — a fixed
  default `href` would mean switching `theme` at runtime (e.g. a Storybook toolbar control) never
  visibly changes anything. Only pass a fixed `href` yourself if `theme` never changes for the life
  of the app. See `.storybook/preview.tsx` for a working live-switching example (a `theme`
  `globalType`/toolbar control + decorator wrapping every story in `ThemeProvider`), and
  `src/stories/examples/themes/Teal.stories.tsx` for the write-up.

## Cascade layers

`src/styles/_tokens.scss` declares the layer order — `@layer chadman-base, chadman-component,
chadman-theme;` — and wraps its own `:root`/`.dark` defaults in `chadman-base`. Component
stylesheets (e.g. `Button.scss`, `_button.scss`) wrap their rules in `chadman-component`.
`ThemeProvider`'s generated CSS is wrapped in `chadman-theme` by default (`layered: true`), which
always wins over both — regardless of load order — because `themeBuilder()` redeclares that same
`@layer chadman-base, chadman-component, chadman-theme;` statement ahead of its own rules. This
redeclaration matters: layer order is decided by each name's first appearance across every
stylesheet in the document, and React's style precedence hoisting (`ThemeProviderProps.precedence`,
default `"high"`) can insert `ThemeProvider`'s `<style>` before `_tokens.scss` has been parsed —
without the redeclaration, `chadman-theme` would end up the first-seen (lowest-priority) layer
instead of the last. Set `layered: false` only if `_tokens.scss` isn't loaded at all; overrides
then fall back to plain unlayered CSS, relying on DOM/source order to win.

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
