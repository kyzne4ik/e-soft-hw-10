import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");
  await prisma.postTag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  console.log("Deleted existing data.");

  await prisma.$executeRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE posts_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE tags_id_seq RESTART WITH 1`;

  const users = await Promise.all([
    prisma.user.create({
      data: { email: "1-some-email", name: "1-some-name" },
    }),
    prisma.user.create({
      data: { email: "2-some-email", name: "2-some-name" },
    }),
    prisma.user.create({
      data: { email: "3-some-email", name: "3-some-name" },
    }),
    prisma.user.create({
      data: { email: "4-some-email", name: "4-some-name" },
    }),
    prisma.user.create({
      data: { email: "5-some-email", name: "5-some-name" },
    }),
  ]);

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "1-tag" } }),
    prisma.tag.create({ data: { name: "2-tag" } }),
    prisma.tag.create({ data: { name: "3-tag" } }),
    prisma.tag.create({ data: { name: "4-tag" } }),
    prisma.tag.create({ data: { name: "5-tag" } }),
  ]);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    for (let postNum = 0; postNum < 2; postNum++) {
      const post = await prisma.post.create({
        data: {
          user_id: user.id,
          title: `Post ${postNum + 1} by ${user.name}`,
          body: `Content of ${user.name}'s post #${postNum + 1}`,
        },
      });

      for (let commentNum = 0; commentNum < 2; commentNum++) {
        await prisma.comment.create({
          data: {
            post_id: post.id,
            author_id: user.id,
            body: `Comment ${commentNum + 1} on post ${post.id}`,
          },
        });
      }

      await prisma.postTag.create({
        data: {
          post_id: post.id,
          tag_id: tags[i].id,
        },
      });
    }
  }
  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
