// global variables ========================================================= //
// required modules
const cTable = require("console.table"); // makes better console.table
const inquirer = require("inquirer"); // command line interface
const mysql = require("mysql"); // interacting with mysql server

// setup mysql connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees",
});

// functions ================================================================ //
function stopCLI() {
  console.log("exiting...");
  connection.end();
}

function startCLI() {
  // title screen
  // main menu

  /* minimum:
    - [ ] view all employees, departments, roles
    - [ ] add employee, department, role
    - [ ] update employee role
  */

  /* bonus:
    - [ ] update employee managers
    - [ ] view employees by manager
    - [ ] delete department(s), role(s), employee(s)
    - [ ] View the total utilized budget of a department 
          i.e. the combined salaries of all employees in that department
  */

  stopCLI();
}

// main ===================================================================== //
// connect to mysql & start app
connection.connect(function (err) {
  if (err) throw err;
  console.log("connection successful!");
  startCLI();
});
