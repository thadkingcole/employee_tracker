// a collection of questions/interfaces to be used by cli.js

const mainMenu = {
  // what the user sees when they start the program
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
    type: "list",
    message: "What would you like to do?",
    choices: ["View Mode", "Add New", "Edit Mode", "Exit"],
  },
};

// view mode questions
const viewQ = {
  // what does the user want to view?
  name: "whichView",
  type: "list",
  message: "What would you like to view?",
  choices: [
    "All Employees",
    "All Roles",
    "All Departments",
    "Back to Main Menu",
  ],
};
//

// module exports
module.exports = { mainMenu: mainMenu, viewQ: viewQ };
