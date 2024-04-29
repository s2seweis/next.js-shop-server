/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE NotificationPreferences (
        notification_id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL REFERENCES Users(user_id),
        email_notifications BOOLEAN,
        push_notifications BOOLEAN,
        sms_notifications BOOLEAN,
        in_app_notifications BOOLEAN
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE NotificationPreferences;
  `);
};
