const express = require("express");
const CategoryRepo = require("../repos/categories-repo");
const { log } = require("handlebars/runtime");
// const fs = require('fs');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4
const multer = require('multer');

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

// ###

// AWS.config.update({
//   accessKeyId: 'YOUR_ACCESS_KEY_ID',
//   secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
//   region: 'YOUR_REGION', // e.g., 'us-east-1'
// });

// const s3 = new AWS.S3();
// const bucketName = 'YOUR_BUCKET_NAME';

// ###

// // Add category
// router.post("/category", async (req, res) => {
//   try {
//     const { category_name, category_image, number_of_products } = req.body;
//     console.log("line:99", req.body);
//     console.log("line:100", category_name);
//     console.log("line:200", category_image);
//     console.log("line:300", number_of_products);

//     // ### AWS Bucket

//     async function uploadImageToS3(filePath, fileName) {
//       const fileContent = fs.readFileSync(filePath);
    
//       const params = {
//         Bucket: bucketName,
//         Key: fileName,
//         Body: fileContent,
//         ACL: 'public-read', // Make the uploaded image publicly accessible
//       };
    
//       try {
//         const data = await s3.upload(params).promise();
//         console.log('File uploaded successfully:', data.Location);
//         return data.Location; // Return the URL of the uploaded image
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         throw error;
//       }
//     }

//     // ###

//     // Validate required fields
//     if (!category_name) {
//       return res
//         .status(400)
//         .json({ error: "Category name is required." });
//     }

//     // Validate number_of_products is a valid number
//     if (number_of_products && (isNaN(number_of_products) || parseInt(number_of_products) < 0)) {
//       return res
//         .status(400)
//         .json({ error: "Number of products must be a valid non-negative integer." });
//     }

//     const category = await CategoryRepo.insert(category_name, category_image, number_of_products);
//     res.status(201).json(category);
//   } catch (error) {
//     console.error("Error adding category:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region:'eu-central-1'
});

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add category
router.post("/category", upload.single('category_image'), async (req, res) => {
  try {
    const { category_name, number_of_products } = req.body;
    console.log("line:1", category_name);
    console.log("line:2", number_of_products);
    console.log("line:3", req.file); // Use req.file instead of req.files

    const buffer = req.file.buffer; // Access the file buffer from req.file

    const fileName = `${uuidv4()}.png`;
    console.log("line:4", fileName);

    const params = {
      Bucket: process.env.BUCKET_NAME,
      // Bucket: 'delivery-shop-demo',
      Key: fileName,
      Body: buffer,
      ACL: 'public-read',
      ContentType: 'image/png', // Specify content type
    };

    console.log("line:5", params);

    s3.upload(params, async (err, data) => {
      if (err) {
        console.error('Error uploading image to S3:', err);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      const category_image = data.Location;
      console.log("line:6", category_image);

      // Insert category data into database
      await CategoryRepo.insert(category_name, category_image, number_of_products);
      
      // Send the category_image in the response
      res.json({ category_image });
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
    const deletedCategory = await CategoryRepo.delete(category_id);

    if (deletedCategory) {
      res.send(deletedCategory);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
