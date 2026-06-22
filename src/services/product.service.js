const prisma = require("../config/prisma");

async function getProducts({ limit = 20, category, cursor }) {
  limit = Math.min(Number(limit), 100);

  let cursorData = null;

  if (cursor) {
    cursorData = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
  }

  const where = {};

  if (category) {
    where.category = category;
  }

  if (cursorData) {
    where.OR = [
      {
        createdAt: {
          lt: new Date(cursorData.createdAt),
        },
      },
      {
        createdAt: new Date(cursorData.createdAt),
        id: {
          lt: BigInt(cursorData.id),
        },
      },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    take: limit + 1,
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
  });

  products.forEach((product) => {
    product.id = product.id.toString();
  });

  let nextCursor = null;

  if (products.length > limit) {
    const last = products[limit - 1];

    nextCursor = Buffer.from(
      JSON.stringify({
        createdAt: last.createdAt,
        id: last.id.toString(),
      }),
    ).toString("base64");

    products.pop();
  }

  return {
    products,
    nextCursor,
    hasMore: nextCursor !== null,
  };
}

module.exports = {
  getProducts,
};
