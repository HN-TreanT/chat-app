const router = require("express").Router();

const userRoute = require("./user.route");
const requestRoute = require("./request.route");
const messageRoute = require("./messages.route");
router.use("/api/auth", userRoute);
router.use("/api/request", requestRoute);
router.use("/api/messages", messageRoute);
module.exports = router;
