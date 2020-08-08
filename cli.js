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
let employees = [];

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
    departments = res.map((dept) => {
      return { name: dept.name, value: dept.id };
    });
  });

  // update array of roles
  connection.query(sqlQueries.getRoleIds, (err, res) => {
    if (err) throw err;
    roles = res.map((role) => {
      return { name: role.title, value: role.id };
    });
  });

  // update array of employees
  connection.query(sqlQueries.getEmployeeIds, (err, res) => {
    if (err) throw err;
    employees = res.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
  });
}

async function viewMode() {
  const { whichView } = await inquirer.prompt(questions.viewQ);
  switch (whichView) {
    case "employees":
      connection.query(sqlQueries.viewAllEmployees, (err, res) => {
        if (err) throw err;
        console.table("\n", res);
        viewMode();
      });
      break;

    case "by dept":
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

    case "roles":
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

async function addEmployee() {
  // get first and last name of employee
  const { first_name, last_name } = await inquirer.prompt(
    questions.addEmployee
  );

  // assign employee a role (could be a new role)
  roles.push(new inquirer.Separator(), {
    name: "Add new role not listed here",
    value: "new",
  });
  const { role_id } = await inquirer.prompt({
    name: "role_id",
    type: "rawlist",
    message: "Select role for new employee:",
    choices: roles,
    pageSize: roles.length * 2, // all options visible unless window small
  });
  if (role_id === "new") {
    // TODO new role needs to be added
    addRole();
  }
  // assign employee a manager (could be none/null)
  employees.push(new inquirer.Separator(), "No Manager");
  let { manager_id } = await inquirer.prompt({
    name: "manager_id",
    type: "rawlist",
    message: "Assign new employee a manager:",
    choices: employees,
    pageSize: employees.length * 2, // all options visible unless window small
  });
  if (manager_id === "No Manager") manager_id = null;
  // add employee to database
  const newEmployee = { first_name, last_name, role_id, manager_id };
  connection.query(sqlQueries.addNewEmployee, newEmployee, (err, res) => {
    if (err) throw err;
    console.log("added ", first_name, last_name);
  });
  startCLI();
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
    // view mode
    case "view":
      viewMode();
      break;

    // add employee
    case "add":
      addEmployee();
      break;

    // edit mode
    case "edit":
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
          - [x] employee,
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
