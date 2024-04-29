-- ### Practise Querries


-- ### Create Cities Table:

CREATE TABLE cities (
	name VARCHAR(50), 
  country VARCHAR(50),
  population INTEGER,
  area INTEGER
);

-- ### Add Rows to the table:

INSERT INTO cities (name, country, population, area)
VALUES ('Tokyo', 'Japan', 38505000, 8223);

INSERT INTO cities (name, country, population, area)
VALUES 
    ('Delhi', 'India', 28125000, 2240),
  ('Shanghai', 'China', 22125000, 4015),
  ('Berlin', 'Germany', 1200000, 1800),
  ('Sao Paulo', 'Brazil', 20935000, 3043);

  SELECT name, population /area AS populataion_density
  FROM 
  cities
  WHERE
  population / area > 6000;

-- ### Retrieve Data from the Table:

-- Retrieve all columns from the cities table:
SELECT * FROM cities; 

-- More to select values with math operators:
SELECT name || country FROM cities;

SELECT name || ', ' || country FROM cities;

SELECT name || ', ' || country AS location FROM cities;

SELECT CONCAT(name, country) AS location FROM cities;

SELECT CONCAT(name, ', ', country) AS location FROM cities;

SELECT CONCAT(UPPER(name), ', ', UPPER(country)) AS location FROM cities;

SELECT UPPER(CONCAT(name, ', ', country)) AS location FROM cities;

--   ### MORE EXAMPLES FOR SELECT DATA FROM TABLES

SELECT name, area FROM cities WHERE area > 4000;

SELECT name, area FROM cities WHERE area BETWEEN 2000 AND 5000;

-- ### - Doing a compound check, first check for the cities not in that list and after cheking for cities that have a name equal 'Delhi'.
SELECT name, area FROM cities WHERE area NOT IN (3043, 8223) AND name = 'Delphi'; 

-- ### PHONES TABLE

INSERT INTO phones (name, manufacturer, price, units_sold)
VALUES 
    ('Samsung A40', 'Samsung', 299, 3000),
  ('Moto G54', 'Motorola', 249, 4000),
  ('IPhone 14', 'Apple', 649, 2000),
  ('Realme 11Pro', 'Realme', 199, 6000);
  
  CREATE TABLE phones (
  	name VARCHAR(50), 
    manufacturer VARCHAR(50),
    price INTEGER,
    units_sold INTEGER
  );
  
  SELECT * FROM phones; 
  
  SELECT name, manufacturer FROM phones WHERE manufacturer IN ('Apple', 'Samsung'); 

  -- or

  SELECT name, manufacturer 
  FROM phones 
  WHERE manufacturer = 'Apple' OR manufacturer = 'Samsung';

  SELECT name, price * units_sold AS total_revenue FROM phones WHERE price * units_sold > 1000000;

  -- ### Updating Rows

  UPDATE cities SET population = 39505000 WHERE name = 'Tokyo'

  UPDATE phones SET units_sold = 8543 WHERE name = 'N8';

  -- ### Delete Rows
  DELETE FROM cities WHERE name = 'Tokyo';

  DELETE FROM phones WHERE manufacturer = 'Samsung';

  SELECT * FROM phones;




