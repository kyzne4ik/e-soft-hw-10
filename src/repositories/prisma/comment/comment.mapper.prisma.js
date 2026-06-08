export const commentMap = (comments) =>
  comments.map((c) => ({
    id: c.id,
    post_id: c.post_id,
    author_id: c.author_id,
    body: c.body,
    created_at: c.created_at,
    author_name: c.author?.name,
  }));
