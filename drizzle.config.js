import "dotenv/config";

/** @type {import('drizzle-kit').Config} */
export default {
  schema: "./src/drizzle/schema.js",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST_DRIZZLE,
    port: Number(process.env.DB_PORT_DRIZZLE),
    database: process.env.DB_NAME_DRIZZLE,
    user: process.env.DB_USER_DRIZZLE,
    password: process.env.DB_PASSWORD_DRIZZLE,
    ssl: false,
  },
};
