// global variables ========================================================= //
// required modules
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
  console.log("exiting...")
  connection.end();
}

function startCLI() {
  console.log("connection successful!");
  stopCLI();
}

// main ===================================================================== //
// connect to mysql & start app
connection.connect(function(err) {
  if (err) throw err;
  startCLI();
})
