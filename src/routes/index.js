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
router.use("/variant", require("./variant"));
router.use("/coupon", require("./coupon"));
router.use("/article", require("./article"));
router.use("/review", require("./review"));
router.use("/policy", require("./policy"));
router.use("/banner", require("./banner"));
router.use("/shopInfo", require("./shopInfo"));
router.use("/payments", require("./payment"));

module.exports = router;
