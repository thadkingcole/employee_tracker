// a collection of questions/views to be used by cli.js

// require inquirer
const inquirer = require("inquirer");

// what the user sees when they start the program
const mainMenu = {
  banner: `
* ============================================================================ *
|    _______  __   __  _______  ___      _______  __   __  _______  _______    |
|   |       ||  |_|  ||       ||   |    |       ||  | |  ||       ||       |   |
|   |    ___||       ||    _  ||   |    |   _   ||  |_|  ||    ___||    ___|   |
|   |   |___ |       ||   |_| ||   |    |  | |  ||       ||   |___ |   |___    |
|   |    ___||       ||    ___||   |___ |  |_|  ||_     _||    ___||    ___|   |
|   |   |___ | ||_|| ||   |    |       ||       |  |   |  |   |___ |   |___    |
|   |_______||_|   |_||___|    |_______||_______|  |___|  |_______||_______|   |
|        __   __  _______  __    _  _______  _______  _______  ______          |
|       |  |_|  ||   _   ||  |  | ||   _   ||       ||       ||    _ |         |
|       |       ||  |_|  ||   |_| ||  |_|  ||    ___||    ___||   | ||         |
|       |       ||       ||       ||       ||   | __ |   |___ |   |_||_        |
|       |       ||       ||  _    ||       ||   ||  ||    ___||    __  |       |
|       | ||_|| ||   _   || | |   ||   _   ||   |_| ||   |___ |   |  | |       |
|       |_|   |_||__| |__||_|  |__||__| |__||_______||_______||___|  |_|       |
|                                                                              |
* ============================================================================ *
`,
  // the first question asked to the user
  menu: {
    name: "mode",
    type: "rawlist",
    message: "What would you like to do?",
    choices: [
      // view mode
      {
        name: "View Mode",
        value: "view",
      },
      // add employee
      {
        name: "Add Mode",
        value: "add",
      },
      // edit mode
      {
        name: "Update an employee's role",
        value: "update",
      },
      new inquirer.Separator(),
      "Exit",
    ],
  },
};

// view mode questions
const viewQ = {
  // what does the user want to view?
  name: "whichView",
  type: "rawlist",
  message: "What would you like to view?",
  choices: [
    // view all employees
    {
      name: "All Employees",
      value: "employees",
    },
    // view employees by department
    {
      name: "Employees by Department",
      value: "by dept",
    },
    // view list of all roles
    {
      name: "All Roles",
      value: "roles",
    },
    new inquirer.Separator(),
    "Main Menu",
  ],
};

// add mode qs
const addQ = {
  name: "addWhat",
  type: "rawlist",
  message: "What would you like to add?",
  choices: [
    {
      name: "New Department",
      value: "dept",
    },
    {
      name: "New Role",
      value: "role",
    },
    {
      name: "New employee",
      value: "employee",
    },
    new inquirer.Separator(),
    "Main Menu",
  ],
};

// add employee (get name)
const addEmployee = [
  {
    name: "first_name",
    type: "input",
    message: `Enter the following information about new employee:
  First Name:`,
  },
  {
    name: "last_name",
    type: "input",
    message: "Last Name:",
  },
];

// add new role
const addRole = [
  {
    name: "title",
    type: "input",
    message: "Enter the name of the new role",
  },
  {
    name: "salary",
    type: "input",
    message: "Enter salary for new role",
    validate: (value) =>
      Number.isInteger(parseInt(value, 10)) && parseInt(value, 10) > 0
        ? true
        : "Enter a valid salary (positive integer)",
  },
];

const addDept = {
  name: "newDept",
  type: "input",
  message: "Enter the name of the new department:",
};

// module exports
module.exports = { mainMenu, viewQ, addQ, addEmployee, addRole, addDept };
