import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzleDb, drizzlePool } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  await migrate(drizzleDb, {
    migrationsFolder: path.join(__dirname, "migrations"),
  });
  console.log("[drizzle-migrate] done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => drizzlePool.end());
