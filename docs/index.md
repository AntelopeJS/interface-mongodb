# MongoDB Interface

## Overview

The MongoDB interface provides direct access to the MongoDB client instance through the `GetClient` method. This allows advanced operations using the raw MongoDB client.

## Dependencies

This module depends on the following NPM packages:

- [**mongodb**](https://www.npmjs.com/package/mongodb) The official MongoDB driver for Node.js

## Features

- Direct access to the MongoDB client for native operations
- Type-safe client access with TypeScript

## API

### GetClient

Provides access to the underlying MongoDB client instance.

```typescript
import { GetClient } from "@ajs/mongodb/dev";

// Usage example
async function example() {
  // Get the MongoDB client
  const client = await GetClient();

  // Use native MongoDB client methods
  const admin = client.db("admin");
  const serverStatus = await admin.command({ serverStatus: 1 });
}
```

#### Returns

- `Promise<MongoClient>`: A promise that resolves to the MongoDB client instance
