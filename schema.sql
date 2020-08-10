-- Resets database and tables
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INT auto_increment PRIMARY KEY,
    name VARCHAR(30)
);

DROP TABLE IF EXISTS role;
CREATE TABLE role (
    id INT auto_increment PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10,4),
    department_id INT(10)
);

DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id INT auto_increment PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT(10),
    manager_id INT(10)
);