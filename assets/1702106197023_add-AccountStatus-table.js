/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE AccountStatus (
    status_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES Users(user_id),
    is_active BOOLEAN NOT NULL,
    is_suspended BOOLEAN NOT NULL,
    is_deactivated BOOLEAN NOT NULL,
    last_login TIMESTAMP
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE AccountStatus;
  `);
};
