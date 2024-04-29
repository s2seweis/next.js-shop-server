const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

// represents a repository for interacting with a PostgreSQL database table named "Products."

class ProductsRepo {
  static async find() {
    const { rows } = await pool.query("SELECT * FROM Products;");

    return toCamelCase(rows);
  }

  static async findById(productid) {
    console.log("productid");
    const { rows } = await pool.query(
      `
      SELECT * FROM Products WHERE productid = $1;
      `,
      [productid]
    );

    return toCamelCase(rows)[0];
  }

  static async insert(ProductName, Price, Category) {
    const { rows } = await pool.query(
      "INSERT INTO Products (ProductName, Price, Category) VALUES ($1, $2, $3) RETURNING * ;",
      [ProductName, Price, Category]
    );

    return toCamelCase(rows)[0];
  }

  static async update(productname, price, category, id) {
    const { rows } = await pool.query(
      "UPDATE Products SET ProductName = $1, Price = $2, category = $3 WHERE Productid = $4 RETURNING *;",
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
