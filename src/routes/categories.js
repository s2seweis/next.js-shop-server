const express = require("express");
const CategoryRepo = require("../repos/categories-repo");
const { log } = require("handlebars/runtime");
// const fs = require('fs');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4
const multer = require('multer');
require('dotenv').config();
const mime = require('mime-types');


const router = express.Router();

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await CategoryRepo.findAll();
    console.log("line:199 - Where???");
    console.log("line:200", categories);
    res.send(categories);
  } catch (error) {
    console.error("Error getting categories:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get category by ID
router.get("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:1", id);
    const category = await CategoryRepo.findById(id);

    if (category) {
      res.send(category);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error getting category by ID:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region:'eu-central-1'
});

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/category", upload.single('category_image'), async (req, res) => {
  try {
    const { category_name, number_of_products } = req.body;
    console.log("line:1", category_name);
    console.log("line:2", number_of_products);
    console.log("line:3", req.file);

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const extension = mime.extension(mimeType);
    const fileName = `${uuidv4()}.${extension}`;

    console.log("line:4", fileName);

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: mimeType, // Set the correct content type,
      ACL: 'public-read', // Set ACL to public read
    };

    console.log("line:5", params);

    s3.upload(params, async (err, data) => {
      if (err) {
        console.error('Error uploading image to S3:', err);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      const category_image = data.Location;
      const key = data.Key;
      console.log("line:6", category_image);
      console.log("line:7", key);

      // Insert category data into database
      await CategoryRepo.insert(category_name, category_image, number_of_products, key);
      
      // Send the category_image in the response
      res.json({ category_image, key });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update category
router.put("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:1", id);
    const category__id = id;
    const { category_name, category_image, number_of_products } = req.body;
    console.log("line:2", category_name);
    console.log("line:3", category_image);
    console.log("line:4", number_of_products);


    const updatedCategory = await CategoryRepo.update(category__id, category_name, category_image, number_of_products);

    if (updatedCategory) {
      res.send(updatedCategory);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Delete category
router.delete("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:100", id);
    const category_id = id;
    
    // Access the key from the request body
    const { key } = req.body; 
    console.log("line:200", key);

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key
    };

    try {
      // Delete the image from S3
      await s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting image:', error);
      return res.status(500).json({ error: 'Failed to delete image' });
    }

    // Delete the category from the database
    const deletedCategory = await CategoryRepo.delete(category_id);

    if (deletedCategory) {
      res.json({ message: 'Category and image deleted successfully' });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
