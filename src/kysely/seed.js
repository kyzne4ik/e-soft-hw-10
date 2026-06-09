import { sql } from "kysely";
import { kyselyDb, kyselyPool } from "./db.js";

async function seed() {
  await kyselyDb.deleteFrom("post_tags").execute();
  await kyselyDb.deleteFrom("comments").execute();
  await kyselyDb.deleteFrom("posts").execute();
  await kyselyDb.deleteFrom("tags").execute();
  await kyselyDb.deleteFrom("users").execute();

  await kyselyDb
    .insertInto("users")
    .values([
      { id: 1, email: "1-some-email@gmail.com", name: "1-some-name" },
      { id: 2, email: "2-some-email@gmail.com", name: "2-some-name" },
      { id: 3, email: "3-some-email@gmail.com", name: "3-some-name" },
      { id: 4, email: "4-some-email@gmail.com", name: "4-some-name" },
      { id: 5, email: "5-some-email@gmail.com", name: "5-some-name" },
    ])
    .execute();

  await kyselyDb
    .insertInto("posts")
    .values(
      Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        user_id: Math.floor(i / 2) + 1,
        title: "some-post-title",
        body: "some-post-text",
      })),
    )
    .execute();

  await kyselyDb
    .insertInto("comments")
    .values(
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        post_id: 1,
        author_id: 1,
        body: "some-comment-text",
      })),
    )
    .execute();

  await kyselyDb
    .insertInto("tags")
    .values([
      { id: 1, name: "1-some-tag" },
      { id: 2, name: "2-some-tag" },
      { id: 3, name: "3-some-tag" },
      { id: 4, name: "4-some-tag" },
      { id: 5, name: "5-some-tag" },
    ])
    .execute();

  await kyselyDb
    .insertInto("post_tags")
    .values([
      { post_id: 1, tag_id: 1 },
      { post_id: 2, tag_id: 2 },
      { post_id: 3, tag_id: 3 },
      { post_id: 4, tag_id: 4 },
      { post_id: 5, tag_id: 5 },
      { post_id: 6, tag_id: 1 },
      { post_id: 7, tag_id: 2 },
      { post_id: 8, tag_id: 3 },
      { post_id: 9, tag_id: 4 },
      { post_id: 10, tag_id: 5 },
    ])
    .execute();

  await sql`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`.execute(
    kyselyDb,
  );
  await sql`SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts))`.execute(
    kyselyDb,
  );
  await sql`SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments))`.execute(
    kyselyDb,
  );
  await sql`SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags))`.execute(
    kyselyDb,
  );

  console.log("[kysely-seed] done");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await kyselyDb.destroy();
    await kyselyPool.end().catch(() => {});
  });
