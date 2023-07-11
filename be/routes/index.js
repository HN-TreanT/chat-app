const router = require("express").Router();

const userRoute = require("./user.route");
const requestRoute = require("./request.route");
router.use("/api/auth", userRoute);
router.use("/api/request", requestRoute);
module.exports = router;
