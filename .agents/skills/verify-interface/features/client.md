---
covers:
  - src/index.ts
docs:
  - docs/1.introduction.md
journeys:
  - every-function
  - minor-bump
---

# Client

A module author imports `GetClient` from `@antelopejs/interface-mongodb` and awaits the shared `MongoClient` that the implementing module provides through `internal.SetClient`.

## Sub-features

- `every-function`: the packed interface loads in `ajs project dev` next to a stub provider; `GetClient()` resolves to the client the stub set, and `db("myapp").databaseName` answers `myapp`. `internal.SetClient` and `internal.UnsetClient` are provider-side.
- `minor-bump`: the declared functions of the packed head match the published version, or the change releases as a new minor.

## How to get to it (user POV)

- `const client = await GetClient(); client.db("myapp").collection("users")` in any module whose project loads a MongoDB implementation.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" client
```

## Gotchas

- `GetClient()` waits forever without a provider; the driver gives up after 15 seconds and the step fails.
