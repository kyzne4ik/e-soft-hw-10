export const commentMap = (comments) =>
  comments.map((c) => ({
    id: c.id,
    postId: c.postId,
    authorId: c.authorId,
    body: c.body,
    createdAt: c.createdAt,
    authorName: c.author?.name,
  }));
