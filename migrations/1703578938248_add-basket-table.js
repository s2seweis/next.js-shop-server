/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE Basket (
      BasketID SERIAL PRIMARY KEY,
      user_id INT REFERENCES Users(user_id),
      productid INT REFERENCES Products(productid),
      ProductName VARCHAR(255) NOT NULL,
      Price DECIMAL(10, 2) NOT NULL,
      Category VARCHAR(255) NOT NULL,
      Quantity INT NOT NULL
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE Basket;
  `);
};
