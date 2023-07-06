const router = require("express").Router();
const userController = require("../controller/users.controller");
router.get("/", userController.getAll);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:email", userController.getUserById);
module.exports = router;
