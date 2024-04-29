const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

class AssetsRepo {
  static async find() {
    const assetsPool = await pool.connectAssets();
    try {
      const { rows } = await assetsPool.query("SELECT * FROM Assets;");
      return toCamelCase(rows);
    } finally {
      // No need to release, as it's automatically handled by the pool
    }
  }

  static async findById(id) {
    const assetsPool = await pool.connectAssets();
    try {
      const { rows } = await assetsPool.query(
        "SELECT * FROM Assets WHERE id = $1;",
        [id]
      );
      return toCamelCase(rows)[0];
    } finally {
      // No need to release, as it's automatically handled by the pool
    }
  }

  static async insert(username, bio) {
    const assetsPool = await pool.connectAssets();
    try {
      const { rows } = await assetsPool.query(
        "INSERT INTO Assets (username, bio) VALUES ($1, $2) RETURNING * ;",
        [username, bio]
      );
      return toCamelCase(rows)[0];
    } finally {
      // No need to release, as it's automatically handled by the pool
    }
  }

  static async update(id, username, bio) {
    const assetsPool = await pool.connectAssets();
    try {
      const { rows } = await assetsPool.query(
        "UPDATE Assets SET username = $1, bio = $2 WHERE id = $3 RETURNING *;",
        [username, bio, id]
      );
      return toCamelCase(rows)[0];
    } finally {
      // No need to release, as it's automatically handled by the pool
    }
  }

  static async delete(id) {
    const assetsPool = await pool.connectAssets();
    try {
      const { rows } = await assetsPool.query(
        "DELETE FROM Assets WHERE id = $1 RETURNING *;",
        [id]
      );
      return toCamelCase(rows)[0];
    } finally {
      // No need to release, as it's automatically handled by the pool
    }
  }
}

module.exports = AssetsRepo;
