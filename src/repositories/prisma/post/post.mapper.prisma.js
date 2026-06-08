export const postAllMap = (posts) =>
  posts.map((p) => ({
    id: p.id,
    userId: p.userId,
    title: p.title,
    body: p.body,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    authorName: p.user?.name,
    commentsCount: p._count?.comments ?? 0,
  }));

export const postByIdMap = (p) => ({
  id: p.id,
  userId: p.userId,
  title: p.title,
  body: p.body,
  status: p.status,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
  author: p.user
    ? {
        id: p.user.id,
        name: p.user.name,
        email: p.user.email,
      }
    : null,
  comments: (p.comments || []).map((c) => ({
    id: c.id,
    postId: c.postId,
    authorId: c.authorId,
    body: c.body,
    createdAt: c.createdAt,
    authorName: c.author?.name,
  })),
  tags: (p.postTags || []).map((pt) => ({
    id: pt.tag.id,
    name: pt.tag.name,
  })),
});
