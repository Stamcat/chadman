---
name: component-architecture
description: 'Folder structure, atomic design levels, product tagging, barrel-file policy, export wiring, prop design, and documentation requirements for building components inside the chadman library itself. Use when adding a new component, or changing an existing component''s folder layout, exports, product scope, or public API.'
---

# Chadman Component Architecture

Applies to code under `src/components/`, `src/styles/`, and `src/utilities/` — i.e. chadman's own
source, not a consuming app's code. See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for how this
relates to the consuming-app (`AGENTS.md`) and Figma Make (`guidelines/`) rulesets.

## shadcn first, custom only when it can't cover the need

- Before building a new component from scratch, check whether `shadcn` already has one that
  covers it (`npx shadcn@latest add <component>` to pull its source, same way `Button` was
  originally sourced — see the repo memory on the shadcn→Sass migration). Adapt the shadcn source
  into this repo's own conventions (BEM/Sass per [styling](../styling/SKILL.md), Base UI
  primitives, the folder-per-component layout below) rather than writing the markup/behavior from
  zero.
- If shadcn has no component for the need, or its version doesn't support a required feature/prop,
  **stop and ask the user before writing a custom implementation** — don't silently fall back to a
  hand-rolled component. State specifically what's missing (e.g. "shadcn's `Foo` has no `bar`
  variant") so the user can decide whether to accept a partial shadcn adaptation, request a custom
  build anyway, or wait for upstream support.
- This only governs where a new component's implementation starts from. Once adapted, it must
  still follow every convention below (folder layout, named exports, barrel wiring, the
  `--{component}-size` scaling pattern, SCSS/BEM, documentation checklist) — shadcn's own Tailwind/
  CVA output is a starting reference, not something to ship as-is.

## Atomic design levels in chadman

Chadman uses a six-level atomic design hierarchy. Every new component must be classified into one
of these before it's built — the level drives its folder location, its barrel/export treatment,
and (for the top two levels) its product scoping:

| Level | Definition | Lives in |
| --- | --- | --- |
| Quarks | Sub-atomic design values: color, typography, spacing | NOT a component folder — these are the design tokens in `src/styles/_tokens.scss`, already covered by [styling](../styling/SKILL.md). Don't create a "quark" component for a raw token. |
| Atoms | Common UI elements not specific to any product (button, input, checkbox, dropdown) | `src/components/atoms/{Name}/` |
| Molecules | Low-complexity common UI elements implementing one or more atoms (date picker, carousel, accordion, modal, tooltip) | `src/components/molecules/{Name}/` |
| Organisms | Medium–high complexity common UI elements with advanced functionality, built from one or more molecules and multiple atoms (charts, tables, data visualization) | `src/components/organisms/{Name}/` |
| Templates | Purpose-built, ready-to-use page sections, common or product-specific, any complexity (shopping cart flyout, global header/footer, navigation) | `src/components/templates/{product}/{Name}/` (see product scoping below) |
| Pages | Purpose-built, entire page layouts (login, 404) | `src/components/pages/{product}/{Name}/` (see product scoping below) |

All component names in this doc (e.g. a shopping cart flyout) and all product names (e.g. `shop`,
`loyalty`, `business`, below) are illustrative examples only — neither the actual product set nor
any specific component has been decided. Don't treat them as a plan to build or as the real list of
products; substitute whatever products/components are actually being built at the time.

`Button` lives at `src/components/atoms/Button/` and is the reference layout for new atoms.

## Folder-per-component

- Each component gets its own folder under its level's directory (see table above), PascalCase,
  matching the component name — no shared `ui/` catch-all folder.
- A component folder holds, at minimum: `{Name}.tsx`, `{Name}.scss`, `AGENTS.md`. See
  `src/components/atoms/Button/` for the reference layout.
- Use named exports only (`export { Button }` / `export type { ButtonProps, ... }`), never a
  default export — matches the consuming-app rule in the root `AGENTS.md`, and keeps tree-shaking
  and subpath-export generation (below) working.
- Component names must be unique across the ENTIRE library, not just within a level or product —
  the public import path is always `@stamcat/chadman/{Name}` with no atomic-level or product
  segment (see Wiring section below), so two components at different levels (or in different
  products) sharing a name would collide in the published `exports` map. Check across all of
  `src/components/` (every level, every product folder), not just sibling folders, before naming a
  new component.

