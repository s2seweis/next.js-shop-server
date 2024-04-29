const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

// represents a repository for interacting with a PostgreSQL database table named "Basket."

class BasketRepo {
  static async find() {
    const { rows } = await pool.query("SELECT * FROM Basket;");

    return toCamelCase(rows);
  }

  static async findById(user_id) {
    const { rows } = await pool.query(
      "SELECT * FROM Basket WHERE user_id = $1;",
      [user_id]
    );

    return toCamelCase(rows);
  }

  static async insert({
    user_id,
    productid,
    productname,
    price,
    category,
    quantity,
  }) {
    const { rows } = await pool.query(
      "INSERT INTO Basket (user_id, productid, productname, price, category, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [user_id, productid, productname, price, category, quantity]
    );

    return toCamelCase(rows)[0];
  }

  static async update(
    user_id,
    bio,
    date_of_birth,
    location,
    website_url,
    profile_picture_url
  ) {
    const { rows } = await pool.query(
      "UPDATE Basket SET bio = $2, date_of_birth = $3, location = $4, website_url = $5, profile_picture_url = $6 WHERE user_id = $1 RETURNING *;",
      [user_id, bio, date_of_birth, location, website_url, profile_picture_url]
    );

    return toCamelCase(rows)[0];
  }

  static async delete(basketItemId) {
    const { rows } = await pool.query(
      "DELETE FROM Basket WHERE basketid = $1 RETURNING *;",
      [basketItemId]
    );
    return toCamelCase(rows)[0];
  }

  static async findByUserAndProduct(userid, productid) {
    const { rows } = await pool.query(
      "SELECT * FROM Basket WHERE user_id = $1 AND productid = $2;",
      [userid, productid]
    );
    return toCamelCase(rows)[0];
  }

  static async updateQuantity(basketItemId, newQuantity) {
    const { rows } = await pool.query(
      "UPDATE Basket SET quantity = $1 WHERE productid = $2 RETURNING *;",
      [newQuantity, basketItemId]
    );
    return toCamelCase(rows)[0];
  }

  static async insert({
    userid,
    productid,
    productname,
    price,
    category,
    quantity,
  }) {
    const { rows } = await pool.query(
      "INSERT INTO Basket (user_id, productid, productname, price, category, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [userid, productid, productname, price, category, quantity]
    );
    return toCamelCase(rows)[0];
  }

}

module.exports = BasketRepo;
