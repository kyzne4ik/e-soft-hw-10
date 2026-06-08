export const commentMap = (c) => ({
  id: c.id,
  postId: c.post_id,
  authorId: c.author_id,
  body: c.body,
  createdAt: c.created_at,
  authorName: c.author_name,
});

export const commentsMap = (comments) => comments.map(commentMap);
