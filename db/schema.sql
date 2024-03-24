DROP DATABASE IF EXISTS employeeDB

CREATE DATABASE employeeDB

USE employeeDB

/*  create department table making id PRIMARY key */
CREATE TABLE departments (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    
    );

/* create roles table */
CREATE TABLE roles (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (12.2)
    department_id INT(30) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
    
);
/*create employees table */

CREATE TABLE employees (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT Null,
    role_id INT (30) NOT NULL,
    manager_id INT (30),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);
