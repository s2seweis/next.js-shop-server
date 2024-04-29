const { Pool } = require("pg");

class DatabasePool {
  _pool = null;

  connect(options) {
    this._pool = new Pool(options);
    return this._pool.query("SELECT 1 + 1;");
  }

  connectAssets(options) {
    const assetsOptions = {
      ...options,
      database: "Assets", // Specify the "Assets" database
    };

    const assetsPool = new Pool(assetsOptions);

    // Attach the query method to assetsPool to make it compatible with the rest of the code
    assetsPool.query = assetsPool.query.bind(assetsPool);

    return assetsPool;
  }

  close() {
    return this._pool.end();
  }

  query(sql, params) {
    return this._pool.query(sql, params);
  }
}

module.exports = new DatabasePool();
