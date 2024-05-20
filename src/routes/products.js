const express = require("express");
const ProductRepo = require("../repos/products-repos");

const router = express.Router();

// Get all product
router.get("/product", async (req, res) => {
  try {
    const product = await ProductRepo.find();

    const dateOfBirthArray = product.map((item) => item.dateOfBirth);

    res.send(product);
  } catch (error) {
    console.error("Error getting product:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get product by ID
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductRepo.findById(id);

    if (product) {
      res.send(product);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error getting product by ID:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Add product
router.post("/product", async (req, res) => {
  try {
    const { productname, price, category } = req.body;
    console.log("line:1", productname);
    console.log("line:2", price);
    console.log("line:3", category);

    // Validate required fields
    if (!productname || !price || !category) {
      return res
        .status(400)
        .json({ error: "Product name, price, and category are required." });
    }

    // Validate price is a valid number
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res
        .status(400)
        .json({ error: "price must be a valid number greater than zero." });
    }

    // Other validations can be added as needed

    const product = await ProductRepo.insert(productname, price, category);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update product
router.put("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { productname, price, category } = req.body;
    
    const updatedProduct = await ProductRepo.update(
      productname,
      price,
      category,
      id
    );

    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Delete product
router.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await ProductRepo.delete(id);

    if (deletedProfile) {
      res.send(deletedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
