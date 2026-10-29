---
covers:
docs:
  - docs/1.introduction.md
journeys:
  - every-function
---

# Smoke

The fixed journey every verdict runs, whatever the diff touches: pack the interface, load it in `ajs project dev` with a stub provider and a consumer, and call every declared function through core.

## Sub-features

- `every-function`: as in [client](client.md).

## How to get to it (user POV)

- A project with any MongoDB implementation and a module that imports `@antelopejs/interface-mongodb`.

## Driving it with antelopejs-verify

```bash
pnpm exec antelopejs-verify journey "$RUN" smoke
```

## Gotchas

- The smoke feature covers no glob, so it never marks a file as mapped.
