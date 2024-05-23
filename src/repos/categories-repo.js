const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

// Represents a repository for interacting with a PostgreSQL database table named "Categories."

// class CategoriesRepo {
//   static async findAll() {
//     const { rows } = await pool.query("SELECT * FROM Categories;");
//     return toCamelCase(rows);
//   }

// ###

class CategoriesRepo {
  static async findAll() {
    const { rows } = await pool.query(`
        SELECT c.*, m.url
        FROM categories c
        JOIN media m ON c.media_id = m.media_id;
      `);
    return toCamelCase(rows);
  }

  // ###

  static async findById(categoryId) {
    const { rows } = await pool.query(
      `
      SELECT * FROM Categories WHERE category_id = $1;
      `,
      [categoryId]
    );

    return toCamelCase(rows)[0];
  }

  // static async insert(category_name, category_image, number_of_products, key) {
  //   const { rows } = await pool.query(
  //     "INSERT INTO Categories (category_name, category_image, number_of_products, key) VALUES ($1, $2, $3, $4) RETURNING *;",
  //     [category_name, category_image, number_of_products, key]
  //   );

  //   return toCamelCase(rows)[0];
  // }

  static async insert(category_name, category_image, number_of_products, key) {
 
    try {
      // Start transaction
      await pool.query('BEGIN');

      // Define other media fields
      const media_type = 'image'; // Assuming 'image' is the type for category images
      const title = 'Category Image'; // Default title, modify as necessary
      const description = 'Image for category ' + category_name; // Description based on category name
      const uploaded_at = new Date().toISOString(); // Current timestamp
      const media_key = key; // Assuming same key is used

      // Insert into media table
      const mediaResult = await pool.query(
        `INSERT INTO media (media_type, url, title, description, uploaded_at, key)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING media_id;`,
        [media_type, category_image, title, description, uploaded_at, media_key]
      );

      const media_id = mediaResult.rows[0].media_id;

      // Insert into categories table
      const categoryResult = await pool.query(
        `INSERT INTO categories (category_name, media_id, number_of_products, key, category_image)
         VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [category_name, media_id, number_of_products, key, category_image]
      );

      // Commit transaction
      await pool.query('COMMIT');

      return toCamelCase(categoryResult.rows)[0];
    } catch (error) {
      // Rollback transaction in case of error
      await pool.query('ROLLBACK');
      console.error('Transaction rolled back due to error:', error);
      throw error;
    }
  }


  // static async update(categoryId, category_name, category_image, number_of_products, key) {
  //   const { rows } = await pool.query(
  //     "UPDATE Categories SET category_name = $1, category_image = $2, number_of_products = $3, key = $4 WHERE category_id = $5 RETURNING *;",
  //     [category_name, category_image, number_of_products, key, categoryId]
  //   );

  //   return toCamelCase(rows)[0];
  // }

  static async update(categoryId, category_name, category_image, number_of_products, key) {
    try {
      // Start transaction
      await pool.query('BEGIN');

      // First, update the categories table
      const categoryResult = await pool.query(
        `UPDATE categories 
         SET category_name = $1, category_image = $2, number_of_products = $3, key = $4 
         WHERE category_id = $5 
         RETURNING *;`,
        [category_name, category_image, number_of_products, key, categoryId]
      );

      // Extract media_id from the updated category
      const media_id = categoryResult.rows[0].media_id;

      // Update the media table with the new category_image
      const mediaResult = await pool.query(
        `UPDATE media 
         SET url = $1 
         WHERE media_id = $2 
         RETURNING *;`,
        [category_image, media_id]
      );

      // Commit transaction
      await pool.query('COMMIT');

      // Return the updated category row
      return toCamelCase(categoryResult.rows)[0];
    } catch (error) {
      // Rollback transaction in case of error
      await pool.query('ROLLBACK');
      console.error('Transaction rolled back due to error:', error);
      throw error;
    }
  }

  // static async delete(category_id) {
  //   const { rows } = await pool.query(
  //     "DELETE FROM Categories WHERE category_id = $1 RETURNING *;",
  //     [category_id]
  //   );
  //   return toCamelCase(rows)[0];
  // }

  static async delete(category_id) {
    try {
      // Start transaction
      await pool.query('BEGIN');

      // Get the media_id associated with the category_id
      const { rows: categoryRows } = await pool.query(
        "SELECT media_id FROM categories WHERE category_id = $1;",
        [category_id]
      );

      if (categoryRows.length === 0) {
        await pool.query('ROLLBACK');
        return null; // No category found with the given id
      }

      const media_id = categoryRows[0].media_id;

      // Delete the category
      const { rows: deletedCategoryRows } = await pool.query(
        "DELETE FROM categories WHERE category_id = $1 RETURNING *;",
        [category_id]
      );

      // Delete the media
      await pool.query(
        "DELETE FROM media WHERE media_id = $1;",
        [media_id]
      );

      // Commit transaction
      await pool.query('COMMIT');

      return toCamelCase(deletedCategoryRows)[0];
    } catch (error) {
      // Rollback transaction in case of error
      await pool.query('ROLLBACK');
      console.error('Transaction rolled back due to error:', error);
      throw error;
    }
  }

}

module.exports = CategoriesRepo;
