<a href="https://github.com/AntelopeJS/antelopejs"><img data-illustration src="./.github/readme/strip.svg" width="100%" alt="INTERFACE · MONGODB: part of AntelopeJS, hexagonal architecture beyond your own code. A glowing button reads Star AntelopeJS."></a>

<div align="center">

# `@antelopejs/interface-mongodb`

<a href="https://www.npmjs.com/package/@antelopejs/interface-mongodb"><img data-illustration alt="npm" src="https://img.shields.io/npm/v/@antelopejs/interface-mongodb?style=for-the-badge&labelColor=000000&color=000000"></a> <a href="./LICENSE"><img data-illustration alt="License" src="https://img.shields.io/npm/l/@antelopejs/interface-mongodb?style=for-the-badge&labelColor=000000&color=000000"></a> <a href="https://discord.gg/g4pFt6eXqu"><img data-illustration alt="Discord" src="https://img.shields.io/badge/Discord-18181B?logo=discord&style=for-the-badge&color=000000"></a> <a href="https://interfaces.antelopejs.com/docs/mongodb"><img data-illustration alt="Documentation" src="https://img.shields.io/badge/Docs-18181B?style=for-the-badge&color=000000"></a> <a href="https://github.com/AntelopeJS/antelopejs"><img data-illustration alt="Star AntelopeJS" src="https://img.shields.io/github/stars/AntelopeJS/antelopejs?label=Star%20AntelopeJS&style=for-the-badge&labelColor=000000&color=000000&logo=github"></a>

**Direct access to the shared MongoDB client of an AntelopeJS project, for the native operations the database interface does not cover.**

[Documentation](https://interfaces.antelopejs.com/docs/mongodb) · [Implementations](#implementations) · [All interfaces and providers](https://github.com/AntelopeJS/antelopejs#ecosystem)

</div>

Write portable queries with the database-agnostic [`@antelopejs/interface-database`](https://github.com/AntelopeJS/interface-database), and reach for this interface when a query needs the native driver.

## What it offers

- `GetClient()` resolves to the project's shared `MongoClient` once the connection is up.
- The client is the official Node.js driver, with its full API: CRUD, aggregations, indexes and transactions.
- Every module gets the same `MongoClient`. The implementing module opens it, configures it, and closes it.

## Implementations

| Module                                                         | Notes                                                                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [`@antelopejs/mongodb`](https://github.com/AntelopeJS/mongodb) | Also implements `@antelopejs/interface-database`. Supplies the client in its default `owned` mode only. |

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

## Part of AntelopeJS

[AntelopeJS](https://github.com/AntelopeJS/antelopejs) is the TypeScript framework where modules depend on contracts and the application chooses the provider, and [AntelopeJS DMS](https://github.com/AntelopeJS/dms) is built on it.

<!-- antelopejs-framework-modules:start -->

| Area         | Contracts                                                                                                                                                                                                                                                                                                                                                                   | Providers                                                                                                                                                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API          | [`interface-api`](https://github.com/AntelopeJS/interface-api) · [`interface-api-util`](https://github.com/AntelopeJS/interface-api-util) · [`interface-data-api`](https://github.com/AntelopeJS/interface-data-api)                                                                                                                                                        | [`api`](https://github.com/AntelopeJS/api)                                                                                                                                                                                                          |
| Auth         | [`interface-auth`](https://github.com/AntelopeJS/interface-auth)                                                                                                                                                                                                                                                                                                            | [`auth-jwt`](https://github.com/AntelopeJS/auth-jwt)                                                                                                                                                                                                |
| Database     | [`interface-database`](https://github.com/AntelopeJS/interface-database) · [`interface-database-decorators`](https://github.com/AntelopeJS/interface-database-decorators) · [`interface-database-catalog`](https://github.com/AntelopeJS/interface-database-catalog) · **`interface-mongodb`** · [`interface-rethinkdb`](https://github.com/AntelopeJS/interface-rethinkdb) | [`postgres`](https://github.com/AntelopeJS/postgres) · [`mysql`](https://github.com/AntelopeJS/mysql) · [`mongodb`](https://github.com/AntelopeJS/mongodb) · [`rethinkdb`](https://github.com/AntelopeJS/rethinkdb)                                 |
| Redis        | [`interface-redis`](https://github.com/AntelopeJS/interface-redis) · [`interface-redis-scheduler`](https://github.com/AntelopeJS/interface-redis-scheduler)                                                                                                                                                                                                                 | [`redis`](https://github.com/AntelopeJS/redis)                                                                                                                                                                                                      |
| Email        | [`interface-email`](https://github.com/AntelopeJS/interface-email)                                                                                                                                                                                                                                                                                                          | [`nodemailer`](https://github.com/AntelopeJS/nodemailer) · [`brevo`](https://github.com/AntelopeJS/brevo)                                                                                                                                           |
| File storage | [`interface-file-storage`](https://github.com/AntelopeJS/interface-file-storage)                                                                                                                                                                                                                                                                                            | [`file-storage-local`](https://github.com/AntelopeJS/file-storage-local) · [`file-storage-s3`](https://github.com/AntelopeJS/file-storage-s3)                                                                                                       |
| Payments     | [`interface-payment`](https://github.com/AntelopeJS/interface-payment) · [`interface-subscriptions`](https://github.com/AntelopeJS/interface-subscriptions) · [`interface-stripe`](https://github.com/AntelopeJS/interface-stripe)                                                                                                                                          | [`stripe`](https://github.com/AntelopeJS/stripe) · [`mollie`](https://github.com/AntelopeJS/mollie) · [`checkout-com`](https://github.com/AntelopeJS/checkout-com) · [`payment-subscriptions`](https://github.com/AntelopeJS/payment-subscriptions) |

<!-- antelopejs-framework-modules:end -->

## License

[Apache-2.0](./LICENSE)
