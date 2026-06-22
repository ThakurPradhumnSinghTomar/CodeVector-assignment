const express = require("express");
const productRoutes = require("./routes/product.routes");
const path = require("path");


const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/products", productRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server healthy",
  });
});

module.exports = app;