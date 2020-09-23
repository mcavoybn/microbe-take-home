-- Node.js requires that you use the older v5/v6 authentication method in mysql.
-- This snippet will convert the authentication method of the root user to the legacy version in case
-- you set up your mysql server with the v8 authentication scheme and are unable to connect.
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