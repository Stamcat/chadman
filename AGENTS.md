# AI Agent Integration Guide for chadman

This document explains how code-generation agents should use this library safely and correctly.

- **Component-specific guidelines** (props, behavior notes, examples): each component has its own `AGENTS.md` co-located with its source, for example `src/components/Button/AGENTS.md`.

## Quick Reference

Chadman currently ships one component. Use this import:

```tsx
import { Button } from "chadman/Button";
```

As more components are added, each will get its own `chadman/{Component}` subpath — only add it here once the component actually exists under `src/components/`.

## Hard Rules for Agents

1. Never deep-import from package internals (for example `chadman/src/...`). This applies to Sass too — once published, reach for a documented subpath rather than reaching into `src/`.
2. Only use documented component entry points.
3. Do not import storybook files (`src/stories/**`) from consuming applications.
4. Prefer standard React props first; use custom props only when required.
5. Prefer individual component imports (`chadman/Button`) over any future root barrel import, to improve tree shaking and keep consuming app bundles small.


