import { userMap, usersMap } from "./user.mapper.knex.js";

/**
 * @returns {import('../interfaces.js').UserRepository}
 */
export const createKnexUserRepository = (db) => ({
  async findAll({ page = 1, limit = 20, role } = {}) {
    const q = db("users");
    const countQ = db("users");

    if (role) {
      q.where("role", role);
      countQ.where("role", role);
    }

    const data = await q
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset((page - 1) * limit);

    const [{ count }] = await countQ.count();

    return {
      data: usersMap(data),
      total: Number(count),
      page,
      limit,
    };
  },
  async findById(id) {
    const user = await db("users").where("id", id).first();

    if (!user) return null;

    return userMap(user);
  },
  async create({ email, name, role } = {}) {
    const [user] = await db("users")
      .insert({
        email,
        name,
        role,
      })
      .returning("*");

    return userMap(user);
  },
  async update(id, { email, name, role } = {}) {

    const [user] = await db("users")
      .where("id", id)
      .update({
        email,
        name,
        role,
      })
      .returning("*");

    return user ? userMap(user) : null;
  },
  async remove(id) {
    const deleted = await db("users").where("id", id).delete();

    return deleted > 0;
  },
});
