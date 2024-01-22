const { Router } = require("express");
const UsersController = require("../controller/UsersController");
const UserAvatarController = require("../controller/UserAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const multer = require("multer");
const uploadConfig = require("../config/upload");

const userRoutes = Router();
const upload = multer(uploadConfig.MULTER);
const usercController = new UsersController();
const userAvatarController = new UserAvatarController();

userRoutes.post("/", usercController.create);
userRoutes.put("/", ensureAuthenticated, usercController.update);
userRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

module.exports = userRoutes;