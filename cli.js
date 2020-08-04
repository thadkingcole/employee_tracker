// global variables ========================================================= //
// required node modules
const cTable = require("console.table"); // makes better console.table
const inquirer = require("inquirer"); // command line interface
const mysql = require("mysql"); // interacting with mysql server
// required custom modules
const questions = require("./modules/questions");

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

function viewMode() {
  console.log("view mode");
  stopCLI();
}

function addNew() {
  console.log("add new what?");
  stopCLI();
}

function editMode() {
  console.log("edit mode");
  stopCLI();
}

async function startCLI() {
  // title screen
  console.log(questions.mainMenu.banner);
  const { mode } = await inquirer.prompt(questions.mainMenu.menu);
  switch (mode) {
    case "View Mode":
      viewMode();
      break;
    case "Add New":
      addNew();
      break;
    case "Edit Mode":
      editMode();
      break;
    default:
      stopCLI();
      break;
  }
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
}

// main ===================================================================== //
// connect to mysql & start app
connection.connect(function (err) {
  if (err) throw err;
  startCLI();
});
