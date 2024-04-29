/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE ContactInformation (
        contact_id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL REFERENCES Users(user_id),
        email VARCHAR(255) UNIQUE,
        phone_number VARCHAR(20),
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        postal_code VARCHAR(20),
        country VARCHAR(255)
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE ContactInformation;
  `);
};
