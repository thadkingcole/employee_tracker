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
function stopCLI() {
  console.log("exiting...");
  connection.end();
}

function getData() {
  // function to update various arrays used within inquirer prompts

  // update array of departments
  connection.query(sqlQueries.viewDepartments, (err, res) => {
    if (err) throw err;
    departments = res.map((row) => {
      return { name: row.name, value: row.id };
    });
  });

  // update array of roles
  connection.query(sqlQueries.getRoleIds, (err, res) => {
    if (err) throw err;
    roles = res.map((row) => {
      return { name: row.title, value: row.id };
    });
  });
}

async function viewMode() {
  const { whichView } = await inquirer.prompt(questions.viewQ);
  switch (whichView) {
    case "All Employees":
      connection.query(sqlQueries.viewAllEmployees, (err, res) => {
        if (err) throw err;
        console.table("\n", res);
        viewMode();
      });
      break;

    case "Employees by Department":
      const { whichDepartment } = await inquirer.prompt({
        name: "whichDepartment",
        type: "list",
        message: "View employees by which department?",
        choices: departments.map((dept) => dept.name),
      });
      connection.query(
        sqlQueries.viewEmployeesByDept,
        { name: whichDepartment },
        (err, res) => {
          if (err) throw err;
          console.table("\n", res);
          viewMode();
        }
      );
      break;

    case "All Roles":
      connection.query(sqlQueries.viewRoles, (err, res) => {
        if (err) throw err;
        console.table("\n", res);
        viewMode();
      });
      break;

    default:
      startCLI();
      break;
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

async function startCLI() {
  // update data which each return to main menu as something might have changed
  getData();
  console.log(questions.mainMenu.banner); // displays title banner
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
    - [ ] view all
          - [x] employees,
          - [x] departments,
          - [x] roles
    - [ ] add
          - [ ] employee,
          - [ ] department,
          - [ ] role
    - [ ] update employee role
  */

  /* bonus:
    - [ ] update employee managers
    - [ ] view employees by manager
    - [ ] delete
          - [ ] department(s),
          - [ ] role(s),
          - [ ] employee(s)
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
