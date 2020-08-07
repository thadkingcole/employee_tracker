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
      "View Mode",
      "Add New",
      "Edit Mode",
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
    "All Employees",
    "Employees by Department",
    "All Roles",
    new inquirer.Separator(),
    "Main Menu",
  ],
};
//

// module exports
module.exports = { mainMenu, viewQ };
