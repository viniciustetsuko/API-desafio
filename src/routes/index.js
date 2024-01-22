const { Router } = require("express");
const userRoutes = require("./users.routes");
const moviesRoutes = require("./movies.routes");
const movies_tagsRoutes = require("./movies_tags.routes");
const sessionRoutes = require("./sessions.routes");

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/movies", moviesRoutes);
routes.use("/movies_tags", movies_tagsRoutes);
routes.use("/session", sessionRoutes);

module.exports = routes;

