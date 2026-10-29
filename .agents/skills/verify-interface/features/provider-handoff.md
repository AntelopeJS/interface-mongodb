---
covers:
  - src/index.ts
docs:
  - docs/1.introduction.md
journeys:
  - provider-handoff
---

# Provider handoff

The implementing module calls `internal.SetClient(client)` when its connection is ready and `internal.UnsetClient()` when it stops. Consumers awaiting `GetClient()` get the current client, and wait for the next one after a reset (`docs/1.introduction.md`: "It waits if no client has been supplied").

## Sub-features

- `provider-handoff`: on the packed `dist/index.js`, `GetClient()` resolves to the client set, stays pending after `UnsetClient()`, resolves to the next client after a second `SetClient`, and `internal.connected` stays `false` until a provider changes it.

## How to get to it (user POV)

- A module restarting under `ajs project dev --watch`: its consumers must receive the new client and never the stale one.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" provider-handoff
```

## Gotchas

- Provider side only; consumers never call `SetClient` or `UnsetClient`.
