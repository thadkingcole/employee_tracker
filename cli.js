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
  console.clear();
  console.log("goodbye!");
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
      console.clear();
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
      console.clear();
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
      console.clear();
      connection.query(sqlQueries.viewRoles, (err, res) => {
        if (err) throw err;
        console.table("\n", res);
        viewMode();
      });
      break;

    default:
      console.clear();
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
  const { role_id } = await inquirer.prompt({
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
      console.clear();
      startCLI();
  }
}

async function changeRole() {
  // update an employee's role
  // add back button to employee array
  employees.push(new inquirer.Separator(), "Main Menu");

  // first, select which employee to update
  const { employeeToUpdate } = await inquirer.prompt({
    name: "employeeToUpdate",
    type: "rawlist",
    message: "Select the employee to change their role:",
    choices: employees,
    pageSize: employees.length * 2,
  });

  // handle going back to main menu
  if (employeeToUpdate === "Main Menu") {
    startCLI();
  } else {
    // an employee was selected, let's change their role
    // select the new role to assign them.
    const { role_id } = await inquirer.prompt({
      name: "role_id",
      type: "rawlist",
      message: "Select role for new employee:",
      choices: roles,
      pageSize: roles.length * 2, // all options visible unless window small
    });

    // add updated role to db
    connection.query(
      sqlQueries.changeRole,
      [{ role_id }, { id: employeeToUpdate }],
      (err) => {
        if (err) throw err;
        // success!
        console.clear();
        console.log("\nSuccessfully updated role!\n");
        startCLI();
      }
    );
  }
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
    case "update":
      changeRole();
      break;

    default:
      stopCLI();
      break;
  }
}

// main ===================================================================== //
// connect to mysql & start app
connection.connect(function (err) {
  if (err) throw err;
  // start app
  console.clear();
  startCLI();
});
