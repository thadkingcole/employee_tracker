// global variables ========================================================= //
// required node modules
const cTable = require("console.table"); // makes better console.table
const inquirer = require("inquirer"); // command line interface
const mysql = require("mysql"); // interacting with mysql server
// required custom modules
const questions = require("./modules/questions");
const sqlQueries = require("./modules/sqlQueries");

// empty arrays to be used later
let departments = [];
let roles = [];

// setup mysql connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees",
});

// functions ================================================================ //
function getData() {
  // update array of departments
  connection.query("SELECT name FROM department", (err, res) => {
    if (err) throw err;
    departments = res.map((row) => row.name);
  });
  // update array of roles
  connection.query("SELECT title FROM role", (err, res) => {
    if (err) throw err;
    roles = res.map((row) => row.title);
  });
}

function stopCLI() {
  console.log("exiting...");
  connection.end();
}

async function viewMode() {
  const { whichView } = await inquirer.prompt(questions.viewQ);
  switch (whichView) {
    case "All Employees":
      connection.query(sqlQueries.viewAllEmployees, (err, res) => {
        if (err) throw err;
        console.log(); // adds blank line to better separate table from prompt
        console.table(res);
        mainMenu();
      });
      break;

    case "Employees by Department":
      const { whichDepartment } = await inquirer.prompt({
        name: "whichDepartment",
        type: "list",
        message: "View employees by which department?",
        choices: departments,
      });
      const departmentQuery = "SELECT * FROM employee WHERE ?";
      connection.query(
        departmentQuery,
        { department: whichDepartment },
        (err, res) => {
          if (err) throw err;
          console.table(res);
          res.forEach((row) => console.log(row.name));
          mainMenu();
        }
      );
      break;

    case "Employees by Role":
      const { whichRole } = await inquirer.prompt({
        name: "whichRole",
        type: "list",
        message: "View employees by what role?",
        choices: roles,
      });
      const roleQuery = "SELECT * FROM employee WHERE ?";
      connection.query(roleQuery, { role: whichRole }, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
      });
      break;

    default:
      return startCLI();
  }
}

function addNew() {
  console.log("add new what?");
  stopCLI();
}

function editMode() {
  console.log("edit mode");
  stopCLI();
}

async function mainMenu() {
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
}

function startCLI() {
  console.log(questions.mainMenu.banner); // displays title banner
  mainMenu();
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
  // get data
  startCLI();
});
