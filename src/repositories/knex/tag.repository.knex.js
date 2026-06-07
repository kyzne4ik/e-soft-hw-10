/**
 * @returns {import('../interfaces.js').TagRepository}
 */
export const createKnexTagRepository = (db) => ({
  async findAll() {
    return await db("tags").select("*");
  },
  async findById(id) {
    return (await db("tags").select("*").where("id", id).first()) ?? null;
  },
  async findByName(name) {
    return (
      (await db("tags")
        .select("*")
        // .whereRaw("name LIKE ?", [`%${name}%`])
        .where("name", "like", `%${name}%`)
        .first()) ?? null
    );
  },
  async create({ name }) {
    const [tag] = await db("tags").insert({ name }).returning("*");
    return tag;
  },
  async attachToPost(postId, tagId) {
    const existing = await db("post_tags")
      .where("post_id", postId)
      .andWhere("tag_id", tagId)
      .first();
    if (existing) return;

    await db("post_tags").insert({ post_id: postId, tag_id: tagId });
  },
  async detachFromPost(postId, tagId) {
    const deleted = await db("post_tags")
      .where("post_id", postId)
      .andWhere("tag_id", tagId)
      .delete();

    return deleted > 0;
  },
});
