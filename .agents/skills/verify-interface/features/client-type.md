---
covers:
  - src/index.ts
docs:
  - docs/1.introduction.md
journeys:
  - client-type
---

# Client type

`GetClient()` answers `Promise<MongoClient>` of the `mongodb` driver, so every example in `docs/1.introduction.md` (`client.db(...)`, `collection(...)`, cursors, transactions) type-checks against the driver's own API.

## Sub-features

- `client-type`: a probe compiled in strict mode against the packed declarations requires the awaited answer of `GetClient` to be exactly the driver's `MongoClient`, not a wider type (`MongoClient | undefined`) or a re-declared one.

## How to get to it (user POV)

- `const client = await GetClient();` followed by driver calls in TypeScript.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" client-type
```

## Gotchas

- The stub client at runtime is not a `MongoClient`; this journey reads declarations only.
