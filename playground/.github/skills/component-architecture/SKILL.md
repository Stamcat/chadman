---
name: component-architecture
description: 'Import boundaries and composition conventions for consuming @stamcat/chadman from the playground app (standing in for Figma-Make-generated app code). Use when adding or editing any component under playground/src/.'
---

# Playground Component Architecture (consumer-side)

Applies to playground app code (`playground/src/**`), which stands in for real Figma-Make-generated
application code consuming `@stamcat/chadman`.

## Subpath imports only, never a package-root or deep import

- Import each chadman component/utility from its own documented subpath
  (`@stamcat/chadman/Button`, `/Checkbox`, `/utilities`, `/theme`, `/styles/tokens`) — never a
  future root-barrel import, and never a deep `@stamcat/chadman/src/...` import into package
  internals. Subpath imports resolve straight to that export's own chunk, which is what keeps a
  real Figma Make kit's bundle tree-shakeable.
- See the root [`AGENTS.md`](../../../../AGENTS.md)'s "Quick Reference"/"Hard Rules for Agents"
  for the full, authoritative list of valid subpaths — this skill doesn't duplicate it.

## Check chadman before hand-rolling UI

- Before building any custom markup for a UI element (buttons, checkboxes, inputs, etc.), check
  whether chadman already exports an equivalent — the same shadcn-first instinct chadman's own
  [component-architecture skill](../../../../.github/skills/component-architecture/SKILL.md)
  applies when deciding whether to build a new chadman component, just one level up the
  consumption chain. Only write custom markup/CSS for the parts chadman doesn't cover (layout,
  composition, page-level structure).

## Prefer named exports

- Prefer `export function Foo()` / `export const Foo = ...` over a default export, except where a
  framework genuinely requires one (there is no such case in this Vite + React app's own
  components — `main.tsx`'s `createRoot`/`StrictMode` usage is the framework boundary, not a
  reason for `App` itself to be a default export).

## Enforcement

| Rule | Enforced by |
| --- | --- |
| Hooks misuse (rules-of-hooks, stale deps) | `playground/.oxlintrc.json`'s `react/rules-of-hooks` + `react/exhaustive-deps` |

Subpath-import discipline, the "check chadman before hand-rolling UI" rule, and preferring named
exports aren't machine-enforced — check for them in review.
