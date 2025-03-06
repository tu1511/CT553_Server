const { body, param } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const { validate } = require("../../middlewares/validation");
const ArticleController = require("../../controllers/article");

const express = require("express");
const router = express.Router();

router.get("", validate, asyncHandler(ArticleController.getAll));

router.get("/current", asyncHandler(ArticleController.getCurrent));

router.get(
  "/:articleId",
  param("articleId").notEmpty().withMessage("Article ID is missing"),
  validate,
  asyncHandler(ArticleController.getById)
);
router.use(authentication);

router.post(
  "",
  body("visible").notEmpty().withMessage("Visibility is missing"),
  body("title").notEmpty().withMessage("Title is missing"),
  body("author").notEmpty().withMessage("Author is missing"),
  body("content").notEmpty().withMessage("Content is missing"),
  validate,
  asyncHandler(ArticleController.create)
);

router.put(
  "/:articleId",
  param("articleId").notEmpty().withMessage("Article ID is missing"),
  validate,
  asyncHandler(ArticleController.update)
);

// Hide/Unhide article
router.put(
  "/toggleHide/:articleId",
  param("articleId").notEmpty().withMessage("Article ID is missing"),
  validate,
  asyncHandler(ArticleController.toggleHide)
);

module.exports = router;
