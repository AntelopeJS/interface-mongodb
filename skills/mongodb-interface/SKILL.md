---
name: mongodb-interface
description: Provides direct access to the shared MongoDB connection in an AntelopeJS app via a single GetClient() function that resolves to the raw mongodb driver MongoClient (full CRUD, aggregations, indexes, transactions). Use when code imports "@antelopejs/interface-mongodb", when you see GetClient or the internal.SetClient/UnsetClient namespace, or when a task asks to query/insert/update/aggregate MongoDB documents, access db()/collection(), or wire a MongoDB connection into an AntelopeJS module.
category: antelopejs-interface
tags: [mongodb, database, antelopejs, interface, driver]
---

# MongoDB Interface

Thin interface over the official `mongodb` Node.js driver. It holds a singleton
`Promise<MongoClient>`: a MongoDB provider module resolves it once connected, and
consumer code awaits it via `GetClient()`. There are no proxy crossings, decorators,
or query builders here — everything after `await GetClient()` is the plain driver API.

## Imports

```typescript
import { GetClient } from "@antelopejs/interface-mongodb";
```

The package has a single entry point (`.` in the exports map). It also exports an
`internal` namespace from the same path, which is for providers only (see below).
Driver types such as `MongoClient`, `ObjectId`, and `Filter` come from the `mongodb`
package, which is a regular dependency of this interface.

## Consuming

```typescript
import { GetClient } from "@antelopejs/interface-mongodb";

async function findUsersByRole(role: string) {
  const client = await GetClient();
  const users = client.db("myapp").collection("users");
  return users.find({ role }).toArray();
}
```

`GetClient()` returns a `Promise<MongoClient>` that resolves once a connection is
established. From there, use the standard driver API: `db()`, `collection()`,
`insertOne`, `find`, `aggregate`, `createIndex`, transactions, etc.

## Providing

A provider module (typically an AntelopeJS MongoDB module) owns the connection
lifecycle through the `internal` namespace: it calls `internal.SetClient(client)`
to resolve the pending promise when connected, sets `internal.connected`, and calls
`internal.UnsetClient()` on disconnect to arm a fresh unresolved promise. Consumer
code must never touch `internal`.

## Gotchas

- `GetClient()` only resolves after a provider module connects. Without a MongoDB
  provider module loaded in the app, the promise stays pending forever — it does
  not reject or time out.
- Call `GetClient()` at the point of use rather than caching the client at module
  load: on disconnect the provider swaps in a new promise via `internal.UnsetClient()`,
  and a fresh `GetClient()` call picks up the next connection.
- Never call `client.close()` from consumer code; the connection is a shared
  singleton owned by the provider module.
- This interface adds no abstraction over the driver — for query syntax and options,
  rely on the official MongoDB Node.js driver documentation.

## Deeper reference

See this package's `docs/1.introduction.md` ("Interface MongoDB Documentation":
Overview, Getting Started, GetClient, CRUD Operations, Aggregation Pipelines,
Indexes) and the shipped `dist/index.d.ts` for the exact typed surface.
