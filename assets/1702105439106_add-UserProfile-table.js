/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE UserProfile (
        profile_id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL REFERENCES users(user_id),
        bio TEXT,
        date_of_birth DATE,
        location VARCHAR(255),
        website_url VARCHAR(255),
        profile_picture_url VARCHAR(255)
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE UserProfile;
  `);
};
