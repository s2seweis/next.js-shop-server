/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE Products (
      ProductID SERIAL PRIMARY KEY,
      ProductName VARCHAR(255) NOT NULL,
      Price DECIMAL(10, 2) NOT NULL,
      Category VARCHAR(255) NOT NULL
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE Products;
  `);
};
