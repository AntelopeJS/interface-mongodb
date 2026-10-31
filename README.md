# @antelopejs/interface-mongodb

<div align="center">
<a href="https://www.npmjs.com/package/@antelopejs/interface-mongodb"><img alt="npm" src="https://img.shields.io/npm/v/@antelopejs/interface-mongodb?style=for-the-badge&labelColor=000000&color=000000"></a>
<a href="./LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@antelopejs/interface-mongodb?style=for-the-badge&labelColor=000000&color=000000"></a>
<a href="https://discord.gg/sjK28QHrA7"><img alt="Discord" src="https://img.shields.io/badge/Discord-18181B?logo=discord&style=for-the-badge&color=000000"></a>
<a href="https://interfaces.antelopejs.com/docs/mongodb"><img alt="Docs" src="https://img.shields.io/badge/Docs-18181B?style=for-the-badge&color=000000"></a>
</div>

Direct access to the MongoDB client of an AntelopeJS project, for the native operations that the database-agnostic [`@antelopejs/interface-database`](https://github.com/AntelopeJS/interface-database) does not cover.

## What it offers

- `GetClient()` resolves to the project's shared `MongoClient` once the connection is up.
- The client is the official Node.js driver, with its full API: CRUD, aggregations, indexes and transactions.
- Every module reuses the one connection that the implementing module opens and configures.

## Implementations

| Module                                                         | Notes                                            |
| -------------------------------------------------------------- | ------------------------------------------------ |
| [`@antelopejs/mongodb`](https://github.com/AntelopeJS/mongodb) | Also implements `@antelopejs/interface-database` |

## Install

Add the interface to the module that talks to MongoDB:

```bash
pnpm add @antelopejs/interface-mongodb
```

Then add the implementation to the project:

```bash
ajs project modules add @antelopejs/mongodb
```

## Quick start

```ts
import { GetClient } from "@antelopejs/interface-mongodb";

export async function countActiveUsers() {
  const client = await GetClient();
  return await client
    .db("myapp")
    .collection("users")
    .countDocuments({ active: true });
}
```

## Documentation

- [Introduction and client reference](./docs/1.introduction.md)

## Compatibility

The interface depends on the official MongoDB driver:

<!-- docs-compat: ./package.json#dependencies -->

| Package   | Range     |
| --------- | --------- |
| `mongodb` | `^6.21.0` |

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before you open a pull request. The local checks are:

```bash
pnpm install
pnpm run checks
```

## License

[Apache-2.0](./LICENSE)
