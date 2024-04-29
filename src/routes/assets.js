const express = require("express");
const AssetsRepo = require("../repos/assets-repos");

const router = express.Router();

// Get all assets
router.get("/assets", async (req, res) => {
  try {
    const assets = await AssetsRepo.find();
    res.send(assets);
  } catch (error) {
    console.error("Error getting assets:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get asset by ID
router.get("/assets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await AssetsRepo.findById(id);

    if (asset) {
      res.send(asset);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error getting asset by ID:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Add asset
router.post("/assets", async (req, res) => {
  try {
    const { username, bio } = req.body;
    const asset = await AssetsRepo.insert(username, bio);
    res.send(asset);
  } catch (error) {
    console.error("Error adding asset:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update asset
router.put("/assets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, bio } = req.body;

    const updatedAsset = await AssetsRepo.update(id, username, bio);

    if (updatedAsset) {
      res.send(updatedAsset);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating asset:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Delete asset
router.delete("/assets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAsset = await AssetsRepo.delete(id);

    if (deletedAsset) {
      res.send(deletedAsset);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error deleting asset:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
