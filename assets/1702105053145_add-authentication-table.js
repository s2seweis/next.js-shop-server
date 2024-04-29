/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE Authentication (
        auth_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        password_hash VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255)
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE Authentication;
  `);
};
