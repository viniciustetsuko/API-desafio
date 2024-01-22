const { Router } = require("express");
const MoviesController = require("../controller/MoviesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const moviesRoutes = Router();
const moviesController = new MoviesController();

moviesRoutes.use( ensureAuthenticated);
moviesRoutes.post("/", moviesController.create);
moviesRoutes.get("/:id", moviesController.show);
moviesRoutes.delete("/:id", moviesController.delete);
moviesRoutes.get("/", moviesController.index);

module.exports = moviesRoutes;