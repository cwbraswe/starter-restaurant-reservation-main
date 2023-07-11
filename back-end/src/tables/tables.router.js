const router = require("express").Router(); //creates a new router object
const controller = require("./tables.controller"); //imports the controller module responsible for handling table-related operations.
const methodNotAllowed = require("../errors/methodNotAllowed"); // imports the methodNotAllowed middleware, which is used to handle unsupported HTTP methods

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed); //get method retrieves tables from tables.controller module, post method associates with the create method/function which creates new table, all attaches middleware 

router.route("/:table_id/seat").put(controller.seat).delete(controller.finish).all(methodNotAllowed);

module.exports = router;