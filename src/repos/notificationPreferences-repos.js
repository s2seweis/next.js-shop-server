const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

class NotificationPreferencesRepo {
  // ### Get
  static async find() {
    const { rows } = await pool.query("SELECT * FROM NotificationPreferences;");
    return toCamelCase(rows);
  }

  //   ### Get by ID
  static async findById(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM NotificationPreferences WHERE user_id = $1;
      `,
      [user_id]
    );

    return toCamelCase(rows)[0];
  }

  static async insert(
    user_id,
    email_notifications,
    push_notifications,
    sms_notifications,
    in_app_notifications /* Other preferences-related fields */
  ) {
    const { rows } = await pool.query(
      "INSERT INTO NotificationPreferences (user_id, email_notifications, push_notifications, sms_notifications, in_app_notifications /* Other preferences-related fields */) VALUES ($1, $2, $3, $4, $5 /* Other placeholders */) RETURNING * ;",
      [
        user_id,
        email_notifications,
        push_notifications,
        sms_notifications,
        in_app_notifications /* Add other parameter values here */,
      ]
    );

    return toCamelCase(rows)[0];
  }

  static async update(
    user_id,
    email_notifications,
    push_notifications,
    sms_notifications,
    in_app_notifications /* Add other parameters based on the table structure */
  ) {
    const { rows } = await pool.query(
      "UPDATE NotificationPreferences SET email_notifications = $2, push_notifications = $3, sms_notifications = $4, in_app_notifications = $5 /* Add other assignments based on the table structure */ WHERE user_id = $1 RETURNING *;",
      [
        user_id,
        email_notifications,
        push_notifications,
        sms_notifications,
        in_app_notifications /* Add other parameter values here */,
      ]
    );

    return toCamelCase(rows)[0];
  }

  //   ### Delete - works
  static async delete(user_id) {
    const { rows } = await pool.query(
      "DELETE FROM NotificationPreferences WHERE user_id = $1 RETURNING *;",
      [user_id]
    );
    return toCamelCase(rows)[0];
  }
}

module.exports = NotificationPreferencesRepo;
