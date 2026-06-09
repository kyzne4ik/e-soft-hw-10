import "dotenv/config";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

const { Pool } = pg;

/**
 * @typedef {Object} UsersTable
 * @property {import("kysely").Generated<number>} id
 * @property {string} email
 * @property {string} name
 * @property {string | undefined} role
 * @property {import("kysely").Generated<Date>} created_at
 * @property {import("kysely").Generated<Date>} updated_at
 */

/**
 * @typedef {Object} PostsTable
 * @property {import("kysely").Generated<number>} id
 * @property {number | null} user_id
 * @property {string} title
 * @property {string | null} body
 * @property {string | undefined} status
 * @property {import("kysely").Generated<Date>} created_at
 * @property {import("kysely").Generated<Date>} updated_at
 */

/**
 * @typedef {Object} CommentsTable
 * @property {import("kysely").Generated<number>} id
 * @property {number | null} post_id
 * @property {number | null} author_id
 * @property {string} body
 * @property {import("kysely").Generated<Date>} created_at
 */

/**
 * @typedef {Object} TagsTable
 * @property {import("kysely").Generated<number>} id
 * @property {string} name
 */

/**
 * @typedef {Object} PostTagsTable
 * @property {number} post_id
 * @property {number} tag_id
 */

/**
 * @typedef {Object} Database
 * @property {UsersTable} users
 * @property {PostsTable} posts
 * @property {CommentsTable} comments
 * @property {TagsTable} tags
 * @property {PostTagsTable} post_tags
 */

export const kyselyPool = new Pool({
  host: process.env.DB_HOST_KYSELY,
  port: Number(process.env.DB_PORT_KYSELY),
  database: process.env.DB_NAME_KYSELY,
  user: process.env.DB_USER_KYSELY,
  password: process.env.DB_PASSWORD_KYSELY,
});

/** @type {Kysely<Database>} */
export const kyselyDb = new Kysely({
  dialect: new PostgresDialect({ pool: kyselyPool }),
  log:
    process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
});
