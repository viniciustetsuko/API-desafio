const { Router } = require("express");
const Movies_tagsController = require("../controller/Movies_tagsController");

const movies_tagsRoutes = Router();
const movies_tagsController = new Movies_tagsController();

movies_tagsRoutes.get("/:user_id", movies_tagsController.index);

module.exports = movies_tagsRoutes;