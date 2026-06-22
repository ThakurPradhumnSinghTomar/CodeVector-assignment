const prisma = require("../config/prisma");

const BATCH_SIZE = 10000;

const categories = [
  "Books",
  "Electronics",
  "Fashion",
  "Sports",
  "Home",
  "Gaming",
  "Health",
  "Toys",
];

const productNames = [
  "Laptop",
  "Phone",
  "Keyboard",
  "Monitor",
  "Book",
  "Chair",
  "Watch",
  "Headphones",
  "Mouse",
  "Shoes",
];

function generateProduct() {
  return {
    name:
      productNames[
        Math.floor(Math.random() * productNames.length)
      ],

    category:
      categories[
        Math.floor(Math.random() * categories.length)
      ],

    price: Number(
      (Math.random() * 10000).toFixed(2)
    ),
  };
}

async function seedProducts(count) {
  const startTime = Date.now();

  for (let start = 0; start < count; start += BATCH_SIZE) {
    const currentBatchSize = Math.min(
      BATCH_SIZE,
      count - start
    );

    const batch = [];

    for (let i = 0; i < currentBatchSize; i++) {
      batch.push(generateProduct());
    }
    console.time(`batch-${start}`);
    await prisma.product.createMany({
      data: batch,
    });
    console.time(`batch-${start}`);
        
  }

  return {
    productsCreated: count,
    durationMs: Date.now() - startTime,
  };
}

module.exports = {
  seedProducts,
};