//psuedo coding
// import required modules
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table") //https://www.npmjs.com/package/console.table?activeTab=versions

// start connection to MySql DB
const connection = mysql.createConnection(
  {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'test123',
    database: 'employeeDB'
  },
);
connection.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to the employeeDB database.`)

  start();
});

//various functions
// Function to Start inquirer to trigger functions based on choices
function start() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "start",
        choices: [
          "View all Employees",
          "Add Employee",
          "Remove Employee",
          "View all Departments",
          "Add Department",
          "View all Roles",
          "Add Roles",
          "Update Employee Role",
          "Exit"
        ]
      }
    ])
    .then(function (res) {
      switch (res.start) {

        case "Add Employee":
          addEmployee();
          break;

        case "View all Employees":
          viewAllEmployees();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Add Department":
          addDept();
          break;

        case "View all Departments":
          viewAllDept();
          break;

        case "Add Roles":
          addRole();
          break;

        case "View all Roles":
          viewAllRoles();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    })
}

// function to view all employees
function viewAllEmployees() {

  connection.query("SELECT employees.first_name, employees.last_name, roles.title AS \"roles\", managers.first_name AS \"manager\" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN employees managers ON employees.manager_id = managers.id GROUP BY employees.id",
    function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      start();
    });
}

//function to add employess (also using inquirer)
function addEmployee() {
  console.log("Inserting a new employee.\n");

  // Query to retrieve all manager names
  connection.query(
      "SELECT CONCAT(first_name, ' ', last_name) AS manager_name FROM employees WHERE manager_id IS NULL",
      function (err, managerResults) {
          if (err) throw err;

          // Extract manager names from query results
          const managerNames = managerResults.map(manager => manager.manager_name);

          // Query to retrieve all roles
          connection.query("SELECT id, title FROM roles", function (err, roles) {
              if (err) throw err;

              // Extract role titles and IDs from query results
              const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

              inquirer
                  .prompt([
                      {
                          type: "input",
                          message: "First Name?",
                          name: "first_name",
                      },
                      {
                          type: "input",
                          message: "Last Name?",
                          name: "last_name"
                      },
                      {
                          type: "list",
                          message: "What is the employee's role?",
                          name: "role_id",
                          choices: roleChoices // Use role titles as choices
                      },
                      {
                          type: "list",
                          message: "Who is their manager?",
                          name: "manager_name",
                          choices: managerNames
                      }
                  ])
                  .then(function (res) {
                      // Look up manager's ID based on their name
                      connection.query(
                          "SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?",
                          res.manager_name,
                          function (err, managerRes) {
                              if (err) throw err;

                              // Set manager_id based on the query result
                              if (managerRes.length > 0) {
                                  res.manager_id = managerRes[0].id;
                              } else {
                                  console.log("Error: Manager not found.");
                                  return;
                              }

                              // Remove manager_name from res object
                              delete res.manager_name;

                              // Insert new employee into the database
                              const query = connection.query(
                                  "INSERT INTO employees SET ?",
                                  res,
                                  function (err, res) {
                                      if (err) throw err;
                                      console.log("Employee added!\n");
                                      viewAllEmployees();
                                      start();
                                  }
                              );
                          }
                      );
                  });
          });
      }
  );
}


//Function to remove 
function removeEmployee() {
  let employeeList = [];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees", (err, res) => {
      for (let i = 0; i < res.length; i++) {
        employeeList.push(res[i].first_name + " " + res[i].last_name);
      }
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to delete?",
            name: "employee",
            choices: employeeList
          },
        ])
        .then(function (res) {
          const query = connection.query(
            `DELETE FROM employees WHERE concat(first_name, ' ' ,last_name) = '${res.employee}'`,
            function (err, res) {
              if (err) throw err;
              console.log("Employee deleted!\n");
              start()

            });
        });
    }
  );
};

// function to View All departments
function viewAllDept() {
  connection.query("SELECT * FROM departments", function (err, res) {
    console.table(res);
    start();
  })
}

// function to add a department
function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "What Department would you like to add?"
      }
    ])
    .then(function (res) {
      console.log(res);
      const query = connection.query(
        "INSERT INTO departments SET ?", 
        {
          name: res.deptName
        },
        function (err, res) {
          if (err) throw err;
          console.log("Department added!\n");
          viewAllDept(); // Refresh the list of departments
        }
      )
    })
}

//function to View Roles
function viewAllRoles() {
  connection.query("SELECT roles.*, departments.name FROM roles LEFT JOIN departments ON departments.id = roles.department_id", function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
  });
}

//function to add role
function addRole() {
  let departments = [];
  connection.query("SELECT * FROM departments",
      function (err, departmentData) {
          if (err) throw err;
          for (let i = 0; i < departmentData.length; i++) {
              departments.push({ name: departmentData[i].name, value: departmentData[i].id });
          }
          inquirer
              .prompt([
                  {
                      type: "input",
                      name: "title",
                      message: "What role would you like to add?"
                  },
                  {
                      type: "input",
                      name: "salary",
                      message: "What is the salary for the role?"
                  },
                  {
                      type: "list",
                      name: "departmentId",
                      message: "Select the department for the role:",
                      choices: departments
                  }
              ])
              .then(function (answers) {
                  const { title, salary, departmentId } = answers;
                  const query = connection.query(
                      "INSERT INTO roles SET ?",
                      {
                          title: title,
                          salary: salary,
                          department_id: departmentId
                      },
                      function (err, res) {
                          if (err) {
                              console.error("Error adding role:", err);
                              start();
                          } else {
                              console.log("Role added successfully!");
                              viewAllRoles()
                              start();
                          }
                      }
                  );
              })
      })
}


//function to update roles of employee
function updateEmployeeRole() {
  connection.query("SELECT first_name, last_name, id FROM employees",
      function (err, employees) {
          if (err) throw err;

          let employeeChoices = employees.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }));

          // Fetch role names from the roles table
          connection.query("SELECT id, title FROM roles",
              function (err, roles) {
                  if (err) throw err;

                  let roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

                  inquirer
                      .prompt([
                          {
                              type: "list",
                              name: "employeeId",
                              message: "Which employee's role would you like to update?",
                              choices: employeeChoices
                          },
                          {
                              type: "list",
                              name: "roleName",
                              message: "Select the new role for the employee:",
                              choices: roleChoices
                          }
                      ])
                      .then(function (answers) {
                          const { employeeId, roleName } = answers;

                          // Update the employee's role using the selected role name
                          connection.query(
                              "UPDATE employees SET role_id = ? WHERE id = ?",
                              [roleName, employeeId],
                              function (err, result) {
                                  if (err) throw err;
                                  console.log("Employee role updated!\n");
                                  start();
                              }
                          );
                      });
              }
          );
      }
  );
}

