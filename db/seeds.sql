/* Seed employees with id, first_name, last_name, role_id, and manager_id*/

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, 1),
(3, 'Michael', 'Johnson', 3, 2),
(4, 'Emily', 'Williams', 4, 2),
(5, 'David', 'Brown', 5, 1),
(6, 'Jessica', 'Jones', 1, 4),
(7, 'Christopher', 'Davis', 2, 5),
(8, 'Amanda', 'Miller', 3, 4),
(9, 'Matthew', 'Wilson', 4, NULL),
(10, 'Ashley', 'Taylor', 5, 3);

/* Seed roles with id, title, salary and dept ID */
INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Sales Representative', 50000, 1),
(2, 'Marketing Specialist', 55000, 2),
(3, 'Financial Analyst', 60000, 3),
(4, 'HR Coordinator', 52000, 4),
(5, 'Software Engineer', 70000, 5);

/* seed departments with id and department name */
INSERT INTO department (id, name) VALUES
(1, 'Sales'),
(2, 'Marketing'),
(3, 'Finance'),
(4, 'Human Resources'),
(5, 'Engineering');