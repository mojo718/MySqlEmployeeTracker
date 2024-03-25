//psuedo coding
// import required modules
const mysql = require("mysql");
const inquirer = require("inquirer");
const conTable = require("console.table") //https://www.npmjs.com/package/console.table?activeTab=versions

// start connection to MySql DB
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'test123',
        database: 'employeeDB'
    },

);
db.connect(function (err) {
    if (err) throw err;
    console.log(`Connected to the employeeDB database.`)
    start();
});



// various functions 
// function for inquirer questions to trigger functions based on choices

function start() {
    inquirer.prompt([
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

// function to view employees
function viewAllEmployees() {

    connection.query("SELECT employees.first_name, employees.last_name, roles.title AS \"role\", managers.first_name AS \"manager\" FROM employees LEFT JOIN role ON employees.role_id = role.id LEFT JOIN employees managers ON employees.manager_id = managers.id GROUP BY employees.id",
        function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.table(res);
            start();
        });
}
// function to add employees
function addEmployee() {
    console.log("Inserting a new employee.\n");
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
                choices: [1, 2, 3]
            },
            {
                type: "input",
                message: "Who is their manager?",
                name: "manager_id"
            }
        ])
        .then(function (res) {
            const query = connection.query(
                "INSERT INTO employee SET ?",
                res,
                function (err, res) {
                    if (err) throw err;
                    console.log("Employee added!\n");

                    start();
                }
            );
        })
}
// function to remove employees
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
                            start();
                        });
                });
        }
    );
};

//function to view departments
function viewAllDept() {
    connection.query("SELECT * FROM departments", function (err, res) {
        console.table(res);
        start();
    })
}
// function to add departments
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
                "INSERT INTO department SET ?",
                {
                    name: res.deptName
                },
                function (err, res) {
                    connection.query("SELECT * FROM department", function (err, res) {
                        console.table(res);
                        start();
                    })
                }
            )
        })
    }



//function to view roles
function viewAllRoles() {
    connection.query("SELECT roles.*, departments.name FROM role LEFT JOIN departments ON departments.id = roles.department_id", function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
    )
  }
  
// function update roles
function updateEmployeeRole() {
    connection.query("SELECT first_name, last_name, id FROM employees",
      function (err, res) {
        // for (let i=0; i <res.length; i++){
        //   employees.push(res[i].first_name + " " + res[i].last_name);
        // }
        let employees = res.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }))
  
        inquirer
          .prompt([
            {
              type: "list",
              name: "employeeName",
              message: "Which employee's role would you like to update?",
              choices: employees
            },
            {
              type: "input",
              name: "role",
              message: "What is your new role?"
            }
          ])
          .then(function (res) {
            connection.query(`UPDATE employees SET roles_id = ${res.role} WHERE id = ${res.employeeName}`,
              function (err, res) {
                console.log(res);
                //updateRole(res);
                start()
              }
            );
          })
      }
    )
  }
  
  
