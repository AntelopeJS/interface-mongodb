import { equal } from "@antelopejs/tooling-configs/verify";
import type { Journey, VerifyConfig } from "@antelopejs/tooling-configs/verify";

import type * as MongoInterface from "../../../src/index.ts";

/** What the stub provider hands to `internal.SetClient`: the one method chain the consumer journey uses. */
const stubClient = { db: (name: string) => ({ databaseName: name }) };

/** The checks every probe shares: `Assert<Same<A, B>>` fails to compile when A and B are not assignable both ways. */
const PROBE_HEADER = `
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Assert<T extends true> = T;
type Answer<F extends (...args: never[]) => unknown> = Awaited<ReturnType<F>>;
`;

/** Compiles a probe against the packed declarations, in the consumer's strict mode: the structure each function answers is read back, not assumed. */
function answerTypes(title: string, probe: string): Journey {
  return {
    title,
    entryPoint: "a TypeScript consumer compiling against the packed declarations",
    async run(context) {
      const file = `${context.work}/probe.ts`;
      context.edit("write the answer probe", file, `import type * as Api from "${context.repo}/dist/index";\n${PROBE_HEADER}\n${probe.replaceAll("<repo>", context.repo)}`);
      const compiled = await context.command("compile the answer probe", "node", [
        `${context.repo}/node_modules/typescript/bin/tsc`,
        "--noEmit",
        "--strict",
        "--skipLibCheck",
        "--target",
        "es2022",
        "--module",
        "commonjs",
        "--moduleResolution",
        "node",
        "--typeRoots",
        `${context.repo}/node_modules/@types`,
        "--types",
        "node",
        file,
      ]);
      context.expect(compiled.folder, [
        { name: "every answer has the documented type", pass: compiled.exitCode === 0, detail: compiled.stdout.slice(0, 400) },
      ]);
    },
  };
}

/** The provider hand-off, run on the packed `dist/index.js`: set a client, reset, set another. */
const HANDOFF_SCRIPT = `
(async () => {
  const first = { id: "a" };
  const second = { id: "b" };
  c.internal.SetClient(first);
  const before = await c.GetClient();
  c.internal.UnsetClient();
  const waiting = await Promise.race([c.GetClient().then(() => "resolved"), new Promise((resolve) => setTimeout(() => resolve("pending"), 200))]);
  c.internal.SetClient(second);
  const after = await c.GetClient();
  console.log(JSON.stringify({ before: before.id, waiting, after: after.id, connected: c.internal.connected }));
})();
`;

const config: VerifyConfig<typeof MongoInterface> = {
  doors: {
    data: null,
    format: null,
    contract: {
      globs: ["src/index.ts", "package.json"],
      funnels: [],
      containments: [],
      why: "GetClient and the exports map are what every MongoDB consumer imports",
    },
    outbound: null,
    exposure: null,
    publish: {
      globs: ["package.json", ".release-it.json", "changelogen.config.json", ".github/workflows/release.yml"],
      funnels: [],
      containments: [],
      why: "the package name and release workflow claim @antelopejs/interface-mongodb on npm",
    },
  },
  interface: {
    provide(api) {
      // SAFETY: the consumer journey only reads db(name).databaseName, the one method chain the stub client implements.
      api.internal.SetClient(stubClient as never);
    },
    calls: {
      ".:GetClient": { call: async (api) => (await api.GetClient()).db("myapp").databaseName, expect: "myapp" },
    },
    providerSide: {
      ".:internal.SetClient": "the mongodb module calls it once its MongoClient is connected; consumers only call GetClient",
      ".:internal.UnsetClient": "the mongodb module calls it when it stops; consumers never do",
    },
  },
  journeys: {
    "client-type": answerTypes(
      "GetClient answers the driver's MongoClient",
      `type _Client = Assert<Same<Answer<typeof Api.GetClient>, import("<repo>/node_modules/mongodb").MongoClient>>;`,
    ),
    "provider-handoff": {
      title: "a provider's client reaches GetClient, and a reset makes consumers wait for the next one",
      entryPoint: "the packed interface required by a provider and a consumer",
      async run(context) {
        const loaded = await context.command("hand a client over, reset, hand another over", "node", [
          "-e",
          `const c = require(process.argv[1]); ${HANDOFF_SCRIPT}`,
          `${context.repo}/dist/index.js`,
        ]);
        context.expect(loaded.folder, [
          equal(
            "GetClient follows SetClient, waits after UnsetClient and follows the next SetClient",
            loaded.stdout.trim(),
            '{"before":"a","waiting":"pending","after":"b","connected":false}',
          ),
        ]);
      },
    },
  },
};

export default config;
