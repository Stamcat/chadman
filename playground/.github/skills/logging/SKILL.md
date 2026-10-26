---
name: logging
description: 'Logging conventions for the playground app, standing in for Figma-Make-generated app code consuming @stamcat/chadman. Use when writing or reviewing a try/catch, an async call, or anywhere `console.*` might otherwise be reached for.'
---

# Playground Logging (consumer-side)

Applies to playground app code (`playground/src/**`), which stands in for real Figma-Make-generated
application code. Use the `log` import from `@stamcat/chadman/utilities` — never `console.*`
directly (enforced, see below).

```ts
import { log } from "@stamcat/chadman/utilities";

log.debug("message", context?);
log.info("message", context?);
log.warn("message", context?, error?);
log.error("message", error?, context?);
```

## Every catch block logs

- Every `catch` block must call `log.error` with a short description of what failed and the
  caught error — a catch block that silently swallows the error, or only updates local state, with
  no `log.error` call, is missing required logging.
- Name the operation that failed in the message (e.g. `log.error("Failed to load theme config",
  e)`), not just "error" or "failed" — a log line alone should identify what broke.

## Level selection

- `log.error` — a caught exception, a failed fetch/async call, or anything a user-facing flow
  depended on and didn't get.
- `log.warn` — a degraded-but-recoverable situation where the app continues with a sensible
  fallback instead of failing (e.g. an optional config value was missing and a default was used).
- `log.debug`/`log.info` — expected, non-error observability (e.g. logging a parsed response
  before acting on it).

## This app has no backend destination wired up

- The playground only exercises chadman's built-in `"console"` destination — it has no
  `setLogHandler`/`setLogOutput` wiring of its own (that's a real consuming app's job, not this
  demo's). Don't add backend-specific plumbing (Splunk or otherwise) here; see
  [`src/utilities/logging/AGENTS.md`](../../../../src/utilities/logging/AGENTS.md) if a future
  change genuinely needs to demonstrate that extension point.

## Enforcement

| Rule | Enforced by |
| --- | --- |
| No `console.*` calls | `playground/.oxlintrc.json`'s `no-console` |

Which level to use and the "every catch block logs" rule aren't machine-enforced — check for them
in review.
