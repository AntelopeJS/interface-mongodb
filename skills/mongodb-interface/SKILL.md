---
name: mongodb-interface
description: Provides direct access to the shared MongoDB connection in an AntelopeJS app via a single GetClient() function that resolves to the raw mongodb driver MongoClient (full CRUD, aggregations, indexes, transactions). Use when code imports "@antelopejs/interface-mongodb", when you see GetClient or the internal.SetClient/UnsetClient namespace, or when a task asks to query/insert/update/aggregate MongoDB documents, access db()/collection(), or wire a MongoDB connection into an AntelopeJS module.
category: antelopejs-interface
tags: [mongodb, database, antelopejs, interface, driver]
---

# MongoDB Interface

Thin interface over the official `mongodb` Node.js driver. It holds a singleton
`Promise<MongoClient>`. A MongoDB provider module resolves it with its client,
and consumer code awaits it through `GetClient()`. There are no proxy
crossings, decorators or query builders here. Everything after
`await GetClient()` is the plain driver API.

## Imports

```typescript
import { GetClient } from "@antelopejs/interface-mongodb";
```

The package has a single entry point (`.` in the exports map). It also exports
an `internal` namespace from the same path, which is for providers only (see
below). Driver types such as `MongoClient`, `ObjectId` and `Filter` come from
the `mongodb` package, which is a regular dependency of this interface.

## Consuming

```typescript
import { GetClient } from "@antelopejs/interface-mongodb";

async function findBooksByGenre(genre: string) {
  const client = await GetClient();
  const books = client.db("library").collection("books");
  return books.find({ genre }).toArray();
}
```

`GetClient()` returns `internal.client`, a `Promise<MongoClient>` that resolves
when the provider calls `internal.SetClient`. From there, use the standard
driver API: `db()`, `collection()`, `insertOne`, `find`, `aggregate`,
`createIndex`, transactions, and so on.

## Providing

A provider module owns the connection lifecycle through the `internal`
namespace. It calls `internal.SetClient(client)` to resolve the pending
promise, sets `internal.connected`, and calls `internal.UnsetClient()` when it
disconnects, which arms a fresh unresolved promise. Consumer code must never
touch `internal`.

`@antelopejs/mongodb` behaves this way:

- It calls `internal.SetClient` only in its default `owned` mode. In `external`
  mode it never does, so `GetClient()` never resolves.
- When it disconnects (when AntelopeJS destroys it, or before it reconnects),
  it closes the client and calls `internal.UnsetClient()`.
- It connects with the URL and options only, so `client.db()` without a name
  uses the database named in the connection string, not the module's
  `database` option.

## Gotchas

- `GetClient()` only resolves after a provider module hands over its client.
  Without one loaded in the app (or with `@antelopejs/mongodb` in `external`
  mode), the promise stays pending forever. It does not reject or time out.
- Call `GetClient()` at the point of use rather than caching the client at
  module load. After a disconnect, a kept client is closed, and a fresh
  `GetClient()` call waits for the next connection.
- Never call `client.close()` from consumer code. The connection is a shared
  singleton owned by the provider module.
- Collections from `collection("name")` are `Collection<Document>`, whose
  fields are `any`. `collection<User>("name")` types them, but the driver does
  not check stored documents against that type.
- This interface adds no abstraction over the driver. For query syntax and
  options, rely on the official MongoDB Node.js driver documentation.

## Deeper reference

See this package's `docs/1.introduction.md` (an overview, getting started,
`GetClient`, reading and writing documents, aggregation pipelines and indexes)
and the shipped `dist/index.d.ts` for the exact typed surface.
