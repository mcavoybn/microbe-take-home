-- use mysql;
-- update user set authentication_string=password(''), plugin='mysql_native_password' where user='root';

CREATE DATABASE IF NOT EXISTS address_book;
USE address_book;

CREATE TABLE employee (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  email VARCHAR(100),
  phoneNumber VARCHAR(15),
  companyRole VARCHAR(50)
);

UPDATE address SET line1 = "foobar", line2 = "foobaz" WHERE address.id = 1;

CREATE TABLE address (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,  
  line1 VARCHAR(100) NOT NULL,
  line2 VARCHAR(100) NOT NULL,
  zip VARCHAR(5) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR (25) NOT NULL,
  employeeId INTEGER NOT NULL,
  
  FOREIGN KEY (employeeId) REFERENCES employee (id)
);