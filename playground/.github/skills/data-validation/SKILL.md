---
name: data-validation
description: 'Zod schema conventions for data crossing a boundary into the playground app (e.g. a theme override object, fetched config, stored JSON), standing in for Figma-Make-generated app code consuming @stamcat/chadman. Use when adding code that parses or shapes any external/untyped payload.'
---

# Playground Data Validation (consumer-side)

Applies to playground app code (`playground/src/**`), which stands in for real Figma-Make-generated
application code. Not every app has data boundaries today, but any added later must follow this.

## Validate anything that enters the app

- Validate payloads crossing a serialization boundary — an API response, a `localStorage`/
  `sessionStorage` read, a URL/query-string param, a `postMessage` payload — with a Zod schema, so
  the schema (not just a TypeScript type) is the enforced contract. `zod` is already a transitive
  dependency via `@stamcat/chadman/utilities` (its logging module's `DestinationsByLevelSchema`
  etc.), so no new dependency is needed to reach for it here.
- If you find yourself writing `JSON.parse(...)` or shaping an untyped external payload (`data:
  any`) by hand, that's exactly the case this rule targets — replace the hand-written mapping with
  a Zod schema and `.parse`/`.safeParse` instead. Prefer `safeParse` with an explicit fallback over
  `parse` when a bad payload shouldn't crash the UI.
- A chadman `Theme`/`ComponentThemeOverrides` object passed to `ThemeProvider` is a prime example
  if it ever comes from outside the app's own source (e.g. a remote config endpoint or a
  Figma-Make-provided JSON file) rather than a hardcoded local object like
  `playground/src/App.tsx`'s current usage — see
  [`src/styles/theme/AGENTS.md`](../../../../src/styles/theme/AGENTS.md)'s security note on never
  passing untrusted strings into `ThemeProvider`'s CSSObject values; a Zod schema at the boundary
  is how that untrusted-input concern gets closed in practice, not just documented.
- Outside of boundaries, Zod is optional — don't wrap an already-exhaustive, compile-time-checked
  TypeScript construct in a schema just for the sake of using one.

## Where to put schemas

- Declare Zod schemas in a colocated `schemas.ts` next to the code that uses them, not inlined
  into a component file — mirrors chadman's own `src/utilities/logging/schemas.ts` pattern.
- Derive the TypeScript type from the schema (`z.infer<typeof Schema>`) rather than hand-writing a
  parallel interface.

Not machine-enforced — check for this in review.
