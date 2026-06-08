import { prisma } from "../prisma.js";
import { db } from "../db.js";

const BENCH = { PRISMA: "[bench]-[ prisma ]", KNEX: "[bench]-[ knex ]" };

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await db.destroy();
  });

// ============== RESULT =================
/*

  NODE_ENV=production node /home/nesk/projects/e-soft/e-soft-hw-10/src/demos/benchmark.js
  [bench]-[ prisma ]: 131.354ms
  [bench]-[ knex ]: 44.637ms

*/
/*

  NODE_ENV=development node /home/nesk/projects/e-soft/e-soft-hw-10/src/demos/benchmark.js
  [bench]-[ prisma ]: 144.703ms
  [bench]-[ knex ]: 44.426ms

*/

// Как итог, скажу, что призма крутая, типобезопасная,
// но медленнее в сравнении с knex.
