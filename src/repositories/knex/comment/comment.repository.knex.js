import { commentMap, commentsMap } from "./comment.mapper.knex.js";

/**
 * @returns {import('../interfaces.js').CommentRepository}
 */
export const createKnexCommentRepository = (db) => ({
  async findAll({ postId, page = 1, limit = 20 } = {}) {
    const q = db("comments as c");

    if (postId) {
      q.where("post_id", postId);
    }

    const countQuery = db("comments");
    if (postId) {
      countQuery.where("post_id", postId);
    }
    const [{ count }] = await countQuery.count();

    const data = await q
      .select("c.*", "u.name as author_name")
      .leftJoin("users as u", "u.id", "c.author_id")
      .limit(limit)
      .orderBy("c.created_at", "desc")
      .offset((page - 1) * limit);

    return {
      data: commentsMap(data),
      total: Number(count),
      page,
      limit,
    };
  },
  async findById(id) {
    const comment = await db("comments").select("*").where("id", id).first();

    if (!comment) return null;

    return commentMap(comment);
  },
  async create({ postId, authorId, body } = {}) {
    const [comment] = await db("comments")
      .insert({
        post_id: postId,
        author_id: authorId,
        body,
      })
      .returning("*");

    return commentMap(comment);
  },
  async remove(id) {
    const deleted = await db("comments").where("id", id).delete();
    return deleted > 0;
  },
});
