const pool = require("../pool/pool");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require("./utils/email/sendEmail");
const { log } = require("handlebars");

class ResetRepo {

   // ###
   static async requestPasswordReset(email) {
    console.log("line:300", email);

    // Find the user by email
    const userQuery = `
      SELECT * FROM users
      WHERE email = $1;
    `;

    const { rows: [user] } = await pool.query(userQuery, [email]);
    console.log("line:400", user);

    // If user not found
    if (!user) {
      throw new Error('Email does not exist');
    }

    // Find existing token for the user and delete it
    // const deleteTokenQuery = `
    //   DELETE FROM tokens
    //   WHERE user_id = $1;
    // `;
    // await pool.query(deleteTokenQuery, [user.id]);

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the reset token
    const hashedToken = await bcrypt.hash(resetToken, 10); // Adjust the salt rounds as needed

    // Save the token in the database
    // const saveTokenQuery = `
    //   INSERT INTO tokens (user_id, token, created_at)
    //   VALUES ($1, $2, NOW());
    // `;
    // await pool.query(saveTokenQuery, [user.id, hashedToken]);

    // Construct the reset link
    const resetLink = `${process.env.CLIENT_URL}/${resetToken}/${user.user_id}`;
    console.log("line:500", resetLink);

    // Send email to the user
    sendEmail(
      user.email,
      "Password Reset Request",
      {
        name: user.name,
        link: resetLink,
      },
      "./template/requestResetPassword.handlebars"
    );

    return { link: resetLink };
  }

  static async resetPassword(userId, token, newPassword) {
    // Find the reset token for the user
    const query = `
      SELECT * FROM tokens
      WHERE user_id = $1
      AND token = $2;
    `;
    const { rows: [passwordResetToken] } = await pool.query(query, [userId, token]);

    // If token not found or token doesn't match
    if (!passwordResetToken || !(await bcrypt.compare(token, passwordResetToken.token))) {
      throw new Error('Invalid or expired password reset token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT));

    // Update the user's password
    const updateQuery = `
      UPDATE users
      SET password = $1
      WHERE id = $2;
    `;
    await pool.query(updateQuery, [hashedPassword, userId]);

    // Delete the reset token from database
    const deleteQuery = `
      DELETE FROM tokens
      WHERE user_id = $1;
    `;
    await pool.query(deleteQuery, [userId]);

    // Retrieve updated user information
    const userQuery = `
      SELECT * FROM users
      WHERE id = $1;
    `;
    const { rows: [user] } = await pool.query(userQuery, [userId]);

    // Send email to the user
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.name,
      },
      "./utils/email/template/resetPassword.handlebars"
    );

    return user;
  }
}

module.exports = ResetRepo;
