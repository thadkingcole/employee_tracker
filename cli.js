// global variables ========================================================= //
// required modules
const cTable = require("console.table")
const inquirer = require("inquirer");
const mysql = require("mysql");

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

function startCLI() {
  const query = "SELECT * FROM employee"
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    stopCLI();
  })
}

// main ===================================================================== //
// connect to mysql & start app
connection.connect(function (err) {
  if (err) throw err;
  console.log("connection successful!");
  startCLI();
});
