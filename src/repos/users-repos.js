const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");
const bcrypt = require("bcrypt");

// represents a repository for interacting with a PostgreSQL database table named "Users."

class UserRepo {
  static async find() {
    const { rows } = await pool.query("SELECT * FROM Users;");

    return toCamelCase(rows);
  }

  static async findById(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM Users WHERE user_id = $1;
      `,
      [user_id]
    );

    return toCamelCase(rows)[0];
  }

  // ###

  static async findByIdPassword(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM Authentication WHERE user_id = $1;
      `,
      [user_id]
    );

    return toCamelCase(rows)[0];
  }

  // ### works

  static async insert(username, email, full_name, profile_picture_url) {
    const { rows } = await pool.query(
      "INSERT INTO Users (username, email, full_name, profile_picture_url) VALUES ($1, $2, $3, $4) RETURNING * ;",
      [username, email, full_name, profile_picture_url]
    );

    return toCamelCase(rows)[0];
  }

  static async update(
    user_id,
    username,
    email,
    full_name,
    profile_picture_url,
    role
  ) {
    const { rows } = await pool.query(
      "UPDATE Users SET username = $2, email = $3, full_name = $4, profile_picture_url = $5, role = $6 WHERE user_id = $1 RETURNING *;",
      [user_id, username, email, full_name, profile_picture_url, role]
    );

    return toCamelCase(rows)[0];
  }

  static async updatePassword(user_id, newPassword) {
    try {
      const password_hash = await bcrypt.hash(newPassword, 10);
      console.log("line:88", password_hash);
  
      const { rows } = await pool.query(
        "UPDATE Authentication SET password_hash = $2 WHERE user_id = $1 RETURNING *;",
        [user_id, password_hash]
      );
  
      return toCamelCase(rows)[0];
    } catch (error) {
      // Handle errors here
      console.error("Error changing the password:", error);
      throw error; // Rethrow the error for the calling code to handle
    }
  }

  // ### - Test

  static async delete(user_id) {
    // Delete references from the "notificationpreference" table
    const notificationpreferenceDeleteQuery =
      "DELETE FROM NotificationPreferences WHERE user_id = $1 RETURNING *;";
    const notificationpreferenceResult = await pool.query(
      notificationpreferenceDeleteQuery,
      [user_id]
    );
    const deletednotificationpreferenceUser = toCamelCase(
      notificationpreferenceResult.rows
    )[0];

    // Delete references from the "userpreference" table
    const userpreferencesDeleteQuery =
      "DELETE FROM userpreferences WHERE user_id = $1 RETURNING *;";
    const userpreferencesResult = await pool.query(userpreferencesDeleteQuery, [
      user_id,
    ]);
    const deleteduserpreferencesUser = toCamelCase(
      userpreferencesResult.rows
    )[0];

    // Delete references from the "userprofile" table
    const userprofileDeleteQuery =
      "DELETE FROM userprofile WHERE user_id = $1 RETURNING *;";
    const userprofileResult = await pool.query(userprofileDeleteQuery, [
      user_id,
    ]);
    const deleteduserprofileUser = toCamelCase(userprofileResult.rows)[0];

    // Delete references from the "authentication" table
    const authenticationDeleteQuery =
      "DELETE FROM authentication WHERE user_id = $1 RETURNING *;";
    const authenticationResult = await pool.query(authenticationDeleteQuery, [
      user_id,
    ]);
    const deletedauthenticationUser = toCamelCase(authenticationResult.rows)[0];

    // Delete references from the "accountstatus" table
    const accountStatusDeleteQuery =
      "DELETE FROM accountstatus WHERE user_id = $1 RETURNING *;";
    const accountStatusResult = await pool.query(accountStatusDeleteQuery, [
      user_id,
    ]);
    const deletedAccountStatusUser = toCamelCase(accountStatusResult.rows)[0];

    // Delete references from the "contactinformation" table
    const contactInfoDeleteQuery =
      "DELETE FROM contactinformation WHERE user_id = $1 RETURNING *;";
    const contactInfoResult = await pool.query(contactInfoDeleteQuery, [
      user_id,
    ]);
    const deletedContactInfoUser = toCamelCase(contactInfoResult.rows)[0];

    // Delete references from the "Users" table
    const authDeleteQuery = "DELETE FROM Users WHERE user_id = $1 RETURNING *;";
    const authResult = await pool.query(authDeleteQuery, [user_id]);
    const deletedAuthUser = toCamelCase(authResult.rows)[0];

    // You can return the deleted user from the relevant table, or decide on a structure for the response
    return {
      deletedAuthUser,
      deletedAccountStatusUser,
      deletedContactInfoUser,
      deletedauthenticationUser,
      deleteduserprofileUser,
      deleteduserpreferencesUser,
      deletednotificationpreferenceUser,
    };
  }

  // ### - Test End
}

module.exports = UserRepo;
