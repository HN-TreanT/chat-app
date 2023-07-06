const router = require("express").Router();

const userRoute = require("./user.route");
router.use("/api/auth", userRoute);
module.exports = router;
