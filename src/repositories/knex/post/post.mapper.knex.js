export const postMap = (p) => ({
  id: p.id,
  userId: p.user_id,
  title: p.title,
  body: p.body,
  status: p.status,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});

export const postAllMap = (posts) =>
  posts.map((p) => ({
    id: p.id,
    userId: p.user_id,
    title: p.title,
    body: p.body,
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    authorName: p.author_name,
    commentsCount: p.comments_count ?? 0,
  }));

export const postDetailMap = (p, cs, pts) => ({
  id: p.id,
  userId: p.user_id,
  title: p.title,
  body: p.body,
  status: p.status,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
  author: {
    id: p.author_id,
    name: p.author_name,
    email: p.author_email,
  },
  comments: cs.map((c) => ({
    id: c.id,
    postId: c.post_id,
    authorId: c.author_id,
    body: c.body,
    createdAt: c.created_at,
    authorName: c.author_name,
  })),
  tags: pts.map((pt) => ({
    id: pt.id,
    name: pt.name,
  })),
});
