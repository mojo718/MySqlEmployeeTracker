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

function Start() {
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
    .then(function(res) {
        switch (res.start) {
            




        }

    }





        }
    ])
}









// function to view employees
// function to add employees
// function to remove employees

//function to view departments
// function to add departments
// function to remove departments

//function to view roles
// function to add roles
// function to remove roles

