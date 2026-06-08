import { prisma } from "../prisma.js";

const BENCH = { NPLUS1: "[nplus1]", INCLUDE: "[include]" };

// ============= N+1 ==============
console.time(BENCH.NPLUS1);
const posts_bad = await prisma.post.findMany();
for (const post of posts_bad) {
  const user = await prisma.user.findUnique({ where: { id: post.user_id } });

  console.log(`"${post.title}" by ${user.name}`);
}
console.timeEnd(BENCH.NPLUS1);

// ============= INCLUDE ==============
console.time(BENCH.INCLUDE);
const posts_good = await prisma.post.findMany({
  include: {
    user: {
      select: {
        name: true,
      },
    },
  },
});
for (const post of posts_good) {
  console.log(`"${post.title}" by ${post.user.name}`);
}
console.timeEnd(BENCH.INCLUDE);

/* Сравните время и количество запросов (включите log: ['query']).

  Исходя из результатов (которые ниже) наглядно видно, 
  что используя JOIN в include, чтобы получить всех нужных пользователей за один раз гораздо быстрее,
  чем если бы мы в n+1 выполняли один запрос на посты и затем отдельный запрос для каждого пользователя.
  
  Кол-во запросов:
  |    n + 1   |   include   |
  |      31    |      2      |
*/

/* Результаты по времени

  ➜  e-soft-hw-10 git:(feat/prisma) ✗ npm run demo:nplus1

  > hw8-knex-prisma@1.0.0 demo:nplus1
  > node src/demos/n-plus-one.js

  ...
  [nplus1]: 76.281ms
  
  ...
  [include]: 3.336ms

*/

/* Результаты кол-ва запросов n+1

prisma:query SELECT "public"."posts"."id", "public"."posts"."user_id", "public"."posts"."title", "public"."posts"."body", "public"."posts"."status", "public"."posts"."created_at", "public"."posts"."updated_at" FROM "public"."posts" WHERE 1=1 OFFSET $1
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 1 by 1-some-name" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 2 by 1-some-name" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 1 by 2-some-name" by 2-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 2 by 2-some-name" by 2-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 1 by 3-some-name" by 3-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 2 by 3-some-name" by 3-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 1 by 4-some-name" by 4-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 2 by 4-some-name" by 4-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 1 by 5-some-name" by 5-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"Post 2 by 5-some-name" by 5-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-2" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-2" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-2" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-2" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-2" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-2" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-2" by 1-some-name
prisma:query SELECT "public"."users"."id", "public"."users"."email", "public"."users"."name", "public"."users"."role", "public"."users"."created_at", "public"."users"."updated_at" FROM "public"."users" WHERE ("public"."users"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
"some-title-10" by 1-some-name
[nplus1]: 76.281ms

*/

/* Результаты кол-ва запросов у inсlude

prisma:query SELECT "public"."posts"."id", "public"."posts"."user_id", "public"."posts"."title", "public"."posts"."body", "public"."posts"."status", "public"."posts"."created_at", "public"."posts"."updated_at" FROM "public"."posts" WHERE 1=1 OFFSET $1
prisma:query SELECT "public"."users"."id", "public"."users"."name" FROM "public"."users" WHERE "public"."users"."id" IN ($1,$2,$3,$4,$5) OFFSET $6
"Post 1 by 1-some-name" by 1-some-name
"Post 2 by 1-some-name" by 1-some-name
"Post 1 by 2-some-name" by 2-some-name
"Post 2 by 2-some-name" by 2-some-name
"Post 1 by 3-some-name" by 3-some-name
"Post 2 by 3-some-name" by 3-some-name
"Post 1 by 4-some-name" by 4-some-name
"Post 2 by 4-some-name" by 4-some-name
"Post 1 by 5-some-name" by 5-some-name
"Post 2 by 5-some-name" by 5-some-name
"some-title-2" by 1-some-name
"some-title-2" by 1-some-name
"some-title-2" by 1-some-name
"some-title-2" by 1-some-name
"some-title-2" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-10" by 1-some-name
"some-title-2" by 1-some-name
"some-title-10" by 1-some-name
"some-title-2" by 1-some-name
"some-title-10" by 1-some-name
[include]: 3.336ms

*/