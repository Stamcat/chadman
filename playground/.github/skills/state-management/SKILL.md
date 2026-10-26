---
name: state-management
description: 'Shared-state conventions for the playground app, standing in for Figma-Make-generated app code consuming @stamcat/chadman. Use when state needs to be read or set by more than one component — enforces a single namespaced store object instead of per-domain hooks.'
---

# Playground State Management (consumer-side)

Applies to playground app code (`playground/src/**`), which stands in for real Figma-Make-generated
application code. Figma Make output doesn't use Redux Toolkit/redux-saga — it typically reaches
for local `useState`/`useReducer`/`useContext`. This skill assumes that baseline and adds one rule
on top of it.

## Don't thread props through components that don't own the state

- State and setters local to a single component (and its direct, one-level children) can stay as
  plain props — don't reach for a store for that.
- Once a piece of state needs to be read or set by components more than one level apart, stop
  passing it down as props at every intermediate layer.

## One store object, not many `useXStore` hooks

- There is exactly one store object for the whole app, not a separate hook per domain. Domains are
  namespaced properties on that single object — `store.theme`, `store.dashboard` — not
  `useThemeStore()`/`useDashboardStore()` scattered across unrelated files. This mimics a
  Redux-style single source of truth (one store, combined slices) without requiring Redux itself.
- A new shared-state domain is a new named key added to the existing store object
  (`store.<domain>`), never a new standalone hook/context of its own.
- Each `store.<domain>` slice exposes named values and named action functions
  (`store.theme.setTheme`, `store.dashboard.toggleSidebar`) — not a raw `[value, setValue]` tuple,
  and not every consuming component re-declaring its own copy of the same state.
- Implement the single store with one `useContext`-backed (or module-scoped) provider at the app
  root, composed from per-domain reducers/`useState` calls internally — the internals can be
  split across files for organization, but components only ever import and read from the one
  store object, never from a domain-specific hook.

## Keep it as small as the actual sharing need

- Don't add a `store.<domain>` slice preemptively for state nothing outside its component reads
  yet — this is a prop-drilling escape hatch, not a default architecture.
- No external state library is required to satisfy this rule — plain `useContext` +
  `useReducer`/`useState` composed into the single store object is sufficient.

Not machine-enforced — check for prop-drilling, stray `useXStore` hooks, and "is this a
store-worthy domain" in review.

