const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");
const { seedProducts } = require("../services/seed.service"); 
const { getProducts } = require("../services/product.service"); 

router.post("/seed", async (req, res) => {
  try {
    const { count } = req.body;

    if (!Number.isInteger(count) || count <= 0) {
      return res.status(400).json({
        success: false,
        message: "count must be a positive integer",
      });
    }

    if (count > 200000) {
      return res.status(400).json({
        success: false,
        message: "Maximum allowed count is 200000",
      });
    }

    const existingCount = await prisma.product.count();

    if (existingCount + count > 300000) {
      return res.status(400).json({
        success: false,
        message: `Current products: ${existingCount}. Cannot exceed 300000 products.`,
      });
    }

    const result = await seedProducts(count);

    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.get("/count", async (req, res) => {
  const count = await prisma.product.count();

  res.json({
    count,
  });
});


router.get("/", async (req, res) => {
  try {
    const { limit = 20, category, cursor } = req.query;

    const result = await getProducts({
      limit: Number(limit),
      category,
      cursor,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;



module.exports = router;