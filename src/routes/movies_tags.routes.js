const { Router } = require("express");
const Movies_tagsController = require("../controller/Movies_tagsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const movies_tagsRoutes = Router();
const movies_tagsController = new Movies_tagsController();

movies_tagsRoutes.get("/", ensureAuthenticated, movies_tagsController.index);

module.exports = movies_tagsRoutes;