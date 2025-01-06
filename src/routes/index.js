const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/account", require("./account"));

module.exports = router;
