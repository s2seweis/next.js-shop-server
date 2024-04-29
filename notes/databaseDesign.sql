-- ### Database Design

4 Relationships in Databases (relationships between tables are established using keys.)

###

1. One-to-One (1:1) Relationship:

Boats & Captains
Company & CEO
Capitol & country
Student & Desk
Person & Driver´s License

In a one-to-one relationship, one row in a table is related to one and only one row in another table.
Example: A table for employees and a table for employee contact information, where each employee has only one corresponding contact entry.

###

2. One-to-Many (1:N) Relationship: (Photo can have many different comments to it, see Twitter)

# One-to-Many & and Many-to-One depents on the perspective.
A boat can have many crew members but a crew member can have only one boat.
Same with school/students or company/employee.

###

3. Many-to-One (N:1) Relationship: (A comment has one photo)

In a one-to-many relationship, one row in a table can be related to multiple rows in another table.
Example: A table for customers and a table for orders, where one customer can have multiple orders.

In a many-to-one relationship, multiple rows in a table can be related to one row in another table.
Example: A table for orders and a table for customers, where many orders can belong to a single customer.

###

4. Many-to-Many (N:N) Relationship:

In a many-to-many relationship, multiple rows in one table can be related to multiple rows in another table.
Example: A table for students and a table for courses, where students can enroll in multiple courses, and each course can have multiple students.
To establish these relationships, primary keys and foreign keys are used:

Studens = Classes
Tasks = Engineers
Players = Football Matches 
Movies = Actors
Conference Calls = Employees

###

- Primary Key:
A primary key is a unique identifier for a record in a table. It ensures that each row in a table is unique.
Example: EmployeeID in an Employees table.

- Foreign Key:
A foreign key is a field in a table that is used to establish a link between the data in two tables. It refers to the primary key of another table.
Example: EmployeeID in an Orders table, which refers to the EmployeeID primary key in the Employees table.
In PostgreSQL, you can create these relationships using foreign key constraints, ensuring data integrity and enforcing referential integrity rules between related tables.

Practise:
boat_id INTEGER REFERENCES boats(id)

SELECT * FROM crew_members WHERE boat_id = 1;

-- ###

CREATE TABLE photos (
id SERIAL PRIMARY KEY,
url VARCHAR(200),
user_id INTEGER REFERENCES users(id)
);
 
INSERT INTO photos (url, user_id)
VALUES
('http:/one.jpg', 4),
('http:/two.jpg', 1),
('http:/25.jpg', 1),
('http:/36.jpg', 1),
('http:/754.jpg', 2),
('http:/35.jpg', 3),
('http:/256.jpg', 4);

### Recreate

CREATE TABLE photos (
id SERIAL PRIMARY KEY,
url VARCHAR(200),
user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);
 
INSERT INTO photos (url, user_id)
VALUES
('http:/one.jpg', 4),
('http:/754.jpg', 2),
('http:/35.jpg', 3),
('http:/256.jpg', 4);