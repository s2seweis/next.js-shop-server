const express = require("express");
const BasketRepo = require("../repos/basket-repos");

const router = express.Router();

// Get all basket
router.get("/basket", async (req, res) => {
  try {
    const basket = await BasketRepo.find();
    // console.log("line:500", basket);

    res.send(basket);
  } catch (error) {
    console.error("Error getting basket:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get basket by ID
router.get("/basket/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const basket = await BasketRepo.findById(id);

    if (basket) {
      res.send(basket);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error getting basket by ID:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Add basket
router.post("/basket", async (req, res) => {
  try {
    const { user_id, productid, productname, price, category, quantity } =
      req.body;
    console.log("line:1", user_id);
    console.log("line:2", productid);
    console.log("line:3", productname);
    console.log("line:4", price);
    console.log("line:5", category);
    console.log("line:6", quantity);

    // Assuming BasketRepo.insert takes an object representing basket properties
    const basket = await BasketRepo.insert({
      user_id,
      productid,
      productname,
      price,
      category,
      quantity,
    });

    res.send(basket);
  } catch (error) {
    console.error("Error adding basket:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update basket
router.put("/basket/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:1", id);
    const {
      user_id,
      bio,
      date_of_birth,
      location,
      website_url,
      profile_picture_url,
    } = req.body;

    const updatedProfile = await BasketRepo.update(
      user_id,
      bio,
      date_of_birth,
      location,
      website_url,
      profile_picture_url
    );

    if (updatedProfile) {
      res.send(updatedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating basket:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Delete basket
router.delete("/basket/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await BasketRepo.delete(id);

    if (deletedProfile) {
      res.send(deletedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error deleting basket:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// ### works - Add product to basket
router.post("/basket/add", async (req, res) => {
  try {
    const { userid, productid, productname, price, category, quantity } =
      req.body;
    console.log("line:1", userid);
    console.log("line:2", productid);
    console.log("line:3", productname);
    console.log("line:4", price);
    console.log("line:5", category);
    console.log("line:6", quantity);

    // Find the existing basket item for the user and product
    const existingBasketItem = await BasketRepo.findByUserAndProduct(
      userid,
      productid
    );

    if (existingBasketItem) {
      // If the item already exists, update the quantity
      const updatedBasketItem = await BasketRepo.updateQuantity(
        existingBasketItem.id,
        existingBasketItem.quantity + quantity
      );
      res.send(updatedBasketItem);
    } else {
      // If the item doesn't exist, create a new basket item
      const newBasketItem = await BasketRepo.insert({
        userid,
        productid,
        productname,
        price,
        category,
        quantity,
      });
      res.send(newBasketItem);
    }
  } catch (error) {
    console.error("Error adding product to basket:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//  works - Remove product from basket
router.post("/basket/remove", async (req, res) => {
  try {
    const { userid, productid } = req.body;
    console.log("line:1", userid);
    console.log("line:2", productid);

    // Find the basket item by user and product
    const basketItemToRemove = await BasketRepo.findByUserAndProduct(
      userid,
      productid
    );
    console.log("line:3", basketItemToRemove);

    if (basketItemToRemove) {
      // If the basket item exists, remove it
      const deletedBasketItem = await BasketRepo.delete(
        basketItemToRemove.basketid
      );
      res.send(deletedBasketItem);
    } else {
      // If the basket item doesn't exist, send a 404 status
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error removing product from basket:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update quantity for a product in the basket
router.post("/basket/updateQuantity", async (req, res) => {
  try {
    const { userid, productid, quantity } = req.body;
    console.log("line:1", userid);
    console.log("line:2", productid);
    console.log("line:3", quantity);

    // Find the basket item by user and product
    const basketItemToUpdate = await BasketRepo.findByUserAndProduct(
      userid,
      productid
    );
    console.log("line:4", basketItemToUpdate);

    if (basketItemToUpdate) {
      // If the basket item exists, update the quantity
      const updatedBasketItem = await BasketRepo.updateQuantity(
        basketItemToUpdate.productid,
        quantity
      );
      res.send(updatedBasketItem);
    } else {
      // If the basket item doesn't exist, send a 404 status
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating product quantity in basket:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
