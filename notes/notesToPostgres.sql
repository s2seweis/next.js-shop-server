-- ### Important Keywords:

1.	->SELECT: Used to retrieve data from one or more tables.

2.	->FROM: Specifies the table from which to retrieve the data in a SELECT statement.

*= give all columns from the table

SELECT * FROM cities; 
=> retrieve all cities from the table
SELECT name, country FROM cities; 
=> retrieve only name and country from the table

3.	->WHERE: Filters the rows returned by a query based on a specified condition.

4.	->INSERT: Adds new rows to a table.

5.	->UPDATE: Modifies existing data in a table.

6.	->DELETE: Removes rows from a table based on a specified condition.

7.	->CREATE: Used to create new tables, views, indexes, and other database objects.

8.	ALTER: Modifies an existing database object, such as a table structure.

9.	->DROP: Deletes an existing table, view, index, or other database object.

10.	INDEX: Creates an index on a table, which enhances search performance.

11.	PRIMARY KEY: Defines a unique identifier for a record in a table.

12.	FOREIGN KEY: Establishes a link between data in two tables, enforcing referential integrity.

13.	UNIQUE: Ensures that all values in a column are unique.

14.	->JOIN: Combines rows from two or more tables based on a related column between them.
    -> The ON keyword is used in the JOIN clause to specify the condition for joining tables;
    -> . When you perform a JOIN operation, you use the ON keyword to define the relationship between the columns in the tables being joined.

15.	->INNER JOIN: Retrieves records that have matching values in both tables being joined.

16.	LEFT JOIN (or LEFT OUTER JOIN): Retrieves all records from the left table and the matched records from the right table.

17.	RIGHT JOIN (or RIGHT OUTER JOIN): Retrieves all records from the right table and the matched records from the left table.

18.	FULL JOIN (or FULL OUTER JOIN): Retrieves all records when there is a match in one of the tables.

19.	GROUP BY: Groups rows that have the same values into summary rows.

20.	HAVING: Filters the results of a GROUP BY clause based on a specified condition.

21.	ORDER BY: Sorts the result set in ascending or descending order.

22.	->AGGREGATE FUNCTIONS: Functions like COUNT, SUM, AVG, MAX, MIN, etc., used to perform calculations on a set of values.

23.	TRANSACTION: A sequence of one or more SQL statements treated as a unit, ensuring data integrity.

24.	COMMIT: Saves all changes made during the current transaction.

25.	ROLLBACK: Undoes all changes made during the current transaction.

26.	VACUUM: Reclaims storage occupied by dead tuples and free space.

27.	GRANT: Assigns privileges to database objects, allowing users to perform specific actions.

28.	REVOKE: Removes previously granted privileges from a user or a role.

Identifier = Tell the database what thing we want to act on. Always written out in lower case letters. 

Keywords = Tell the database that we want to do something. Always written out in capital letters.

Example: (50 limits the character length)
###
CREATE TABLE cities (
Name VARCHAR(50),
country VARCHAR(50),
population INTEGER, 
area INTEGER)
###

VARCHAR = variable character / it means that the column can store up to "n" characters. The number "n" represents the maximum length of the string that can be stored in that column.

CHAR = Unlike VARCHAR, where the length of the string can vary and only the actual characters take up space, CHAR columns always have a fixed length.

-- ### Math Operator for SQL Postgres

Addition: +
Example: SELECT column1 + column2 FROM table;

Subtraction: -
Example: SELECT column1 - column2 FROM table;

Multiplication: *
Example: SELECT column1 * column2 FROM table;

Division: /
Example: SELECT column1 / column2 FROM table;

Modulus (Remainder): %
Example: SELECT column1 % column2 FROM table;

Exponentiation: ^ or **
Example: SELECT column1 ^ column2 FROM table;

Square Root: ||/ or SQRT()
Example: SELECT SQRT(column) FROM table;

Absolute Value: ABS()
Example: SELECT ABS(column) FROM table;

Ceiling (Smallest Integer Greater Than or Equal To): CEIL()
Example: SELECT CEIL(column) FROM table;

Floor (Largest Integer Less Than or Equal To): FLOOR()
Example: SELECT FLOOR(column) FROM table;

Round: ROUND()
Example: SELECT ROUND(column, decimal_places) FROM table;

-- Remember, these operators can be used in combination within more complex expressions in your SQL queries to perform various mathematical calculations.

-- JOINS statements are quite challenging !!!
SELECT * FROM photos
JOIN users ON users.id = photos.user_id;






