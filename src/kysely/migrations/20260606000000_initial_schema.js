import { sql } from "kysely";

/**
 * @param {import("kysely").Kysely<unknown>} db
 */
export async function up(db) {
  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;
  `.execute(db);

  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (c) => c.primaryKey())
    .addColumn("email", "varchar(255)", (c) => c.notNull().unique())
    .addColumn("name", "varchar(100)", (c) => c.notNull())
    .addColumn("role", "varchar(20)", (c) => c.defaultTo("user"))
    .addColumn("created_at", "timestamp", (c) =>
      c.defaultTo(sql`NOW()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (c) =>
      c.defaultTo(sql`NOW()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
  `.execute(db);

  await db.schema
    .createTable("posts")
    .addColumn("id", "serial", (c) => c.primaryKey())
    .addColumn("user_id", "integer", (c) =>
      c.references("users.id").onDelete("cascade"),
    )
    .addColumn("title", "varchar(300)", (c) => c.notNull())
    .addColumn("body", "text")
    .addColumn("status", "varchar(20)", (c) => c.defaultTo("draft"))
    .addColumn("created_at", "timestamp", (c) =>
      c.defaultTo(sql`NOW()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (c) =>
      c.defaultTo(sql`NOW()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
  `.execute(db);

  await db.schema
    .createTable("comments")
    .addColumn("id", "serial", (c) => c.primaryKey())
    .addColumn("post_id", "integer", (c) =>
      c.references("posts.id").onDelete("cascade"),
    )
    .addColumn("author_id", "integer", (c) =>
      c.references("users.id").onDelete("set null"),
    )
    .addColumn("body", "text", (c) => c.notNull())
    .addColumn("created_at", "timestamp", (c) =>
      c.defaultTo(sql`NOW()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("tags")
    .addColumn("id", "serial", (c) => c.primaryKey())
    .addColumn("name", "varchar(50)", (c) => c.notNull().unique())
    .execute();

  await db.schema
    .createTable("post_tags")
    .addColumn("post_id", "integer", (c) =>
      c.notNull().references("posts.id").onDelete("cascade"),
    )
    .addColumn("tag_id", "integer", (c) =>
      c.notNull().references("tags.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("post_tags_pk", ["post_id", "tag_id"])
    .execute();
}

/**
 * @param {import("kysely").Kysely<unknown>} db
 */
export async function down(db) {
  await sql`DROP TRIGGER IF EXISTS update_users_updated_at ON users`.execute(
    db,
  );
  await sql`DROP TRIGGER IF EXISTS update_posts_updated_at ON posts`.execute(
    db,
  );

  await db.schema.dropTable("post_tags").ifExists().execute();
  await db.schema.dropTable("comments").ifExists().execute();
  await db.schema.dropTable("posts").ifExists().execute();
  await db.schema.dropTable("tags").ifExists().execute();
  await db.schema.dropTable("users").ifExists().execute();

  await sql`DROP FUNCTION IF EXISTS update_updated_at() CASCADE`.execute(db);
}
