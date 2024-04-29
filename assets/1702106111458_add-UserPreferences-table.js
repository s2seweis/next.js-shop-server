/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE UserPreferences (
        preferences_id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL REFERENCES Users(user_id),
        theme VARCHAR(50),
        language VARCHAR(50),
        receive_email_notifications BOOLEAN,
        show_online_status BOOLEAN
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE UserPreferences;
  `);
};
