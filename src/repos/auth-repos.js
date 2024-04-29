const bcrypt = require("bcrypt");
const pool = require("../pool/pool"); // Import the shared pool
const toCamelCase = require("./utils/to-camel-case");
const jwt = require("jsonwebtoken");

class AuthRepo {
  // works
  async getUserByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT * FROM "users" WHERE email = $1;
      `,
      [email]
    );

    return toCamelCase(rows)[0] || null;
  }
  //  works
  async registerUser({
    username,
    email,
    full_name,
    profile_picture_url,
    password,
  }) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const userInsertQuery = `
        INSERT INTO "users" (username, email, full_name, profile_picture_url)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const userResult = await pool.query(userInsertQuery, [
        username,
        email,
        full_name,
        profile_picture_url,
      ]);

      const authInsertQuery = `
        INSERT INTO "authentication" (user_id, password_hash)
        VALUES ($1, $2)
        RETURNING *;
      `;

      const authResult = await pool.query(authInsertQuery, [
        userResult.rows[0].user_id,
        passwordHash,
      ]);

      return toCamelCase(userResult.rows)[0];
    } catch (error) {
      // Handle errors here
      console.error("Error registering user:", error);
      throw error; // Rethrow the error for the calling code to handle
    }
  }
  async registerUserOAuth({
    username,
    email,
    full_name,
    profile_picture_url,
    role,
    password
  }) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const userInsertQuery = `
      INSERT INTO "users" (username, email, full_name, profile_picture_url, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

      const userResult = await pool.query(userInsertQuery, [
        username,
        email,
        full_name,
        profile_picture_url,
        role
      ]);

      const authInsertQuery = `
      INSERT INTO "authentication" (user_id, password_hash)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const authResult = await pool.query(authInsertQuery, [
      userResult.rows[0].user_id,
      passwordHash,
    ]);

      return toCamelCase(userResult.rows)[0];
    } catch (error) {
      // Handle errors here
      console.error("Error registering user:", error);
      throw error; // Rethrow the error for the calling code to handle
    }
  }

  // now here
  async loginUser({ email, password }) {
    try {
      const user = await this.getUserByEmail(email);
      console.log("line:200", user);
      console.log("line:201", user.username);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const authQuery = `
        SELECT * FROM "authentication" WHERE user_id = $1;
      `;
      console.log("line:4", authQuery);

      const authResult = await pool.query(authQuery, [user.userId]);

      if (authResult.rows.length === 0) {
        throw new Error("Invalid email or password");
      }

      const passwordMatch = await bcrypt.compare(
        password,
        authResult.rows[0].password_hash
      );
      console.log("line:5", passwordMatch);

      if (!passwordMatch) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.sign(
        { user_id: user.userId, email: user.email, auth: "true" },
        "12345678",
        { expiresIn: "1h" }
      );

      console.log("line:6", token);

      const userid = user.userId;
      const role = user.role;
      const name = user.username;
      // const userid='123456';

      return { message: "Login successful", token, userid, role, name };
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  // ### Test 

  async loginUserOauth({ email }) {
    try {
      const user = await this.getUserByEmail(email);
      console.log("line:200", user);
      console.log("line:201", user.username);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const userid = user.userId;

      return { message: "Login successful", userid };
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  // ### Delete
  async delete(user_id) {
    const { rows } = await pool.query(
      "DELETE FROM authentication WHERE user_id = $1 RETURNING *;",
      [user_id]
    );
    return toCamelCase(rows)[0];
  }
}

module.exports = new AuthRepo();
