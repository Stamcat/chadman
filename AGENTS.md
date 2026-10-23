# AI Agent Integration Guide for chadman

This document explains how code-generation agents should use this library safely and correctly —
it's written for an **application that consumes** `@stamcat/chadman` as a dependency. If you're
instead changing chadman's own source (this repo), use [`CONTRIBUTING.md`](./CONTRIBUTING.md) and
its linked skills instead — that ruleset covers implementation details (SCSS/BEM conventions,
cascade layers, component folder structure) that a consuming app must never depend on.

- **Component-specific guidelines** (props, behavior notes, examples): each component has its own `AGENTS.md` co-located with its source, for example `src/components/atoms/Button/AGENTS.md`.

## Quick Reference

Chadman currently ships one component. Use this import:

```tsx
import { Button } from "@stamcat/chadman/Button";
```

As more components are added, each will get its own `@stamcat/chadman/{Component}` subpath — only add it here once the component actually exists under `src/components/`.

Framework-agnostic helpers (including the logger — see `src/utilities/logging/AGENTS.md`) are published under the `./utilities` subpath:

```ts
import { log } from "@stamcat/chadman/utilities";
```

A runtime theming API (override design tokens and per-component styles without touching Sass — see `src/styles/theme/AGENTS.md`) is published under the `./theme` subpath:

```tsx
import { ThemeProvider } from "@stamcat/chadman/theme";
```

## Hard Rules for Agents

1. Never deep-import from package internals (for example `@stamcat/chadman/src/...`). This applies to Sass too — once published, reach for a documented subpath rather than reaching into `src/`.
2. Only use documented component entry points.
3. Do not import storybook files (`src/stories/**`) from consuming applications.
4. Prefer standard React props first; use custom props only when required.
5. Prefer individual component imports (`@stamcat/chadman/Button`) over any future root barrel import, to improve tree shaking and keep consuming app bundles small.

## Figma Make

This repo also ships a `guidelines/` folder at the root, formatted for [Figma Make](https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits) (`guidelines/Guidelines.md`, `guidelines/setup.md`, `guidelines/components/overview.md`, `guidelines/components/{name}.md`). It's built and published as part of the package (see `scripts/buildPackage.ts`) so it can be used when adding this package to a Figma Make kit.

**Keep it in sync**: Figma Make only reads files inside a kit's `guidelines/` folder — it won't follow a markdown link out to a component's `AGENTS.md`. So in source control, `guidelines/components/{name}.md` is kept as a short router that points to the component's `AGENTS.md` (the single source of truth, readable by humans and Copilot). At build time, `scripts/buildPackage.ts`'s `inlineComponentGuidelines()` replaces each router stub in `dist/guidelines/components/{name}.md` with the real `AGENTS.md` content, so the published package Figma Make actually reads is always generated fresh and never manually duplicated. When adding a new component:
1. Write its `AGENTS.md` as usual, co-located with its source.
2. Add a row for it to `guidelines/components/overview.md`.
3. Add a `guidelines/components/{name}.md` router file, following the pattern in `guidelines/components/button.md`.

Do not copy prop tables, examples, or behavior notes into the `guidelines/` folder — if content needs updating, update the component's `AGENTS.md` only.


