// collection of sql queries to make for cli.js

// view detailed list of all employees
const viewAllEmployees = "SELECT e.id, e.first_name, e.last_name, title, name as department, salary, CONCAT(m.first_name, ' ', m.last_name) as manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON department_id = department.id";

// view employees by department
const viewEmployeesByDept = viewAllEmployees + " WHERE ?";

// view list of departments
const viewDepartments = "SELECT name FROM department";

// view list of roles
const viewRoles = "SELECT title FROM role";

// exporting the queries
module.exports = {
  viewAllEmployees,
  viewEmployeesByDept,
  viewDepartments,
  viewRoles,
};
