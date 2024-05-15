const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

// Represents a repository for interacting with a PostgreSQL database table named "Categories."

class CategoriesRepo {
  static async findAll() {
    const { rows } = await pool.query("SELECT * FROM Categories;");
    return toCamelCase(rows);
  }

  static async findById(categoryId) {
    console.log("categoryId");
    const { rows } = await pool.query(
      `
      SELECT * FROM Categories WHERE categoryid = $1;
      `,
      [categoryId]
    );

    return toCamelCase(rows)[0];
  }

  static async insert(category_name, category_image, number_of_products) {
    const { rows } = await pool.query(
      "INSERT INTO Categories (category_name, category_image, number_of_products) VALUES ($1, $2, $3) RETURNING *;",
      [category_name, category_image, number_of_products]
    );

    return toCamelCase(rows)[0];
  }

  static async update(categoryId, category_name, category_image, number_of_products) {
    const { rows } = await pool.query(
      "UPDATE Categories SET category_name = $1, category_image = $2, number_of_products = $3 WHERE category_id = $4 RETURNING *;",
      [category_name, category_image, number_of_products, categoryId]
    );

    return toCamelCase(rows)[0];
  }

  static async delete(category_id) {
    const { rows } = await pool.query(
      "DELETE FROM Categories WHERE category_id = $1 RETURNING *;",
      [category_id]
    );
    return toCamelCase(rows)[0];
  }
}

module.exports = CategoriesRepo;
