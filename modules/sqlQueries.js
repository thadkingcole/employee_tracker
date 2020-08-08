// collection of sql queries to make for cli.js

// view detailed list of all employees
const viewAllEmployees =
  "SELECT e.first_name, e.last_name, title, name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON department_id = department.id";

// view employees by department
const viewEmployeesByDept = viewAllEmployees + " WHERE ?";

// view list of departments - also used to get department ids
const viewDepartments = "SELECT id, name FROM department";

// get role ids
const getRoleIds = "SELECT id, title FROM role";

// view list of roles
const viewRoles =
  "SELECT title, salary, name AS department FROM role INNER JOIN department ON role.department_id = department.id;";

// get employee ids
const getEmployeeIds = "SELECT id, first_name, last_name FROM employee";

// add employee
const addNewEmployee = "INSERT INTO employee SET ?";

// add role
const addNewRole = "INSERT INTO role SET ?";

// exporting the queries
module.exports = {
  viewAllEmployees,
  viewEmployeesByDept,
  viewDepartments,
  getRoleIds,
  viewRoles,
  getEmployeeIds,
  addNewEmployee,
  addNewRole,
};
