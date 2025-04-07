const { validate } = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const SendEmailController = require("../../controllers/sendEmail");

const router = require("express").Router();

router.post("/", asyncHandler(SendEmailController.sendEmail));

module.exports = router;
