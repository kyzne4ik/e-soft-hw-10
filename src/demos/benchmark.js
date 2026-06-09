import { prisma } from "../prisma.js";
import { db } from "../db.js";
import { drizzleDb, drizzlePool } from "../drizzle/db.js";
import { posts as drizzlePosts } from "../drizzle/schema.js";
import { kyselyDb, kyselyPool } from "../kysely/db.js";

const BENCH = {
  PRISMA: "[bench]-[ prisma  ]",
  KNEX: "[bench]-[ knex    ]",
  DRIZZLE: "[bench]-[ drizzle ]",
  KYSELY: "[bench]-[ kysely  ]",
};

async function run100(func) {
  for (let i = 0; i < 100; i++) {
    await func();
  }
}

async function main() {
  // ============== PRISMA =================
  console.time(BENCH.PRISMA);
  await run100(() => prisma.post.findMany());
  console.timeEnd(BENCH.PRISMA);

  // ============== KNEX ===================
  console.time(BENCH.KNEX);
  await run100(() => db("posts").select("*"));
  console.timeEnd(BENCH.KNEX);

  // ============== DRIZZLE ================
  console.time(BENCH.DRIZZLE);
  await run100(() => drizzleDb.select().from(drizzlePosts));
  console.timeEnd(BENCH.DRIZZLE);

  // ============== KYSELY =================
  console.time(BENCH.KYSELY);
  await run100(() => kyselyDb.selectFrom("posts").selectAll().execute());
  console.timeEnd(BENCH.KYSELY);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await db.destroy();
    await drizzlePool.end().catch(() => {});
    await kyselyDb.destroy();
    await kyselyPool.end().catch(() => {});
  });

// ============== RESULT =================
/*

  NODE_ENV=production node /home/nesk/projects/e-soft/e-soft-hw-10/src/demos/benchmark.js
  [bench]-[ prisma  ]: 104.05ms
  [bench]-[ knex    ]: 41.965ms
  [bench]-[ drizzle ]: 45.248ms
  [bench]-[ kysely  ]: 33.695ms

*/
/*

  NODE_ENV=development node /home/nesk/projects/e-soft/e-soft-hw-10/src/demos/benchmark.js
  [bench]-[ prisma  ]: 111.363ms
  [bench]-[ knex    ]: 41.918ms
  [bench]-[ drizzle ]: 50.235ms
  [bench]-[ kysely  ]: 40.805ms

*/

// Как итог, скажу, что призма крутая, типобезопасная,
// но медленнее в сравнении с knex.
