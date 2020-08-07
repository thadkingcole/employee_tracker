// collection of sql queries to make for cli.js
const viewAllEmployees =
  "SELECT e.id, e.first_name, e.last_name, title, name as department, salary, CONCAT(m.first_name, ' ', m.last_name) as manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON department_id = department.id";

// exporting the queries
module.exports = { viewAllEmployees: viewAllEmployees };
