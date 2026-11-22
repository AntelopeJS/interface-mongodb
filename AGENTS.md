# interface-mongodb

The AntelopeJS interface that hands modules the project's shared `MongoClient`, published as `@antelopejs/interface-mongodb`. The whole contract lives in `src/index.ts`. The implementation, `@antelopejs/mongodb`, lives in its own repository.

## Contract

- `GetClient()` is the public API. The `internal` namespace (`client`, `connected`, `SetClient`, `UnsetClient`) is marked `@internal`, but `@antelopejs/mongodb` (`src/connection.ts`) writes to it to publish and reset the connection. Renaming or reshaping any of these members breaks that implementation.
- `@antelopejs/mongodb` depends on this package with a `>=0.0.6 <1.0.0` range, so a breaking change here also needs a new range there.

## Versioning

`mongodb` is a runtime dependency, not a peer dependency. The compatibility table in `README.md` mirrors `package.json#dependencies` (the `docs-compat` marker), and the CI docs check fails when they differ. When you change the `mongodb` range, update both, and keep it in step with the range `@antelopejs/mongodb` declares.

## Tests

- The package has no runtime tests. `pnpm test` only runs `pnpm run build` (clean `dist`, then `tsc`), so `pnpm run checks` proves the package builds.
- `pnpm run checks` does not run the documentation check. CI runs it through the `docs-files` input in `.github/workflows/ci.yml`. To run it locally, clone `AntelopeJS/tooling-configs` at `v0.0.9` (the ref ci-node pins), run `npm ci --prefix actions/docs --omit=dev`, then run `node <clone>/actions/docs/check.mjs --files "$(printf 'README.md\ndocs')"` from this repository.

## Shipped files

`docs/` and `skills/` ship in the npm package. `docs/` holds the guide the package `homepage` (interfaces.antelopejs.com/docs/mongodb) points to. `skills/` reaches users through `antelopeJs.skills`; when the contract changes, update `skills/mongodb-interface/SKILL.md`.

<!-- antelopejs-guardrails:start -->
<!-- Managed by @antelopejs/tooling-configs. `antelopejs-sync` rewrites everything between these markers; write repository-specific guidance outside them. -->

## Guardrails

CI runs `pnpm run checks` in full on every pull request and reports what failed. The commit hook formats and lints the staged files. Locally, run only the fast check for what you touched:

- `pnpm run typecheck` after you change types or signatures.
- `pnpm exec oxlint <files>` and `pnpm exec oxfmt <files>` on the files you changed.
- One test file, not the suite. In a module that tests with `ajs module test`: `pnpm run build`, then `pnpm exec ajs module test . -f dist/<path>.test.js`.

### Comments

Say it in code: a constraint in a type, a lint rule or a test, a public item's contract in TSDoc. Other comments are lint directives naming their rules, `@ts-expect-error <reason>`, `SAFETY: <reason>` above a type assertion, and license or tool directives. A reason states what the code does now.

### Tests

Each test names the wrong implementation it fails on, or is deleted. Drive behaviour through the public interface. An invariant over many files is a lint rule.

### Review

No tool checks these:

- A type guard checks the nested elements and values it claims.
- A no-upward import rule rejects same-tier peers; probe it with an import.
- A finding only an evasion or a patched internal can trigger goes under Attention and never blocks.

### Suppressions

`guardrails.suppressions.json` caps lint directives, `@ts-expect-error`, `SAFETY:` comments and rules a lint config turns off. Over a cap, fix the code or remove another suppression of that kind; only the operator raises a number. After removing suppressions, run `pnpm run suppressions:update` and commit the file.

<!-- antelopejs-guardrails:end -->
