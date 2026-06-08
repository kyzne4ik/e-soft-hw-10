import { isVoid } from "../../../utils/index.js";
import { postAllMap, postDetailMap, postMap } from "./post.mapper.knex.js";

/**
 * @returns {import('../interfaces.js').PostRepository}
 */
export const createKnexPostRepository = (db) => ({
  async findAll({ status, userId, tagId, page = 1, limit = 20 } = {}) {
    const q = db("posts as p")
      .select(
        "p.id",
        "p.user_id",
        "p.title",
        "p.body",
        "p.status",
        "p.created_at",
        "p.updated_at",
        "u.name as author_name",
      )
      .countDistinct("c.id as comments_count")
      .leftJoin("users as u", "u.id", "p.user_id")
      .leftJoin("comments as c", "c.post_id", "p.id")
      .groupBy("p.id", "u.name")
      .orderBy("p.created_at", "desc")
      .limit(limit)
      .offset((page - 1) * limit);

    const countQ = db("posts as p");

    if (status) {
      countQ.where("p.status", status);
      q.where("p.status", status);
    }

    if (userId) {
      countQ.where("p.user_id", userId);
      q.where("p.user_id", userId);
    }

    if (tagId) {
      countQ
        .join("post_tags as pt", "pt.post_id", "p.id")
        .where("pt.tag_id", tagId);
      q.join("post_tags as pt", "pt.post_id", "p.id").where("pt.tag_id", tagId);
    }

    const data = await q;
    const [{ count }] = await countQ.count();

    return {
      data: postAllMap(data),
      total: Number(count),
      page,
      limit,
    };
  },
  async findById(id) {
    const row = await db("posts as p")
      .select(
        "p.*",
        "u.id as author_id",
        "u.name as author_name",
        "u.email as author_email",
      )
      .leftJoin("users as u", "u.id", "p.user_id")
      .where("p.id", id)
      .first();

    if (!row) return null;

    const comments = await db("comments as c")
      .select(
        "c.id",
        "c.post_id",
        "c.author_id",
        "c.body",
        "c.created_at",
        "u.name as author_name",
      )
      .leftJoin("users as u", "u.id", "c.author_id")
      .where("c.post_id", id);

    const tags = await db("post_tags as pt")
      .select("t.id", "t.name")
      .join("tags as t", "t.id", "pt.tag_id")
      .where("pt.post_id", id);

    return postDetailMap(row, comments, tags);
  },
  async create({ userId, title, body, status } = {}) {
    const [post] = await db("posts")
      .insert({
        user_id: userId,
        title,
        body,
        status,
      })
      .returning("*");
    return postMap(post);
  },
  async createWithTags({ userId, title, body, status, tagIds } = {}) {
    const trx = await db.transaction();
    let post;

    try {
      [post] = await trx("posts")
        .insert({
          user_id: userId,
          title,
          body,
          status,
        })
        .returning("*");

      if (tagIds.length > 0)
        await trx("post_tags").insert(
          tagIds.map((tag) => ({
            post_id: post.id,
            tag_id: tag,
          })),
        );

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }

    return await this.findById(post.id);
  },
  async update(id, { title, body, status } = {}) {
    if (isVoid({ title, body, status })) return this.findById(id);

    const [post] = await db("posts")
      .where("id", id)
      .update({
        body,
        title,
        status,
      })
      .returning("*");

    return post ? postMap(post) : null;
  },
  async remove(id) {
    const deleted = await db("posts").where("id", id).delete();
    return deleted > 0;
  },
});
