/**
 * @returns {import('../interfaces.js').CommentRepository}
 */
export const createKnexCommentRepository = (db) => ({
  async findAll({ postId, page = 1, limit = 20 } = {}) {
    const q = db("comments");

    if (postId) {
      q.where("post_id", postId);
    }

    const countQuery = db("comments");
    if (postId) {
      countQuery.where("post_id", postId);
    }
    const [{ count }] = await countQuery.count();

    const data = await q
      .select("*")
      .limit(limit)
      .orderBy("created_at", "desc")
      .offset((page - 1) * limit);

    return {
      data: data,
      total: Number(count),
      page,
      limit,
    };
  },
  async findById(id) {
    const comment = await db("comments").select("*").where("id", id).first();
    return comment ?? null;
  },
  async create({ postId, authorId, body } = {}) {
    const [comment] = await db("comments")
      .insert({
        post_id: postId,
        author_id: authorId,
        body,
      })
      .returning("*");

    return comment;
  },
  async remove(id) {
    const deleted = await db("comments").where("id", id).delete();
    return deleted > 0;
  },
});