## Product scoping and the internal tag registry

Chadman ships quarks/atoms/molecules/organisms as common, product-agnostic UI — no tagging needed.
Templates and pages are different: some are needed by every product, some by only a subset, some
by none, so they need a lightweight way to record which products care about a given component.

- **No tag = general purpose.** A template/page with no entry in the registry is assumed usable by
  any product. Only add a tag when a template/page is product-specific or product-excluded.
- Tags are recorded in one internal registry, `src/internal/productTags.ts` — not scattered as
  comments across component files, and not a prop/field on the component itself.
- This registry is **internal only**: it must never be imported by a component, barrel, or any
  other file that's reachable from a published entry point (`src/components/index.ts`, `exports.ts`
  entries, etc.). It exists purely for internal build tooling and documentation generation (e.g.
  per-product overview docs, or build-time barrel generation below) — it is not something a
  consuming app ever sees or imports, and nothing about it may leak into `dist/`. Flag as a
  follow-up to add `src/internal` to `scripts/buildPackage.ts`'s `SKIP_DIRS` (alongside
  `src/stories`) the first time this registry is introduced, so it's never accidentally shipped.
- Shape: key each entry by the component's path relative to `src/components/` (e.g.
  `"templates/shop/CartFlyout"` — `shop`/`CartFlyout` are placeholders, not real names), not by
  importing the component module — keying by path keeps the registry decoupled from the
  component's actual export graph, so referencing it can never accidentally pull component code
  into an unrelated bundle. This path-based key is purely internal/build-time bookkeeping — it is
  NOT the component's public import path, which is always flat (see Wiring section below).
- Maintain the set of valid product tags as a union type in the same file (e.g.
  `type ProductTag = "shop" | "loyalty" | "business"` — again placeholders; use whatever the real
  product set turns out to be) rather than accepting arbitrary strings, so a typo in a tag fails
  type-check instead of silently excluding a component from the product that needed it.

## Barrel files for templates/pages

- A barrel file (`index.ts`) for a product-grouped folder (`src/components/templates/{product}/`
  or `src/components/pages/{product}/`) is acceptable ONLY when a consuming application's concern
  maps directly to that product folder — e.g. a hypothetical `shop` app importing from a `shop`
  barrel (published as `@stamcat/chadman/shop`, still a placeholder product name), because it
  genuinely needs most/all of that product's templates anyway, so the convenience outweighs the
  tree-shaking risk.
- Otherwise, prefer direct per-component subpath imports (`@stamcat/chadman/CartFlyout` — still a
  placeholder name) over a barrel. The import path never includes the atomic level or product
  folder, only the component name (see Wiring section below) — this matches the root `AGENTS.md`
  hard rule to prefer individual component imports for tree-shaking, and matters even more here
  since templates/pages tend to be larger and more product-specific than atoms/molecules.
- Quarks/atoms/molecules/organisms are common-purpose by definition and should never be hidden
  behind a per-product barrel.
- Future option, not yet implemented: rather than hand-maintaining per-product barrels, generate
  them at library build time from `productTags.ts` (one generated barrel per product, listing
  every template/page tagged for — or untagged and therefore available to — that product). This
  would guarantee the barrels never drift from the registry. Treat this as a build-tooling
  enhancement to propose, not something to hand-roll ad hoc inside a single component change.

## Wiring a new component into the build

- Add the component to the barrel at `src/components/index.ts`
  (`export { Foo } from "./Foo/Foo";`) for quarks/atoms/molecules/organisms. This is the ONLY
  wiring step required for those levels — do not touch `exports.ts` or `vite.config.ts` for a
  plain new component.
- `scripts/buildPackage.ts`'s `getComponentExports()` regex-scans that barrel file at build time,
  reading each export's actual module path (not just its name), to auto-generate the matching
  `./{Name}` subpath entry in `dist/package.json`'s `exports` map — the published import path is
  always flat (`@stamcat/chadman/{Name}`), regardless of how deeply the component is nested
  (`atoms/Button/Button`, `templates/{product}/{Name}`, `pages/{product}/{Name}` all resolve to
  just `./{Name}`), which is why component names must be unique library-wide (see Folder-per-
  component above).
  `inlineComponentGuidelines()` separately walks every folder under `src/components/` looking for
  an `AGENTS.md` and copies it into `dist/guidelines/components/{name}.md`, keyed by that folder's
  own name. Get the barrel export line and the folder name right and the rest follows
  automatically.
