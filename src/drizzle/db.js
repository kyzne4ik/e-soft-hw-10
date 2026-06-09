import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const { Pool } = pg;

export const drizzlePool = new Pool({
  host: process.env.DB_HOST_DRIZZLE,
  port: Number(process.env.DB_PORT_DRIZZLE),
  database: process.env.DB_NAME_DRIZZLE,
  user: process.env.DB_USER_DRIZZLE,
  password: process.env.DB_PASSWORD_DRIZZLE,
});

export const drizzleDb = drizzle(drizzlePool, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

export { schema };
