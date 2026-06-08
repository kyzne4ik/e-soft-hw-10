export const userMap = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
  createdAt: u.created_at,
  updatedAt: u.updated_at,
});

export const usersMap = (users) => users.map(userMap);