- Only reach for a dedicated top-level `EXPORTS` key in `exports.ts` (its own Vite lib entry, like
  `Theme` or `Utilities`) when adding an entire new *subsystem* that isn't a visual component
  rendered from the component barrel (e.g. a provider, a hook library). A new Button/Card/Input-style
  component never needs this.

## Props

- Base the component's prop type on the underlying primitive's own prop type (e.g.
  `ButtonPrimitive.Props` from `@base-ui/react/button`) and extend it with only the new
  variant/size-shaped props the component adds — don't redeclare native/primitive props by hand.
- Prefer a Base UI primitive over hand-rolled markup when one exists for the element you're
  building; it already handles the keyboard/focus/ARIA behavior documented in
  [accessibility](../accessibility/SKILL.md).
- `className`/`style` must accept both a plain value and a Base UI render-prop function
  (`(state) => value`) and merge with the component's own generated classes/styles rather than
  overwriting them — see `Button.tsx`'s `className`/`style` handling for the pattern.
- Don't invent a prop that duplicates something CSS/children already solve (e.g. no `icon`/
  `loading` prop on `Button` — icons and loading spinners are passed as `children`, and
  "disabled-looking" is only ever the real `disabled` attribute, never a style-only modifier).

## Variant/size scaling pattern

This is the standard pattern for any component that needs multiple visual sizes — follow it for
every new component rather than inventing a different scaling mechanism:

- Expose exactly one CSS custom property per component, `--{component}-size`, set inline via the
  `style` prop based on the resolved `size`.
- Accept size as a named union (looked up in a `SIZE_SCALE` record local to the component file) OR
  a raw number (used directly as the scale) — see `Button.tsx`'s `ButtonSize`/`SIZE_SCALE`.
- Do all magnitude math (`height`, `gap`, `padding`, `font-size`, ...) in SCSS via
  `calc(<base> * var(--{component}-size, 1))` — never compute pixel/rem values in TS/JS.
- Only hand-write per-size overrides in SCSS for properties that are NOT a linear function of the
  scale (e.g. `border-radius` clamps, square `width` on icon-only sizes) — see the `&--size-xs`,
  `&--size-icon-*` blocks in `Button.scss`.

## No internal app state

- Components are presentational/controlled — they must not fetch data, read from global/module
  state, or assume a particular state-management library is present in the consuming app. A
  consuming app owns all state and passes it in via props/children.

## Documentation requirements (every new or changed component)

A component isn't done until all of these are updated in the same change — they're load-bearing,
not optional follow-ups:

1. `src/components/{level}/[{product}/]{Name}/AGENTS.md` — the single source of truth for that
   component's import path, props, variants/sizes, behavior notes, and usage examples
   (consuming-app audience).
2. `guidelines/components/{name}.md` — a short router stub pointing at that `AGENTS.md` (see
   `guidelines/components/button.md`). Do not copy prop tables/examples into this file.
3. `guidelines/components/overview.md` — add a row to the component catalog table.
4. A Storybook story under `src/stories/{quarks|atoms|molecules|organisms|templates|pages}/{Name}.stories.tsx`
   (templates/pages nested one level further by product, e.g.
   `src/stories/templates/shop/{Name}.stories.tsx`), filed under the atomic-design level the
   component was classified into above. Stories live in `src/stories/`, never co-located with the
   component source.
5. The root `AGENTS.md`'s Quick Reference, if the component introduces a new subpath import.
6. For a template/page: decide and record its product scope — either leave it untagged (general
   purpose) or add an entry to `src/internal/productTags.ts` (see product scoping above). Don't
   skip this decision silently; an untagged template/page is a deliberate "every product can use
   this" choice, not a default to avoid thinking about.

## Enforcement

| Rule | Enforced by |
| --- | --- |
| Subpath export + guideline inlining wiring | `scripts/buildPackage.ts` (reads the barrel + folder name) |
| Type correctness of props/exports | `npm run type-check` |
| Product tags restricted to the known set | `ProductTag` union in `src/internal/productTags.ts` + `npm run type-check` |

Folder layout, naming, the sizing pattern, the shadcn-first check, and the documentation checklist
aren't machine-enforced — check for them in review.
