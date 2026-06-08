import { prisma } from "../../prisma.js";
import { db } from "../../db.js";

const BENCH = { PRISMA: "[bench]-[ prisma ]", KNEX: "[bench]-[ knex ]" };

async function run1000(func) {
  for (let i = 0; i < 1000; i++) {
    await func();
  }
}

// ============== PRISMA =================
console.time(BENCH.PRISMA);
await run1000(prisma.post.findMany);
console.timeEnd(BENCH.PRISMA);

// ============== KNEX ===================
console.time(BENCH.KNEX);
await run1000(db("posts").select.bind(null, "*"));
console.timeEnd(BENCH.KNEX);

// ============== RESULT =================
/*

  NODE_ENV=production node /home/nesk/projects/e-soft/e-soft-hw-10/src/repositories/demos/benchmark.js
  [bench]-[ prisma ]: 824.855ms
  [bench]-[ knex ]: 258.966ms

*/
/*

  NODE_ENV=development node /home/nesk/projects/e-soft/e-soft-hw-10/src/repositories/demos/benchmark.js
  [bench]-[ prisma ]: 956.823ms
  [bench]-[ knex ]: 247.351ms

*/

// Как итог, скажу, что призма крутая, типобезопасная, 
// но к сожалению медленная в сравнении с knex.