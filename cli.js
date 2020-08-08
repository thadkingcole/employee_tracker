// global variables ========================================================= //
// required node modules
require("dotenv").config(); // allows use of env variables
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
  password: process.env.DB_PASSWORD,
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
        type: "rawlist",
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

async function addDept() {
  // get name of new dept
  const { newDept } = await inquirer.prompt(questions.addDept);

  // add new dept to db
  connection.query(sqlQueries.addNewDept, newDept, (err) => {
    if (err) throw err;
    // success!
    console.log("\n", "Successfully added new department: ", newDept, "\n");
    // back to add menu
    addMode();
  });
}

async function addRole() {
  // get name of role
  // get salary for role
  const { title, salary } = await inquirer.prompt(questions.addRole);
  console.log({ title, salary });

  // assign role to a department
  let { department_id } = await inquirer.prompt({
    name: "department_id",
    type: "rawlist",
    message: "Assign role to a department:",
    choices: departments,
    pageSize: departments.length * 2, // all options visible unless window small
  });

  // add role to database
  const newRole = { title, salary, department_id };
  connection.query(sqlQueries.addNewRole, newRole, (err) => {
    if (err) throw err;
    // success!
    console.log("\n", "Successfully added new role: ", title, "\n");
    // back to add menu
    addMode();
  });
}

async function addEmployee() {
  // get first and last name of employee
  const { first_name, last_name } = await inquirer.prompt(
    questions.addEmployee
  );

  // assign employee a role
  var { role_id } = await inquirer.prompt({
    name: "role_id",
    type: "rawlist",
    message: "Select role for new employee:",
    choices: roles,
    pageSize: roles.length * 2, // all options visible unless window small
  });

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
    // success!
    console.log(
      "\n Successfully added new employee: ",
      first_name,
      last_name,
      "\n"
    );
    // back to add menu
    addMode();
  });
}

async function addMode() {
  // something might have been added, lets update data
  getData();
  const { addWhat } = await inquirer.prompt(questions.addQ);
  switch (addWhat) {
    // add new employee
    case "employee":
      addEmployee();
      break;

    // add new role
    case "role":
      addRole();
      break;

    // add new dept
    case "dept":
      addDept();
      break;

    // back to main menu
    default:
      startCLI();
  }
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
      addMode();
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
    - [x] view all
          - [x] employees,
          - [x] departments,
          - [x] roles
    - [x] add
          - [x] employee,
          - [x] department,
          - [x] role
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
  // start app
  startCLI();
});
