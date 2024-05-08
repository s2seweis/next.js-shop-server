const pool = require("../pool/pool");
const toCamelCase = require("./utils/to-camel-case");

class NotificationRepo {
  static async addNotification(title, body, messageId) {
    const { rows } = await pool.query(
      "INSERT INTO Notifications (title, body, messageId) VALUES ($1, $2, $3) RETURNING *;",
      [title, body, messageId]
    );

    return toCamelCase(rows)[0];
  }

  static async getAllNotifications() {
    const { rows } = await pool.query(
      "SELECT * FROM Notifications;"
    );

    return toCamelCase(rows);
  }

  static async markNotificationsAsRead() {
    // Assuming you have a query to update the 'read' property of notifications
    await pool.query(
      "UPDATE Notifications SET read = true;"
    );
  }

  // Add other methods as needed

}

module.exports = NotificationRepo;
