const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/account", require("./account"));
router.use("/upload", require("./upload"));
router.use("/category", require("./category"));
router.use("/product", require("./product"));

module.exports = router;
