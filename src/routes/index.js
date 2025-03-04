const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/account", require("./account"));
router.use("/upload", require("./upload"));
router.use("/category", require("./category"));
router.use("/product", require("./product"));
router.use("/order", require("./order"));
router.use("/uploaddata", require("./uploadData"));
router.use("/address", require("./address"));
router.use("/shippings", require("./shipping"));
router.use("/payments", require("./payment"));
router.use("/variant", require("./variant"));
router.use("/coupon", require("./coupon"));

module.exports = router;
