/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("post_tags").del();
  await knex("comments").del();
  await knex("posts").del();
  await knex("tags").del();
  await knex("users").del();

  await knex("users").insert([
    {
      id: 1,
      email: "1-some-email@gmail.com",
      name: "1-some-name",
    },
    {
      id: 2,
      email: "2-some-email@gmail.com",
      name: "2-some-name",
    },
    {
      id: 3,
      email: "3-some-email@gmail.com",
      name: "3-some-name",
    },
    {
      id: 4,
      email: "4-some-email@gmail.com",
      name: "4-some-name",
    },
    {
      id: 5,
      email: "5-some-email@gmail.com",
      name: "5-some-name",
    },
  ]);

  await knex("posts").insert([
    { id: 1, user_id: 1, title: "some-post-title", body: "some-post-text" },
    { id: 2, user_id: 1, title: "some-post-title", body: "some-post-text" },
    { id: 3, user_id: 2, title: "some-post-title", body: "some-post-text" },
    { id: 4, user_id: 2, title: "some-post-title", body: "some-post-text" },
    { id: 5, user_id: 3, title: "some-post-title", body: "some-post-text" },
    { id: 6, user_id: 3, title: "some-post-title", body: "some-post-text" },
    { id: 7, user_id: 4, title: "some-post-title", body: "some-post-text" },
    { id: 8, user_id: 4, title: "some-post-title", body: "some-post-text" },
    { id: 9, user_id: 5, title: "some-post-title", body: "some-post-text" },
    { id: 10, user_id: 5, title: "some-post-title", body: "some-post-text" },
  ]);

  await knex("comments").insert([
    { id: 1, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 2, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 3, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 4, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 5, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 6, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 7, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 8, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 9, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 10, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 11, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 12, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 13, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 14, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 15, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 16, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 17, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 18, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 19, post_id: 1, author_id: 1, body: "some-comment-text" },
    { id: 20, post_id: 1, author_id: 1, body: "some-comment-text" },
  ]);

  await knex("tags").insert([
    { id: 1, name: "1-some-tag" },
    { id: 2, name: "2-some-tag" },
    { id: 3, name: "3-some-tag" },
    { id: 4, name: "4-some-tag" },
    { id: 5, name: "5-some-tag" },
  ]);

  await knex("post_tags").insert([
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
  ]);

  await knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
  await knex.raw("SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts))");
  await knex.raw(
    "SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments))",
  );
  await knex.raw("SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags))");
}
