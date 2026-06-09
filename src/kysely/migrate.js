import "dotenv/config";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Migrator, FileMigrationProvider } from "kysely";
import { kyselyDb, kyselyPool } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const migrator = new Migrator({
  db: kyselyDb,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, "migrations"),
  }),
});

const direction = process.argv[2] === "down" ? "down" : "up";

async function main() {
  const { error, results } =
    direction === "up"
      ? await migrator.migrateToLatest()
      : await migrator.migrateDown();

  for (const r of results ?? []) {
    if (r.status === "Success") {
      console.log(`[kysely-migrate] ${direction} ✓ ${r.migrationName}`);
    } else if (r.status === "Error") {
      console.error(`[kysely-migrate] ${direction} ✗ ${r.migrationName}`);
    }
  }

  if (error) {
    console.error("[kysely-migrate] failed:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await kyselyDb.destroy();
    await kyselyPool.end().catch(() => {});
  });
