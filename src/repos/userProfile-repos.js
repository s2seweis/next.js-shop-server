const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

// represents a repository for interacting with a PostgreSQL database table named "UserProfile."

class UserProfileRepo {
  static async find() {
    const { rows } = await pool.query("SELECT * FROM UserProfile;");

    return toCamelCase(rows);
  }

  static async findById(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM UserProfile WHERE user_id = $1;
      `,
      [user_id]
    );

    return toCamelCase(rows)[0];
  }

  // ###

  static async insert(
    user_id,
    bio,
    date_of_birth,
    location,
    website_url,
    profile_picture_url
  ) {
    const { rows } = await pool.query(
      "INSERT INTO UserProfile (user_id, bio, date_of_birth, location, website_url, profile_picture_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ;",
      [user_id, bio, date_of_birth, location, website_url, profile_picture_url]
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
      "UPDATE UserProfile SET bio = $2, date_of_birth = $3, location = $4, website_url = $5, profile_picture_url = $6 WHERE user_id = $1 RETURNING *;",
      [user_id, bio, date_of_birth, location, website_url, profile_picture_url]
    );

    return toCamelCase(rows)[0];
  }

  // ###

  static async delete(user_id) {
    const { rows } = await pool.query(
      "DELETE FROM UserProfile WHERE user_id = $1 RETURNING *;",
      [user_id]
    );
    return toCamelCase(rows)[0];
  }
}

module.exports = UserProfileRepo;
