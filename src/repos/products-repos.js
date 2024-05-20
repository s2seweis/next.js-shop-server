const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

// represents a repository for interacting with a PostgreSQL database table named "Products."

class ProductsRepo {
  static async find() {
    const { rows } = await pool.query("SELECT * FROM Products;");

    return toCamelCase(rows);
  }

  static async findById(productid) {
    const { rows } = await pool.query(
      `
      SELECT * FROM Products WHERE productid = $1;
      `,
      [productid]
    );

    return toCamelCase(rows)[0];
  }

  static async insert(productname, price, category) {
    const { rows } = await pool.query(
      "INSERT INTO Products (productname, price, category) VALUES ($1, $2, $3) RETURNING * ;",
      [productname, price, category]
    );

    return toCamelCase(rows)[0];
  }

  static async update(productname, price, category, id) {
    const { rows } = await pool.query(
      "UPDATE Products SET productname = $1, price = $2, category = $3 WHERE Productid = $4 RETURNING *;",
      [productname, price, category, id]
    );

    return toCamelCase(rows)[0];
  }

  static async delete(productid) {
    const { rows } = await pool.query(
      "DELETE FROM Products WHERE productid = $1 RETURNING *;",
      [productid]
    );
    return toCamelCase(rows)[0];
  }
}

module.exports = ProductsRepo;
