import { sql } from "drizzle-orm";
import { drizzleDb, drizzlePool } from "./db.js";
import { users, posts, comments, tags, postTags } from "./schema.js";

async function seed() {
  await drizzleDb.delete(postTags);
  await drizzleDb.delete(comments);
  await drizzleDb.delete(posts);
  await drizzleDb.delete(tags);
  await drizzleDb.delete(users);

  await drizzleDb.insert(users).values([
    { id: 1, email: "1-some-email@gmail.com", name: "1-some-name" },
    { id: 2, email: "2-some-email@gmail.com", name: "2-some-name" },
    { id: 3, email: "3-some-email@gmail.com", name: "3-some-name" },
    { id: 4, email: "4-some-email@gmail.com", name: "4-some-name" },
    { id: 5, email: "5-some-email@gmail.com", name: "5-some-name" },
  ]);

  await drizzleDb.insert(posts).values(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      userId: Math.floor(i / 2) + 1,
      title: "some-post-title",
      body: "some-post-text",
    })),
  );

  await drizzleDb.insert(comments).values(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      postId: 1,
      authorId: 1,
      body: "some-comment-text",
    })),
  );

  await drizzleDb.insert(tags).values([
    { id: 1, name: "1-some-tag" },
    { id: 2, name: "2-some-tag" },
    { id: 3, name: "3-some-tag" },
    { id: 4, name: "4-some-tag" },
    { id: 5, name: "5-some-tag" },
  ]);

  await drizzleDb.insert(postTags).values([
    { postId: 1, tagId: 1 },
    { postId: 2, tagId: 2 },
    { postId: 3, tagId: 3 },
    { postId: 4, tagId: 4 },
    { postId: 5, tagId: 5 },
    { postId: 6, tagId: 1 },
    { postId: 7, tagId: 2 },
    { postId: 8, tagId: 3 },
    { postId: 9, tagId: 4 },
    { postId: 10, tagId: 5 },
  ]);

  await drizzleDb.execute(
    sql`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`,
  );
  await drizzleDb.execute(
    sql`SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts))`,
  );
  await drizzleDb.execute(
    sql`SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments))`,
  );
  await drizzleDb.execute(
    sql`SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags))`,
  );

  console.log("[drizzle-seed] done");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => drizzlePool.end());
