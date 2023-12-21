const { Router } = require("express");
const UsersController = require("../controller/UsersController");

const userRoutes = Router();
const usercController = new UsersController();

userRoutes.post("/", usercController.create);
userRoutes.put("/:id", usercController.update);

module.exports = userRoutes;