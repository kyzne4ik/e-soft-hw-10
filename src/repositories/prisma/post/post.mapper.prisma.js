export const postAllMap = (posts) =>
  posts.map((p) => ({
    id: p.id,
    user_id: p.user_id,
    title: p.title,
    body: p.body,
    status: p.status,
    created_at: p.created_at,
    updated_at: p.updated_at,
    author_name: p.user?.name,
    comments_count: p._count?.comment ?? 0,
  }));

export const postByIdMap = (p) => ({
  id: p.id,
  user_id: p.user_id,
  title: p.title,
  body: p.body,
  status: p.status,
  created_at: p.created_at,
  updated_at: p.updated_at,
  author: p.user
    ? {
        id: p.user.id,
        name: p.user.name,
        email: p.user.email,
      }
    : null,
  comments: (p.comment || []).map((c) => ({
    id: c.id,
    post_id: c.post_id,
    author_id: c.author_id,
    body: c.body,
    created_at: c.created_at,
    author_name: c.author?.name,
  })),
  tags: (p.postTags || []).map((pt) => ({
    id: pt.tag.id,
    name: pt.tag.name,
  })),
});
