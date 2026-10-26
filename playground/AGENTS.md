# Agent Instructions — chadman playground

This folder is a standalone consuming app (see the root [`AGENTS.md`](../AGENTS.md)'s "Quick
Reference"/"Hard Rules for Agents" for the full chadman consumer contract — this file only adds
playground-specific conventions, it doesn't replace that one). Its purpose is tuning local dev
config against whatever **Figma Make** actually generates for a kit built from `@stamcat/chadman`,
so treat any code written here as a stand-in for Figma-Make-generated application code, not library
source.

The app standards apply to every file under `playground/src/`. Detailed, topic-specific
conventions live as skills under `.github/skills/` rather than inline here, following the same
AGENTS.md-as-index pattern chadman's own root `CONTRIBUTING.md` uses. Read the linked skill before
touching the corresponding area:

| Topic | Skill |
| --- | --- |
| SCSS/BEM, design-token usage, preferring chadman components over hand-rolled CSS | [styling](.github/skills/styling/SKILL.md) |
| Subpath-import discipline, checking chadman before hand-rolling UI, named exports | [component-architecture](.github/skills/component-architecture/SKILL.md) |
| Semantic structure, labels, ARIA, keyboard/focus, color contrast | [accessibility](.github/skills/accessibility/SKILL.md) |
| `log` instead of `console.*`, catch-block error logs, warn vs error level selection | [logging](.github/skills/logging/SKILL.md) |
| Zod schemas for any payload crossing a boundary (fetched config, stored JSON, a remote `Theme` override) | [data-validation](.github/skills/data-validation/SKILL.md) |
| Avoiding prop-drilling via a single namespaced store object (`store.theme`, `store.dashboard`) once state is shared across components | [state-management](.github/skills/state-management/SKILL.md) |

## Skills intentionally not added yet

Two more topics are deliberately left without a skill here — not an oversight:

- **routing** — the playground has a single `App` component and no router at all; there's no
  distinct-view/query-string decision to make yet. Add a routing skill if/when the playground
  gains multiple views.
- **loading-states** — a skeleton-loader skill would need a `Skeleton` primitive to point at.
  Chadman has no `Skeleton` component yet and the playground has no routes/data-fetching to gate
  a loading state on.

## Enforcement summary

| Rule | Enforced by |
| --- | --- |
| No Tailwind / `styled-components` / `@emotion/*` imports | `.oxlintrc.json`'s `no-restricted-imports` |
| No `console.*` calls | `.oxlintrc.json`'s `no-console` |
| Missing alt text / unlabeled controls / non-keyboard-operable custom widgets | `.oxlintrc.json`'s `jsx-a11y/*` rules |
| React hooks misuse | `.oxlintrc.json`'s `react/rules-of-hooks` + `react/exhaustive-deps` |

Run `npm run lint` (from `playground/`, not the repo root — this app has its own `package.json`
and its own `.oxlintrc.json`, deliberately scoped separately from the root library's) before
finishing any change here.

Subpath-import discipline, "every catch block logs," and the "check chadman before hand-rolling
UI" rule aren't machine-enforced — check for them in review, the same as chadman's own unenforced
styling/accessibility conventions.

## Setup reminder

This app consumes chadman via `"file:../dist"`, not a relative `src/` import — run the root
`npm run build` first, then `npm install` here, any time chadman's source changes and you need
the playground to pick it up.
