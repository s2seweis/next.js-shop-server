const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

// Represents a repository for interacting with a PostgreSQL database table named "Categories."

class CategoriesRepo {
  static async findAll() {
    const { rows } = await pool.query("SELECT * FROM Categories;");
    return toCamelCase(rows);
  }

  static async findById(categoryId) {
    const { rows } = await pool.query(
      `
      SELECT * FROM Categories WHERE categoryid = $1;
      `,
      [categoryId]
    );

    return toCamelCase(rows)[0];
  }

  static async insert(category_name, category_image, number_of_products, key) {
    const { rows } = await pool.query(
      "INSERT INTO Categories (category_name, category_image, number_of_products, key) VALUES ($1, $2, $3, $4) RETURNING *;",
      [category_name, category_image, number_of_products, key]
    );

    return toCamelCase(rows)[0];
  }

  // static async update(category_id, category_name, category_image, number_of_products, key) {
  //   console.log("line:10",category_id );
  //   console.log("line:11",category_name );
  //   console.log("line:12",category_image);
  //   console.log("line:13",number_of_products);
  //   console.log("line:14", key);
  //   const { rows } = await pool.query(
  //     "UPDATE Categories SET category_name = $1, category_image = $2, number_of_products = $3, key = $4 WHERE category_id = $5 RETURNING *;",
  //     [category_name, category_image, number_of_products, category_id, key]
  //   );

  //   return toCamelCase(rows)[0];
  // }

  static async update(categoryId, category_name, category_image, number_of_products, key) {
    const { rows } = await pool.query(
      "UPDATE Categories SET category_name = $1, category_image = $2, number_of_products = $3, key = $4 WHERE category_id = $5 RETURNING *;",
      [category_name, category_image, number_of_products, key, categoryId]
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
