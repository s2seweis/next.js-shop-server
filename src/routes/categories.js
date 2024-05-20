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
  region: 'eu-central-1'
});

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ### Add Category
router.post("/category", upload.single('category_image'), async (req, res) => {
  try {
    const { category_name, number_of_products } = req.body;

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const extension = mime.extension(mimeType);
    const fileName = `${uuidv4()}.${extension}`;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: mimeType, // Set the correct content type,
      ACL: 'public-read', // Set ACL to public read
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        console.error('Error uploading image to S3:', err);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      const category_image = data.Location;
      const key = data.Key;

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
router.put("/category/:id", upload.single('category_image'), async (req, res) => {
  const { id } = req.params;
  const { category_name, number_of_products } = req.body;
  const category_id = parseInt(id, 10);

  if (isNaN(category_id)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  const buffer = req.file?.buffer;
  const mimeType = req.file?.mimetype;

  if (!buffer || !mimeType) {
    return res.status(400).json({ error: 'Invalid image file' });
  }

  const extension = mime.extension(mimeType);
  const fileName = `${uuidv4()}.${extension}`;

  try {
    // Delete the existing image from S3
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.body.key
    };

    await s3.deleteObject(deleteParams).promise();

    // Upload the new image to S3
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read'
    };

    s3.upload(uploadParams, async (err, data) => {
      if (err) {
        console.error('Error uploading image to S3:', err);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      const category_image = data.Location;
      const key = data.Key;

      try {
        const updatedCategory = await CategoryRepo.update(category_id, category_name, category_image, number_of_products, key);

        if (updatedCategory) {
          return res.json(updatedCategory);
        } else {
          return res.sendStatus(404);
        }
      } catch (dbError) {
        console.error("Error updating category in database:", dbError);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (s3Error) {
    console.error('Error deleting image from S3:', s3Error);
    return res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Delete category
router.delete("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:0", id);
    const category_id = id;
    console.log("line:1", category_id);

    // Access the key from the request body
    const { key } = req.body; 

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
